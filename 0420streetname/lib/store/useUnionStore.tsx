'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { Table, Order, MenuItem, EventRoom, KitchenStation, ItemStatus, CourseNumber, SplitCheck, OrderItem } from '../types';
import { INITIAL_TABLES } from '../data/tables';
import { INITIAL_ORDERS } from '../data/orders';
import { MENU_ITEMS } from '../data/menu';
import { INITIAL_EVENTS } from '../data/events';
import { sound } from '../audio';

interface UnionStoreContextType {
  tables: Table[];
  orders: Order[];
  menu: MenuItem[];
  events: EventRoom[];
  activeTableId: string | null;
  activeStation: KitchenStation | 'all';
  eightySixList: string[];
  currentServer: string;
  setActiveTableId: (id: string | null) => void;
  setActiveStation: (st: KitchenStation | 'all') => void;
  setCurrentServer: (name: string) => void;
  seatTable: (tableId: string, guestCount: number, serverName: string, vipNote?: string) => void;
  addItemToOrder: (tableId: string, menuItemId: string, seatNumber: number | 'shared', course?: CourseNumber, mods?: string[]) => void;
  removeItemFromOrder: (tableId: string, orderItemId: string) => void;
  fireCourse: (tableId: string, course: CourseNumber) => void;
  sendOrder: (tableId: string) => void;
  updateItemStatus: (orderItemId: string, status: ItemStatus) => void;
  bumpCourse: (orderId: string, course: CourseNumber) => void;
  autoSplitBySeat: (tableId: string) => void;
  settleCheck: (tableId: string, checkId: string, method: SplitCheck['paymentMethod']) => void;
  closeTable: (tableId: string) => void;
  toggle86: (menuItemId: string) => void;
  decrementCellar: (menuItemId: string) => void;
  resetDemo: () => void;
  activeOrder: Order | null;
  activeTable: Table | null;
}

const UnionStoreContext = createContext<UnionStoreContextType | null>(null);

const STORAGE_KEY = 'union_os_240_state_v1';
const BROADCAST_CHANNEL = 'union_os_channel';

export const UnionStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tables, setTables] = useState<Table[]>(INITIAL_TABLES);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [menu, setMenu] = useState<MenuItem[]>(MENU_ITEMS);
  const [events, setEvents] = useState<EventRoom[]>(INITIAL_EVENTS);
  const [eightySixList, setEightySixList] = useState<string[]>(['app-octopus']); // Spanish Octopus initially low/86'd demo
  const [activeTableId, setActiveTableId] = useState<string | null>('tbl-23'); // Default to 6-top federal lunch
  const [activeStation, setActiveStation] = useState<KitchenStation | 'all'>('all');
  const [currentServer, setCurrentServer] = useState<string>('Marcus T.');

  const localVersionRef = React.useRef<number>(0);

  // Load from server and localStorage on client mount
  useEffect(() => {
    // Initial fetch from server
    fetch('/api/sync')
      .then(res => res.json())
      .then(data => {
        if (data.tables) setTables(data.tables);
        if (data.orders) setOrders(data.orders);
        if (data.menu) setMenu(data.menu);
        if (data.events) setEvents(data.events);
        if (data.eightySixList) setEightySixList(data.eightySixList);
        if (data.version) localVersionRef.current = data.version;
      })
      .catch(() => {
        // Fallback to localStorage
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.tables) setTables(parsed.tables);
            if (parsed.orders) setOrders(parsed.orders);
            if (parsed.menu) setMenu(parsed.menu);
            if (parsed.events) setEvents(parsed.events);
            if (parsed.eightySixList) setEightySixList(parsed.eightySixList);
          }
        } catch {
          // Ignore
        }
      });
  }, []);

  // Poll server every 1200ms for real-time multi-device sync (phone <-> laptop)
  useEffect(() => {
    const interval = setInterval(() => {
      fetch('/api/sync')
        .then(res => res.json())
        .then(data => {
          if (data.version && data.version > localVersionRef.current) {
            localVersionRef.current = data.version;
            if (data.tables) setTables(data.tables);
            if (data.orders) setOrders(data.orders);
            if (data.menu) setMenu(data.menu);
            if (data.events) setEvents(data.events);
            if (data.eightySixList) setEightySixList(data.eightySixList);

            if (data.sound === 'PLAY_FIRE') {
              sound.playKitchenFire();
            } else if (data.sound === 'PLAY_BUMP') {
              sound.playItemBump();
            }
          }
        })
        .catch(() => {});
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  // Broadcast sync & save to server & localStorage helper
  const syncState = useCallback((
    newTables: Table[], 
    newOrders: Order[], 
    newMenu: MenuItem[], 
    newEvents: EventRoom[], 
    new86: string[],
    soundToTrigger?: 'PLAY_FIRE' | 'PLAY_BUMP'
  ) => {
    const newVersion = Date.now();
    localVersionRef.current = newVersion;

    const payload = {
      tables: newTables,
      orders: newOrders,
      menu: newMenu,
      events: newEvents,
      eightySixList: new86,
      sound: soundToTrigger || null,
      version: newVersion,
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

      // Same-browser instant broadcast
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const channel = new BroadcastChannel(BROADCAST_CHANNEL);
        channel.postMessage({ type: 'STATE_UPDATE', payload });
        if (soundToTrigger) {
          channel.postMessage({ type: soundToTrigger });
        }
        channel.close();
      }

      // Cross-device HTTP post
      fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {});
    } catch {
      // Ignore
    }
  }, []);

  // Listen for broadcasts from other tabs on same device
  useEffect(() => {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return;
    const channel = new BroadcastChannel(BROADCAST_CHANNEL);
    channel.onmessage = (event) => {
      if (event.data?.type === 'STATE_UPDATE') {
        const p = event.data.payload;
        if (p.tables) setTables(p.tables);
        if (p.orders) setOrders(p.orders);
        if (p.menu) setMenu(p.menu);
        if (p.events) setEvents(p.events);
        if (p.eightySixList) setEightySixList(p.eightySixList);
        if (p.version) localVersionRef.current = p.version;
      } else if (event.data?.type === 'PLAY_FIRE') {
        sound.playKitchenFire();
      } else if (event.data?.type === 'PLAY_BUMP') {
        sound.playItemBump();
      }
    };
    return () => {
      channel.close();
    };
  }, []);

  const broadcastSound = (soundType: 'PLAY_FIRE' | 'PLAY_BUMP') => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel(BROADCAST_CHANNEL);
      channel.postMessage({ type: soundType });
      channel.close();
    }
  };

  // 1. Seat a Table
  const seatTable = useCallback((tableId: string, guestCount: number, serverName: string, vipNote?: string) => {
    const orderId = `ord-${Date.now()}`;
    const targetTable = tables.find(t => t.id === tableId);
    if (!targetTable) return;

    const newOrder: Order = {
      id: orderId,
      tableId,
      tableNumber: targetTable.number,
      serverName,
      guestCount,
      createdAt: Date.now(),
      status: 'open',
      items: [],
      notes: vipNote,
    };

    const nextTables = tables.map(t => {
      if (t.id === tableId) {
        return {
          ...t,
          status: 'seated' as const,
          serverName,
          guestCount,
          seatedAt: Date.now(),
          vipNote,
          currentOrderId: orderId,
        };
      }
      return t;
    });

    const nextOrders = [...orders, newOrder];
    setTables(nextTables);
    setOrders(nextOrders);
    syncState(nextTables, nextOrders, menu, events, eightySixList);
  }, [tables, orders, menu, events, eightySixList, syncState]);

  // 2. Add Item to Table Order
  const addItemToOrder = useCallback((
    tableId: string, 
    menuItemId: string, 
    seatNumber: number | 'shared', 
    course?: CourseNumber, 
    mods: string[] = []
  ) => {
    const itemDef = menu.find(m => m.id === menuItemId);
    if (!itemDef) return;

    const assignedCourse = course || itemDef.courseDefault;
    const newItem: OrderItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      menuItemId,
      name: itemDef.name,
      price: itemDef.price,
      seatNumber,
      course: assignedCourse,
      station: itemDef.station,
      mods,
      status: 'draft',
      sentAt: Date.now(),
    };

    const nextOrders = orders.map(ord => {
      if (ord.tableId === tableId && ord.status === 'open') {
        return {
          ...ord,
          items: [...ord.items, newItem],
        };
      }
      return ord;
    });

    setOrders(nextOrders);
    syncState(tables, nextOrders, menu, events, eightySixList);
  }, [menu, orders, tables, events, eightySixList, syncState]);

  // 3. Remove item from order
  const removeItemFromOrder = useCallback((tableId: string, orderItemId: string) => {
    const nextOrders = orders.map(ord => {
      if (ord.tableId === tableId && ord.status === 'open') {
        return {
          ...ord,
          items: ord.items.filter(i => i.id !== orderItemId),
        };
      }
      return ord;
    });
    setOrders(nextOrders);
    syncState(tables, nextOrders, menu, events, eightySixList);
  }, [orders, tables, menu, events, eightySixList, syncState]);

  // 4. Send newly added draft items to kitchen
  const sendOrder = useCallback((tableId: string) => {
    sound.playKitchenFire();
    broadcastSound('PLAY_FIRE');

    const nextOrders = orders.map(ord => {
      if (ord.tableId === tableId && ord.status === 'open') {
        const updatedItems = ord.items.map(item => {
          if (item.status === 'draft') {
            // Course 1 automatically fires upon send, higher courses go to HOLD
            return {
              ...item,
              status: item.course === 1 ? ('fire' as const) : ('hold' as const),
              firedAt: item.course === 1 ? Date.now() : undefined,
            };
          }
          return item;
        });
        return { ...ord, items: updatedItems };
      }
      return ord;
    });

    const nextTables = tables.map(t => {
      if (t.id === tableId) {
        return { ...t, status: 'apps_fired' as const };
      }
      return t;
    });

    setOrders(nextOrders);
    setTables(nextTables);
    syncState(nextTables, nextOrders, menu, events, eightySixList, 'PLAY_FIRE');
  }, [orders, tables, menu, events, eightySixList, syncState]);

  // 5. Fire Course explicitly (e.g. Server hits "FIRE ENTREES")
  const fireCourse = useCallback((tableId: string, course: CourseNumber) => {
    sound.playKitchenFire();
    broadcastSound('PLAY_FIRE');

    const nextOrders = orders.map(ord => {
      if (ord.tableId === tableId && ord.status === 'open') {
        const updatedItems = ord.items.map(item => {
          if (item.course === course && (item.status === 'hold' || item.status === 'prep' || item.status === 'draft')) {
            return {
              ...item,
              status: 'fire' as const,
              firedAt: Date.now(),
            };
          }
          return item;
        });
        return { ...ord, items: updatedItems };
      }
      return ord;
    });

    const nextTables = tables.map(t => {
      if (t.id === tableId) {
        const newStatus = course === 3 ? 'entrees_fired' : course === 4 ? 'dessert' : t.status;
        return { ...t, status: newStatus as Table['status'] };
      }
      return t;
    });

    setOrders(nextOrders);
    setTables(nextTables);
    syncState(nextTables, nextOrders, menu, events, eightySixList, 'PLAY_FIRE');
  }, [orders, tables, menu, events, eightySixList, syncState]);

  // 6. Update single item status (KDS Line Cooks advance/bump items)
  const updateItemStatus = useCallback((orderItemId: string, status: ItemStatus) => {
    sound.playItemBump();
    broadcastSound('PLAY_BUMP');

    const nextOrders = orders.map(ord => {
      const hasItem = ord.items.some(i => i.id === orderItemId);
      if (!hasItem) return ord;

      const nextItems = ord.items.map(item => {
        if (item.id === orderItemId) {
          return {
            ...item,
            status,
            platedAt: status === 'plated' ? Date.now() : item.platedAt,
          };
        }
        return item;
      });
      return { ...ord, items: nextItems };
    });

    setOrders(nextOrders);
    syncState(tables, nextOrders, menu, events, eightySixList, 'PLAY_BUMP');
  }, [orders, tables, menu, events, eightySixList, syncState]);

  // 7. Bump entire course on KDS Expo
  const bumpCourse = useCallback((orderId: string, course: CourseNumber) => {
    sound.playItemBump();
    broadcastSound('PLAY_BUMP');

    const nextOrders = orders.map(ord => {
      if (ord.id === orderId) {
        const nextItems = ord.items.map(item => {
          if (item.course === course) {
            return { ...item, status: 'bumped' as const, platedAt: Date.now() };
          }
          return item;
        });
        return { ...ord, items: nextItems };
      }
      return ord;
    });

    setOrders(nextOrders);
    syncState(tables, nextOrders, menu, events, eightySixList, 'PLAY_BUMP');
  }, [orders, tables, menu, events, eightySixList, syncState]);

  // 8. Auto-Split by Seat (The Denver Federal Center Lunch Solution)
  const autoSplitBySeat = useCallback((tableId: string) => {
    const order = orders.find(o => o.tableId === tableId && o.status === 'open');
    if (!order) return;

    // Discover all seats represented
    const seatSet = new Set<number>();
    order.items.forEach(i => {
      if (typeof i.seatNumber === 'number') {
        seatSet.add(i.seatNumber);
      }
    });

    const activeSeats = Array.from(seatSet).sort((a, b) => a - b);
    if (activeSeats.length === 0) {
      for (let s = 1; s <= (order.guestCount || 1); s++) {
        activeSeats.push(s);
      }
    }

    // Identify shared items vs individual items
    const sharedItems = order.items.filter(i => i.seatNumber === 'shared');
    const sharedTotal = sharedItems.reduce((sum, item) => sum + item.price, 0);
    const sharedPerSeat = activeSeats.length > 0 ? sharedTotal / activeSeats.length : 0;

    const splitChecks: SplitCheck[] = activeSeats.map((seatNum, idx) => {
      const seatItems = order.items.filter(i => i.seatNumber === seatNum);
      const seatSubtotal = seatItems.reduce((sum, item) => sum + item.price, 0) + sharedPerSeat;
      const tax = Math.round(seatSubtotal * 0.0825 * 100) / 100; // Lakewood 8.25%
      // 20% auto-grat if party of 6+
      const autoGrat = order.guestCount >= 6 ? Math.round(seatSubtotal * 0.20 * 100) / 100 : 0;
      const total = Math.round((seatSubtotal + tax + autoGrat) * 100) / 100;

      return {
        id: `chk-${order.id}-seat-${seatNum}`,
        checkNumber: idx + 1,
        seatNumbers: [seatNum],
        itemIds: seatItems.map(i => i.id),
        subtotal: Math.round(seatSubtotal * 100) / 100,
        tax,
        autoGrat,
        total,
        paymentStatus: 'unpaid',
      };
    });

    const nextOrders = orders.map(ord => {
      if (ord.id === order.id) {
        return { ...ord, splitChecks };
      }
      return ord;
    });

    setOrders(nextOrders);
    syncState(tables, nextOrders, menu, events, eightySixList);
  }, [orders, tables, menu, events, eightySixList, syncState]);

  // 9. Settle a split check
  const settleCheck = useCallback((tableId: string, checkId: string, method: SplitCheck['paymentMethod']) => {
    sound.playPaymentSettled();

    let allChecksPaid = false;
    const nextOrders = orders.map(ord => {
      if (ord.tableId === tableId && ord.status === 'open' && ord.splitChecks) {
        const nextChecks = ord.splitChecks.map(chk => {
          if (chk.id === checkId) {
            return {
              ...chk,
              paymentStatus: 'paid' as const,
              paymentMethod: method,
              paidAt: Date.now(),
            };
          }
          return chk;
        });

        allChecksPaid = nextChecks.every(c => c.paymentStatus === 'paid');
        return { ...ord, splitChecks: nextChecks };
      }
      return ord;
    });

    let nextTables = tables;
    if (allChecksPaid) {
      nextTables = tables.map(t => {
        if (t.id === tableId) {
          return { ...t, status: 'paid' as const };
        }
        return t;
      });
    }

    setOrders(nextOrders);
    setTables(nextTables);
    syncState(nextTables, nextOrders, menu, events, eightySixList);
  }, [orders, tables, menu, events, eightySixList, syncState]);

  // 10. Close and wipe table
  const closeTable = useCallback((tableId: string) => {
    const nextTables = tables.map(t => {
      if (t.id === tableId) {
        return {
          ...t,
          status: 'vacant' as const,
          serverName: undefined,
          seatedAt: undefined,
          guestCount: undefined,
          vipNote: undefined,
          currentOrderId: undefined,
        };
      }
      return t;
    });

    const nextOrders = orders.map(ord => {
      if (ord.tableId === tableId && ord.status === 'open') {
        return { ...ord, status: 'closed' as const };
      }
      return ord;
    });

    setTables(nextTables);
    setOrders(nextOrders);
    syncState(nextTables, nextOrders, menu, events, eightySixList);
  }, [tables, orders, menu, events, eightySixList, syncState]);

  // 11. 86 Board Toggle
  const toggle86 = useCallback((menuItemId: string) => {
    let next86: string[];
    if (eightySixList.includes(menuItemId)) {
      next86 = eightySixList.filter(id => id !== menuItemId);
    } else {
      next86 = [...eightySixList, menuItemId];
    }
    setEightySixList(next86);
    syncState(tables, orders, menu, events, next86);
  }, [eightySixList, tables, orders, menu, events, syncState]);

  // 12. Decrement Cellar stock
  const decrementCellar = useCallback((menuItemId: string) => {
    const nextMenu = menu.map(m => {
      if (m.id === menuItemId && m.wineDetails) {
        const nextStock = Math.max(0, m.wineDetails.cellarStock - 1);
        if (nextStock === 0 && !eightySixList.includes(menuItemId)) {
          setEightySixList(prev => [...prev, menuItemId]);
        }
        return {
          ...m,
          wineDetails: {
            ...m.wineDetails,
            cellarStock: nextStock,
          },
        };
      }
      return m;
    });

    setMenu(nextMenu);
    syncState(tables, orders, nextMenu, events, eightySixList);
  }, [menu, eightySixList, tables, orders, events, syncState]);

  // 13. Reset Demo State
  const resetDemo = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    fetch('/api/sync?reset=true').catch(() => {});
    setTables(INITIAL_TABLES);
    setOrders(INITIAL_ORDERS);
    setMenu(MENU_ITEMS);
    setEvents(INITIAL_EVENTS);
    setEightySixList(['app-octopus']);
    setActiveTableId('tbl-23');
    setActiveStation('all');
    setCurrentServer('Marcus T.');
  }, []);

  const activeTable = useMemo(() => tables.find(t => t.id === activeTableId) || null, [tables, activeTableId]);
  const activeOrder = useMemo(() => orders.find(o => o.tableId === activeTableId && o.status === 'open') || null, [orders, activeTableId]);

  return (
    <UnionStoreContext.Provider
      value={{
        tables,
        orders,
        menu,
        events,
        activeTableId,
        activeStation,
        eightySixList,
        currentServer,
        setActiveTableId,
        setActiveStation,
        setCurrentServer,
        seatTable,
        addItemToOrder,
        removeItemFromOrder,
        fireCourse,
        sendOrder,
        updateItemStatus,
        bumpCourse,
        autoSplitBySeat,
        settleCheck,
        closeTable,
        toggle86,
        decrementCellar,
        resetDemo,
        activeOrder,
        activeTable,
      }}
    >
      {children}
    </UnionStoreContext.Provider>
  );
};

export const useUnionStore = () => {
  const context = useContext(UnionStoreContext);
  if (!context) {
    throw new Error('useUnionStore must be used within a UnionStoreProvider');
  }
  return context;
};

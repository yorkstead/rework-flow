'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { Table, Order, MenuItem, EventRoom, KitchenStation, ItemStatus, CourseNumber, SplitCheck, OrderItem, AuditLog } from '../types';
import { INITIAL_TABLES } from '../data/tables';
import { INITIAL_ORDERS } from '../data/orders';
import { MENU_ITEMS } from '../data/menu';
import { INITIAL_EVENTS } from '../data/events';
import { INITIAL_AUDIT_LOGS } from '../data/auditLogs';
import { sound } from '../audio';

interface UnionStoreContextType {
  tables: Table[];
  orders: Order[];
  menu: MenuItem[];
  events: EventRoom[];
  auditLogs: AuditLog[];
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
  isOfflineSimulated: boolean;
  offlineQueueCount: number;
  toggleOfflineSimulation: () => void;
}

const UnionStoreContext = createContext<UnionStoreContextType | null>(null);

const STORAGE_KEY = 'union_os_240_state_v1';
const BROADCAST_CHANNEL = 'union_os_channel';

// Helper to generate cryptographic-like hex hash for immutable logs
const generateAuditHash = (action: string, timestamp: number, table?: string) => {
  const seed = `${action}_${timestamp}_${table || 'SYS'}_${Math.random()}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const chr = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return '0x' + Math.abs(hash).toString(16).padStart(16, 'a');
};

export const UnionStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tables, setTables] = useState<Table[]>(INITIAL_TABLES);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [menu, setMenu] = useState<MenuItem[]>(MENU_ITEMS);
  const [events, setEvents] = useState<EventRoom[]>(INITIAL_EVENTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [eightySixList, setEightySixList] = useState<string[]>(['app-octopus']);
  const [activeTableId, setActiveTableId] = useState<string | null>('tbl-23');
  const [activeStation, setActiveStation] = useState<KitchenStation | 'all'>('all');
  const [currentServer, setCurrentServer] = useState<string>('Marcus T.');
  const [isOfflineSimulated, setIsOfflineSimulated] = useState<boolean>(false);
  const [offlineQueueCount, setOfflineQueueCount] = useState<number>(0);

  const localVersionRef = React.useRef<number>(0);
  const isOfflineRef = React.useRef<boolean>(false);
  isOfflineRef.current = isOfflineSimulated;

  const toggleOfflineSimulation = useCallback(() => {
    setIsOfflineSimulated(prev => {
      const next = !prev;
      if (!next) {
        // Reconnecting: flush queue back to zero
        setOfflineQueueCount(0);
      }
      return next;
    });
  }, []);

  // Load from server and localStorage on client mount
  useEffect(() => {
    fetch('/api/sync')
      .then(res => res.json())
      .then(data => {
        if (data.tables) setTables(data.tables);
        if (data.orders) setOrders(data.orders);
        if (data.menu) setMenu(data.menu);
        if (data.events) setEvents(data.events);
        if (data.eightySixList) setEightySixList(data.eightySixList);
        if (data.auditLogs) setAuditLogs(data.auditLogs);
        if (data.version) localVersionRef.current = data.version;
      })
      .catch(() => {
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.tables) setTables(parsed.tables);
            if (parsed.orders) setOrders(parsed.orders);
            if (parsed.menu) setMenu(parsed.menu);
            if (parsed.events) setEvents(parsed.events);
            if (parsed.eightySixList) setEightySixList(parsed.eightySixList);
            if (parsed.auditLogs) setAuditLogs(parsed.auditLogs);
          }
        } catch {
          // Ignore
        }
      });
  }, []);

  // Poll server every 1200ms for real-time multi-device sync (Skipped if offline)
  useEffect(() => {
    const interval = setInterval(() => {
      if (isOfflineRef.current) return; // Prevent cloud ping when offline is simulated

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
            if (data.auditLogs) setAuditLogs(data.auditLogs);

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
    newAuditLogs: AuditLog[],
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
      auditLogs: newAuditLogs,
      sound: soundToTrigger || null,
      version: newVersion,
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const channel = new BroadcastChannel(BROADCAST_CHANNEL);
        channel.postMessage({ type: 'STATE_UPDATE', payload });
        if (soundToTrigger) {
          channel.postMessage({ type: soundToTrigger });
        }
        channel.close();
      }

      // If offline simulated, record into local offline queue and don't hit cloud endpoint
      if (isOfflineRef.current) {
        setOfflineQueueCount(q => q + 1);
        return;
      }

      fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {});
    } catch {
      // Ignore
    }
  }, []);

  // Real-time broadcast receiver
  useEffect(() => {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return;

    const channel = new BroadcastChannel(BROADCAST_CHANNEL);
    channel.onmessage = (event) => {
      if (event.data?.type === 'STATE_UPDATE' && event.data?.payload) {
        const p = event.data.payload;
        if (p.tables) setTables(p.tables);
        if (p.orders) setOrders(p.orders);
        if (p.menu) setMenu(p.menu);
        if (p.events) setEvents(p.events);
        if (p.eightySixList) setEightySixList(p.eightySixList);
        if (p.auditLogs) setAuditLogs(p.auditLogs);
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

  // Append immutable audit record
  const recordAudit = useCallback((
    action: AuditLog['action'],
    tableNumber: string | undefined,
    serverName: string,
    description: string,
    amount?: number,
    details?: Record<string, any>
  ): AuditLog[] => {
    const timestamp = Date.now();
    const newEntry: AuditLog = {
      id: `log-${timestamp}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp,
      action,
      tableNumber,
      serverName,
      description,
      amount,
      hash: generateAuditHash(action, timestamp, tableNumber),
      details
    };
    const updated = [newEntry, ...auditLogs];
    setAuditLogs(updated);
    return updated;
  }, [auditLogs]);

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
    const nextLogs = recordAudit('SEAT', targetTable.number, serverName, `Seated party of ${guestCount}`, undefined, { guestCount, vipNote });
    
    setTables(nextTables);
    setOrders(nextOrders);
    syncState(nextTables, nextOrders, menu, events, eightySixList, nextLogs);
  }, [tables, orders, menu, events, eightySixList, recordAudit, syncState]);

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

    const targetTable = tables.find(t => t.id === tableId);
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

    let updatedExisting = false;
    const nextOrders = orders.map(ord => {
      if (ord.tableId === tableId && ord.status === 'open') {
        updatedExisting = true;
        return { ...ord, items: [...ord.items, newItem] };
      }
      return ord;
    });

    if (!updatedExisting && targetTable) {
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        tableId,
        tableNumber: targetTable.number,
        serverName: currentServer,
        guestCount: targetTable.capacity || 2,
        createdAt: Date.now(),
        status: 'open',
        items: [newItem],
      };
      nextOrders.push(newOrder);
    }

    const nextLogs = recordAudit(
      'ORDER_ITEM', 
      targetTable?.number, 
      currentServer, 
      `Ordered ${itemDef.name} ($${itemDef.price}) for Seat ${seatNumber}`, 
      itemDef.price, 
      { menuItemId, seatNumber, mods }
    );

    setOrders(nextOrders);
    syncState(tables, nextOrders, menu, events, eightySixList, nextLogs);
  }, [menu, orders, tables, currentServer, eightySixList, events, recordAudit, syncState]);

  // 3. Remove Item
  const removeItemFromOrder = useCallback((tableId: string, orderItemId: string) => {
    let removedItemName = 'Item';
    let removedPrice = 0;
    const targetTable = tables.find(t => t.id === tableId);

    const nextOrders = orders.map(ord => {
      if (ord.tableId === tableId && ord.status === 'open') {
        const item = ord.items.find(i => i.id === orderItemId);
        if (item) {
          removedItemName = item.name;
          removedPrice = item.price;
        }
        return { ...ord, items: ord.items.filter(i => i.id !== orderItemId) };
      }
      return ord;
    });

    const nextLogs = recordAudit('REMOVE_ITEM', targetTable?.number, currentServer, `Removed item: ${removedItemName}`, -removedPrice);
    setOrders(nextOrders);
    syncState(tables, nextOrders, menu, events, eightySixList, nextLogs);
  }, [orders, tables, currentServer, menu, events, eightySixList, recordAudit, syncState]);

  // 4. Fire Course to Kitchen
  const fireCourse = useCallback((tableId: string, course: CourseNumber) => {
    sound.playKitchenFire();
    broadcastSound('PLAY_FIRE');

    const targetTable = tables.find(t => t.id === tableId);
    let firedCount = 0;
    const nextOrders = orders.map(ord => {
      if (ord.tableId === tableId && ord.status === 'open') {
        const nextItems = ord.items.map(item => {
          if (item.course === course) {
            firedCount++;
            return {
              ...item,
              status: 'fire' as const,
              firedAt: Date.now(),
            };
          }
          return item;
        });
        return { ...ord, items: nextItems };
      }
      return ord;
    });

    const courseName = course === 1 ? 'Apps' : course === 2 ? 'Salads/Soups' : course === 3 ? 'Entrees' : 'Desserts';
    const nextLogs = recordAudit('FIRE_COURSE', targetTable?.number, currentServer, `Fired Course ${course} (${courseName}) to kitchen pass (${firedCount} items)`);

    setOrders(nextOrders);
    syncState(tables, nextOrders, menu, events, eightySixList, nextLogs, 'PLAY_FIRE');
  }, [orders, tables, currentServer, menu, events, eightySixList, recordAudit, syncState]);

  // 5. Send order
  const sendOrder = useCallback((tableId: string) => {
    sound.playKitchenFire();
    broadcastSound('PLAY_FIRE');

    const targetTable = tables.find(t => t.id === tableId);
    const nextOrders = orders.map(ord => {
      if (ord.tableId === tableId && ord.status === 'open') {
        const nextItems = ord.items.map(item => {
          if (item.status === 'draft') {
            return {
              ...item,
              status: 'prep' as const,
              sentAt: Date.now(),
            };
          }
          return item;
        });
        return { ...ord, items: nextItems };
      }
      return ord;
    });

    const nextLogs = recordAudit('SEND_ORDER', targetTable?.number, currentServer, `Sent order to kitchen line`);
    setOrders(nextOrders);
    syncState(tables, nextOrders, menu, events, eightySixList, nextLogs, 'PLAY_FIRE');
  }, [orders, tables, currentServer, menu, events, eightySixList, recordAudit, syncState]);

  // 6. Update item status
  const updateItemStatus = useCallback((orderItemId: string, status: ItemStatus) => {
    const nextOrders = orders.map(ord => {
      const targetItem = ord.items.find(i => i.id === orderItemId);
      if (targetItem) {
        const nextItems = ord.items.map(item => {
          if (item.id === orderItemId) {
            return {
              ...item,
              status,
              ...(status === 'plated' ? { platedAt: Date.now() } : {}),
            };
          }
          return item;
        });
        return { ...ord, items: nextItems };
      }
      return ord;
    });

    setOrders(nextOrders);
    syncState(tables, nextOrders, menu, events, eightySixList, auditLogs);
  }, [orders, tables, menu, events, eightySixList, auditLogs, syncState]);

  // 7. Bump entire course on KDS Expo
  const bumpCourse = useCallback((orderId: string, course: CourseNumber) => {
    sound.playItemBump();
    broadcastSound('PLAY_BUMP');

    let tableNum = 'Expo';
    const nextOrders = orders.map(ord => {
      if (ord.id === orderId) {
        tableNum = ord.tableNumber;
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

    const nextLogs = recordAudit('BUMP_COURSE', tableNum, 'Expo Kitchen Line', `Course ${course} bumped from pass`);
    setOrders(nextOrders);
    syncState(tables, nextOrders, menu, events, eightySixList, nextLogs, 'PLAY_BUMP');
  }, [orders, tables, menu, events, eightySixList, recordAudit, syncState]);

  // 8. Auto-Split by Seat
  const autoSplitBySeat = useCallback((tableId: string) => {
    const order = orders.find(o => o.tableId === tableId && o.status === 'open');
    if (!order) return;

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

    const sharedItems = order.items.filter(i => i.seatNumber === 'shared');
    const sharedTotal = sharedItems.reduce((sum, item) => sum + item.price, 0);
    const sharedPerSeat = activeSeats.length > 0 ? sharedTotal / activeSeats.length : 0;

    const splitChecks: SplitCheck[] = activeSeats.map((seatNum, idx) => {
      const seatItems = order.items.filter(i => i.seatNumber === seatNum);
      const seatSubtotal = seatItems.reduce((sum, item) => sum + item.price, 0) + sharedPerSeat;
      const tax = Math.round(seatSubtotal * 0.0825 * 100) / 100;
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

    const grandTotal = splitChecks.reduce((s, c) => s + c.total, 0);
    const nextLogs = recordAudit('SPLIT_CHECK', order.tableNumber, currentServer, `Split check by ${activeSeats.length} seats`, grandTotal);

    setOrders(nextOrders);
    syncState(tables, nextOrders, menu, events, eightySixList, nextLogs);
  }, [orders, tables, currentServer, menu, events, eightySixList, recordAudit, syncState]);

  // 9. Settle a split check
  const settleCheck = useCallback((tableId: string, checkId: string, method: SplitCheck['paymentMethod']) => {
    sound.playPaymentSettled();

    let allChecksPaid = false;
    let settledAmount = 0;
    let tableNum = '';

    const nextOrders = orders.map(ord => {
      if (ord.tableId === tableId && ord.status === 'open' && ord.splitChecks) {
        tableNum = ord.tableNumber;
        const nextChecks = ord.splitChecks.map(chk => {
          if (chk.id === checkId) {
            settledAmount = chk.total;
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

    const nextLogs = recordAudit('SETTLE_CHECK', tableNum, currentServer, `Settled check via ${method}`, settledAmount, { checkId, method });

    setOrders(nextOrders);
    setTables(nextTables);
    syncState(nextTables, nextOrders, menu, events, eightySixList, nextLogs);
  }, [orders, tables, currentServer, menu, events, eightySixList, recordAudit, syncState]);

  // 10. Close and wipe table
  const closeTable = useCallback((tableId: string) => {
    const targetTable = tables.find(t => t.id === tableId);
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

    const nextLogs = recordAudit('CLOSE_TABLE', targetTable?.number, currentServer, `Table closed and reset to vacant`);

    setTables(nextTables);
    setOrders(nextOrders);
    syncState(nextTables, nextOrders, menu, events, eightySixList, nextLogs);
  }, [tables, orders, currentServer, menu, events, eightySixList, recordAudit, syncState]);

  // 11. Toggle 86 Status
  const toggle86 = useCallback((menuItemId: string) => {
    const item = menu.find(m => m.id === menuItemId);
    const itemName = item ? item.name : menuItemId;
    const isNow86 = !eightySixList.includes(menuItemId);
    const next86 = isNow86
      ? [...eightySixList, menuItemId]
      : eightySixList.filter(id => id !== menuItemId);

    const nextLogs = recordAudit('TOGGLE_86', 'Bar/Kitchen', currentServer, `${isNow86 ? '86d (Out of Stock)' : 'Restocked'}: ${itemName}`);

    setEightySixList(next86);
    syncState(tables, orders, menu, events, next86, nextLogs);
  }, [eightySixList, menu, tables, orders, events, currentServer, recordAudit, syncState]);

  // 12. Decrement cellar stock
  const decrementCellar = useCallback((menuItemId: string) => {
    let wineName = '';
    let remaining = 0;
    const nextMenu = menu.map(m => {
      if (m.id === menuItemId && m.wineDetails) {
        const nextStock = Math.max(0, m.wineDetails.cellarStock - 1);
        wineName = m.name;
        remaining = nextStock;
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

    const nextLogs = recordAudit('CELLAR_DECREMENT', 'Wine Room', currentServer, `Depleted 1 bottle of ${wineName}. Bin Stock: ${remaining}`);

    setMenu(nextMenu);
    syncState(tables, orders, nextMenu, events, eightySixList, nextLogs);
  }, [menu, eightySixList, tables, orders, events, currentServer, recordAudit, syncState]);

  // 13. Reset Demo State
  const resetDemo = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    fetch('/api/sync?reset=true').catch(() => {});
    setTables(INITIAL_TABLES);
    setOrders(INITIAL_ORDERS);
    setMenu(MENU_ITEMS);
    setEvents(INITIAL_EVENTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
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
        auditLogs,
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
        isOfflineSimulated,
        offlineQueueCount,
        toggleOfflineSimulation,
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

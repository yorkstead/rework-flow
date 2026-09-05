import { NextResponse } from 'next/server';
import { INITIAL_TABLES } from '@/lib/data/tables';
import { INITIAL_ORDERS } from '@/lib/data/orders';
import { MENU_ITEMS } from '@/lib/data/menu';
import { INITIAL_EVENTS } from '@/lib/data/events';
import { Table, Order, MenuItem, EventRoom } from '@/lib/types';

interface ServerUnionState {
  tables: Table[];
  orders: Order[];
  menu: MenuItem[];
  events: EventRoom[];
  eightySixList: string[];
  version: number;
  lastSound?: 'PLAY_FIRE' | 'PLAY_BUMP' | null;
}

declare global {
  var __unionServerState: ServerUnionState | undefined;
}

if (!globalThis.__unionServerState) {
  globalThis.__unionServerState = {
    tables: INITIAL_TABLES,
    orders: INITIAL_ORDERS,
    menu: MENU_ITEMS,
    events: INITIAL_EVENTS,
    eightySixList: ['app-octopus'],
    version: Date.now(),
    lastSound: null,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  if (searchParams.get('reset') === 'true') {
    globalThis.__unionServerState = {
      tables: INITIAL_TABLES,
      orders: INITIAL_ORDERS,
      menu: MENU_ITEMS,
      events: INITIAL_EVENTS,
      eightySixList: ['app-octopus'],
      version: Date.now(),
      lastSound: null,
    };
  }

  const soundToReturn = globalThis.__unionServerState?.lastSound;
  // Clear lastSound once delivered
  if (globalThis.__unionServerState) {
    globalThis.__unionServerState.lastSound = null;
  }

  return NextResponse.json({
    ...globalThis.__unionServerState,
    sound: soundToReturn,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!globalThis.__unionServerState) {
      globalThis.__unionServerState = {
        tables: INITIAL_TABLES,
        orders: INITIAL_ORDERS,
        menu: MENU_ITEMS,
        events: INITIAL_EVENTS,
        eightySixList: ['app-octopus'],
        version: Date.now(),
        lastSound: null,
      };
    }

    if (body.tables) globalThis.__unionServerState.tables = body.tables;
    if (body.orders) globalThis.__unionServerState.orders = body.orders;
    if (body.menu) globalThis.__unionServerState.menu = body.menu;
    if (body.events) globalThis.__unionServerState.events = body.events;
    if (body.eightySixList) globalThis.__unionServerState.eightySixList = body.eightySixList;
    if (body.sound) globalThis.__unionServerState.lastSound = body.sound;

    globalThis.__unionServerState.version = Date.now();

    return NextResponse.json({
      success: true,
      version: globalThis.__unionServerState.version,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 400 });
  }
}

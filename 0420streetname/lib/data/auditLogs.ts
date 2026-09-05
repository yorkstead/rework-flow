import { AuditLog } from '../types';

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-001',
    timestamp: Date.now() - 42 * 60 * 1000,
    action: 'SEAT',
    tableNumber: '23',
    serverName: 'Marcus T.',
    description: 'Seated 6 guests (Denver Federal Center Luncheon Party)',
    hash: '0x8f2a1b94e3c75d81',
    details: { guestCount: 6, section: 'dining', note: 'VIP: Fed Center Director / Time-sensitive 1:00 PM briefing' }
  },
  {
    id: 'log-002',
    timestamp: Date.now() - 38 * 60 * 1000,
    action: 'ORDER_ITEM',
    tableNumber: '23',
    serverName: 'Marcus T.',
    description: 'Course 1 (Apps) Fired: Wood-Fired Prosciutto Flatbread, Calamari, Bruschetta',
    hash: '0x4c99e120da53b708',
    amount: 54.00,
    details: { course: 1, itemsCount: 3 }
  },
  {
    id: 'log-003',
    timestamp: Date.now() - 25 * 60 * 1000,
    action: 'FIRE_COURSE',
    tableNumber: '23',
    serverName: 'Marcus T.',
    description: 'Course 3 (Entrees) Fired to Wood-Fired Grill & Saute Line',
    hash: '0x7e3f8901c81d22aa',
    amount: 228.00,
    details: { course: 3, items: ['Wood-Fired Ribeye x2', 'Colorado Striped Bass x2', 'Bucatini Carbonara x2'] }
  },
  {
    id: 'log-004',
    timestamp: Date.now() - 18 * 60 * 1000,
    action: 'BUMP_COURSE',
    tableNumber: '23',
    serverName: 'Chef / Expo',
    description: 'Expo Plated & Bumped all 6 entrees simultaneously from 60-ft pass',
    hash: '0x1b40fe93ad672901',
    details: { kitchenPassTimeMinutes: 11.4 }
  },
  {
    id: 'log-005',
    timestamp: Date.now() - 12 * 60 * 1000,
    action: 'CELLAR_DECREMENT',
    tableNumber: 'WR1',
    serverName: 'Sarah K.',
    description: 'Wine Room Bottle Depletion: Silver Oak Cabernet 2018 (Bin #412)',
    hash: '0x992cf0e478512349',
    amount: 245.00,
    details: { binNumber: '412', priorInventory: 6, newInventory: 5 }
  },
  {
    id: 'log-006',
    timestamp: Date.now() - 4 * 60 * 1000,
    action: 'SPLIT_CHECK',
    tableNumber: '23',
    serverName: 'Marcus T.',
    description: 'Auto-Split Check into 6 Individual Guest Receipts with proportional shared flatbread',
    hash: '0x330da4b8720c09ef',
    amount: 328.75,
    details: { totalGuests: 6, checksGenerated: 6 }
  }
];

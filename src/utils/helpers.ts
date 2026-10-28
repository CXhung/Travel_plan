import { ActivityCategory } from '../types';

export const CATEGORY_CONFIG: Record<
  ActivityCategory,
  { label: string; icon: string; color: string; bgLight: string; border: string }
> = {
  attraction: {
    label: '景點遊憩',
    icon: '🏰',
    color: '#3b82f6', // blue
    bgLight: 'bg-blue-50 text-blue-700',
    border: 'border-blue-200',
  },
  food: {
    label: '美食品嚐',
    icon: '🍜',
    color: '#f97316', // orange
    bgLight: 'bg-orange-50 text-orange-700',
    border: 'border-orange-200',
  },
  stay: {
    label: '飯店住宿',
    icon: '🏨',
    color: '#8b5cf6', // purple
    bgLight: 'bg-purple-50 text-purple-700',
    border: 'border-purple-200',
  },
  transport: {
    label: '交通接駁',
    icon: '🚗',
    color: '#10b981', // green
    bgLight: 'bg-green-50 text-green-700',
    border: 'border-green-200',
  },
  shopping: {
    label: '名產購物',
    icon: '🛍️',
    color: '#ec4899', // pink
    bgLight: 'bg-pink-50 text-pink-700',
    border: 'border-pink-200',
  },
  other: {
    label: '其他事項',
    icon: '📌',
    color: '#64748b', // slate
    bgLight: 'bg-slate-50 text-slate-700',
    border: 'border-slate-200',
  },
};

export const DAY_COLORS = [
  '#2563eb', // Day 1 Blue
  '#059669', // Day 2 Emerald
  '#d97706', // Day 3 Amber
  '#dc2626', // Day 4 Red
  '#7c3aed', // Day 5 Violet
  '#0891b2', // Day 6 Cyan
  '#db2777', // Day 7 Pink
];

export function getGoogleMapsUrl(locationName: string, lat?: number, lng?: number): string {
  if (lat && lng) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationName)}`;
}

export function formatTime(timeStr: string): string {
  return timeStr || '--:--';
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', maximumFractionDigits: 0 }).format(amount);
}

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeSlot(startHour: number, endHour: number): string {
  const format = (hDec: number) => {
    const h = Math.floor(hDec);
    const m = Math.round((hDec - h) * 60);
    const period = h >= 12 ? 'PM' : 'AM';
    const displayH = h > 12 ? h - 12 : (h === 0 ? 12 : h);
    return `${displayH}:${m < 10 ? '0' : ''}${m} ${period}`;
  };
  return `${format(startHour)} - ${format(endHour)}`;
}

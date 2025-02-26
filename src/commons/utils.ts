import { type ClassValue, clsx } from 'clsx';
import { hoursToMinutes } from 'date-fns/hoursToMinutes';
import { intervalToDuration } from 'date-fns/intervalToDuration';
import { setMinutes } from 'date-fns/setMinutes';
import { startOfDay } from 'date-fns/startOfDay';
import { twMerge } from 'tailwind-merge';

export const cxTw = (...classes: ClassValue[]) => twMerge(clsx(...classes));

export const transformSetToArray = <T>(set: Set<T>, callback: (item: T, index: number, array: T[]) => any) =>
  Array.from(set.values()).map((item, index, array) => callback(item, index, array));

export const getDateFromMinutes = (date: string, minutes: number) => setMinutes(startOfDay(new Date(date)), minutes);

export const getMinutesFromDate = (date: Date | string) => {
  const internalDate = typeof date === 'string' ? new Date(date) : date;
  const startDate = startOfDay(internalDate);

  console.log('internalDate', internalDate);

  const { hours = 0, minutes = 0 } = intervalToDuration({ start: startDate, end: internalDate });

  return hoursToMinutes(hours) + minutes;
};

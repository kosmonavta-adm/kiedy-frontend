import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cxTw = (...classes: ClassValue[]) => twMerge(clsx(...classes));

export const transformSetToArray = <T>(set: Set<T>, callback: (item: T, index: number, array: T[]) => any) =>
    Array.from(set.values()).map((item, index, array) => callback(item, index, array));

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatName(fullName: string | null | undefined): { firstName: string; lastName: string } {
  if (!fullName) return { firstName: '', lastName: '' };
  
  const nameParts = fullName.trim().split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');
  
  return { firstName, lastName };
}
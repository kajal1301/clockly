
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    remainingSeconds.toString().padStart(2, '0')
  ].join(':');
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  }).format(date);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function getInitials(name: string): string {
  if (!name) return '';
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

export function calculateTotalHours(timeEntries: any[]): number {
  return timeEntries.reduce((total, entry) => {
    const duration = entry.duration || 0;
    return total + duration;
  }, 0) / 3600; // Convert seconds to hours
}

// New utility function for formatting currency
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Utility function to calculate billable amount
export function calculateBillableAmount(timeEntries: any[], hourlyRate: number): number {
  return timeEntries
    .filter(entry => entry.billable)
    .reduce((total, entry) => {
      const hours = entry.duration / 3600; // Convert seconds to hours
      return total + (hours * hourlyRate);
    }, 0);
}

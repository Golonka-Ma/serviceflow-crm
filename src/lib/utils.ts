import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format as formatFns, parseISO } from "date-fns";
import { pl } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  dateString: string | null | undefined,
  format: string = "dd.MM.yyyy"
): string {
  if (!dateString) return "-";
  try {
    const date = parseISO(dateString);
    return formatFns(date, format, { locale: pl });
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return dateString; // Return original string if parsing fails
  }
}

export function formatCurrency(
  value: number | null | undefined,
  currency: string = "PLN"
): string {
  if (value === null || value === undefined) return "-";
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: currency,
  }).format(value);
}

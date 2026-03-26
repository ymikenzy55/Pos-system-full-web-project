/**
 * Format a number as Ghana Cedis currency
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "GH₵1,234.56")
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount).replace('GHS', 'GH₵');
}

/**
 * Format a number with thousand separators
 * @param amount - The amount to format
 * @returns Formatted number string (e.g., "1,234.56")
 */
export function formatNumber(amount: number): string {
  return new Intl.NumberFormat('en-GH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

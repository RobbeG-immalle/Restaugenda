export function calculateProfit(costPrice: number, sellingPrice: number): number {
  return sellingPrice - costPrice
}

export function calculateMargin(costPrice: number, sellingPrice: number): number {
  const profit = calculateProfit(costPrice, sellingPrice)
  if (sellingPrice === 0) return 0
  return (profit / sellingPrice) * 100
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('nl-BE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}

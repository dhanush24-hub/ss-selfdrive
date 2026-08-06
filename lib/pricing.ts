export const BASE_PRICE = 999

export function calculatePrice(
  startDate: Date,
  endDate: Date,
  isFirstRide: boolean
) {
  const ms = 1000 * 60 * 60 * 24
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / ms)
  const base = totalDays * BASE_PRICE
  let discount = 0
  const reasons: string[] = []

  // Rule 1 — First ride: 15% off
  if (isFirstRide) {
    const d = Math.round(base * 0.15)
    discount += d
    reasons.push(`First Ride 15% OFF  −₹${d}`)
  }

  // Rule 2 — Early bird: book 7+ days ahead, save ₹500
  const daysAhead = Math.ceil((startDate.getTime() - Date.now()) / ms)
  if (!isFirstRide && daysAhead >= 7) {
    discount += 500
    reasons.push('Early Bird  −₹500')
  }

  // Rule 3 — 3-day deal: 3rd day at 50% off
  if (totalDays >= 3) {
    const d = Math.round(BASE_PRICE * 0.5)
    discount += d
    reasons.push(`3rd Day 50% OFF  −₹${d}`)
  }

  return {
    totalDays,
    baseAmount: base,
    discountAmount: discount,
    discountReason: reasons.join(' · ') || null,
    finalAmount: Math.max(base - discount, 0),
  }
}

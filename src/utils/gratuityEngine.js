import { differenceInDays, format } from 'date-fns'

export const CONTRACT_TYPES = {
  UNLIMITED: 'unlimited',
  LIMITED: 'limited',
}

export const LEAVE_REASONS = {
  RESIGNATION: 'resignation',
  TERMINATION: 'termination',
}

/**
 * UAE Gratuity Calculation — Federal Decree-Law No. 33 of 2021, Article 51
 * Source: https://u.ae/en/information-and-services/jobs/employment-in-the-private-sector/end-of-service-benefits-for-employees-in-the-private-sector
 *
 * Rules:
 * - Less than 1 year of service → not entitled
 * - Years 1–5 → 21 days basic salary per year
 * - Years 6+  → 30 days basic salary per year
 * - Partial years are pro-rated (provided total service >= 1 year)
 * - Total gratuity capped at 2 years' basic salary
 * - Calculated on BASIC salary only (no allowances)
 * - Contract type and resignation/termination do NOT affect the formula
 */
export function calculateGratuity({ basicSalary, joinDate, endDate, contractType, reason }) {
  const totalDays = differenceInDays(endDate, joinDate)

  if (totalDays <= 0) {
    return { error: 'End date must be after joining date.' }
  }

  const totalYears = totalDays / 365
  const dailyWage = basicSalary / 30          // UAE law: monthly salary ÷ 30
  const maxGratuity = basicSalary * 24        // 2 years' basic salary cap

  // Less than 1 year — not entitled
  if (totalYears < 1) {
    return {
      eligible: false,
      totalDays,
      totalYears,
      dailyWage,
      reason: 'Less than 1 year of continuous service — not entitled to gratuity under UAE Labour Law (Article 51).',
    }
  }

  const fullYears = Math.floor(totalYears)
  const partialDays = totalDays - fullYears * 365
  const breakdown = []

  // Full years
  for (let y = 1; y <= fullYears; y++) {
    const rateDays = y <= 5 ? 21 : 30
    const amount = rateDays * dailyWage

    const periodStart = new Date(joinDate)
    periodStart.setFullYear(joinDate.getFullYear() + y - 1)
    const periodEnd = new Date(joinDate)
    periodEnd.setFullYear(joinDate.getFullYear() + y)

    breakdown.push({
      label: `Year ${y}`,
      period: `${format(periodStart, 'MMM yyyy')} – ${format(periodEnd, 'MMM yyyy')}`,
      duration: '1 full year',
      rateDays,
      daysEarned: rateDays,
      amount,
      isPartial: false,
    })
  }

  // Partial year (pro-rated, only if total service >= 1 year)
  if (partialDays > 0) {
    const yNum = fullYears + 1
    const rateDays = yNum <= 5 ? 21 : 30
    const partialFraction = partialDays / 365
    const daysEarned = rateDays * partialFraction
    const amount = daysEarned * dailyWage

    const months = Math.floor(partialDays / 30)
    const days = partialDays % 30
    const durationParts = []
    if (months > 0) durationParts.push(`${months} month${months > 1 ? 's' : ''}`)
    if (days > 0) durationParts.push(`${days} day${days > 1 ? 's' : ''}`)

    const periodStart = new Date(joinDate)
    periodStart.setFullYear(joinDate.getFullYear() + fullYears)

    breakdown.push({
      label: `Year ${yNum} (partial)`,
      period: `${format(periodStart, 'MMM yyyy')} – ${format(endDate, 'MMM yyyy')}`,
      duration: durationParts.join(' '),
      rateDays,
      daysEarned,
      amount,
      isPartial: true,
    })
  }

  let totalGratuity = breakdown.reduce((sum, r) => sum + r.amount, 0)
  const capped = totalGratuity > maxGratuity
  if (capped) totalGratuity = maxGratuity

  return {
    eligible: true,
    totalDays,
    totalYears,
    dailyWage,
    breakdown,
    totalGratuity,
    capped,
    maxGratuity,
    reductionNote: null,   // no longer applicable under new law
  }
}
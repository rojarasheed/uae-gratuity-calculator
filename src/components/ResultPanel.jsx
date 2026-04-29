import { format } from 'date-fns'
import jsPDF from 'jspdf'
import StatCard from './StatCard'
import BreakdownTable from './BreakdownTable'

const CONTRACT_LABELS = { unlimited: 'Unlimited', limited: 'Limited' }
const REASON_LABELS = { resignation: 'Resignation', termination: 'Termination' }

export default function ResultPanel({ result, form, onReset, onRecalculate }) {
  const fmt = (n) => n.toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const years = result.totalYears.toFixed(2)

  function exportPDF() {
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const W = 210
    const margin = 20
    const contentWidth = W - margin * 2
    let y = 20

    // ── Header bar ──────────────────────────────────────────
    pdf.setFillColor(26, 26, 26)
    pdf.rect(0, 0, W, 28, 'F')
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(255, 255, 255)
    pdf.text('UAE Gratuity Calculation', margin, 13)
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(180, 180, 180)
    pdf.text('Federal Decree-Law No. 33 of 2021  ·  For reference only', margin, 21)
    y = 38

    // ── Employee details row ─────────────────────────────────
    pdf.setFillColor(248, 247, 244)
    pdf.roundedRect(margin, y, contentWidth, 22, 3, 3, 'F')
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(120, 113, 108)
    pdf.text('CONTRACT TYPE', margin + 6, y + 7)
    pdf.text('REASON', margin + 55, y + 7)
    pdf.text('BASIC SALARY', margin + 105, y + 7)
    pdf.text('SERVICE PERIOD', margin + 148, y + 7)
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(26, 26, 26)
    pdf.text(CONTRACT_LABELS[form.contractType], margin + 6, y + 16)
    pdf.text(REASON_LABELS[form.reason], margin + 55, y + 16)
    pdf.text(`AED ${Number(form.basicSalary).toLocaleString('en-AE')}`, margin + 105, y + 16)
    pdf.text(`${years} years`, margin + 148, y + 16)
    y += 28

    // ── Dates row ────────────────────────────────────────────
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(120, 113, 108)
    pdf.text(
      `Service period:  ${format(new Date(form.joinDate), 'dd MMM yyyy')}  to  ${format(new Date(form.endDate), 'dd MMM yyyy')}  (${result.totalDays} calendar days)`,
      margin,
      y
    )
    y += 12

    // ── Total gratuity highlight ─────────────────────────────
    pdf.setFillColor(236, 253, 245)
    pdf.roundedRect(margin, y, contentWidth, 22, 3, 3, 'F')
    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(5, 150, 105)
    pdf.text('TOTAL GRATUITY', margin + 6, y + 8)
    pdf.setFontSize(18)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(4, 120, 87)
    pdf.text(`AED ${fmt(result.totalGratuity)}`, margin + 6, y + 18)
    if (result.capped) {
      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(5, 150, 105)
      pdf.text('2-year salary cap applied', margin + 120, y + 18)
    }
    y += 30

    // ── Reduction notice ─────────────────────────────────────
    if (result.reductionNote) {
      pdf.setFillColor(255, 251, 235)
      pdf.roundedRect(margin, y, contentWidth, 12, 2, 2, 'F')
      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(146, 64, 14)
      pdf.text(`Resignation reduction: ${result.reductionNote}`, margin + 4, y + 8)
      y += 18
    }

    // ── Breakdown table ──────────────────────────────────────
    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(120, 113, 108)
    pdf.text('YEAR-BY-YEAR BREAKDOWN', margin, y)
    y += 6

    // Table header
    pdf.setFillColor(26, 26, 26)
    pdf.rect(margin, y, contentWidth, 9, 'F')
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(255, 255, 255)
    const cols = [margin + 3, margin + 45, margin + 85, margin + 120, margin + 148]
    const headers = ['Period', 'Duration', 'Rate', 'Days Earned', 'Amount (AED)']
    headers.forEach((h, i) => pdf.text(h, cols[i], y + 6))
    y += 9

    // Table rows
    result.breakdown.forEach((row, idx) => {
      const rowBg = idx % 2 === 0 ? [255, 255, 255] : [248, 247, 244]
      pdf.setFillColor(...rowBg)
      pdf.rect(margin, y, contentWidth, 9, 'F')
      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(26, 26, 26)
      pdf.text(row.label, cols[0], y + 6)
      pdf.text(row.duration, cols[1], y + 6)
      pdf.text(`${row.rateDays} days/yr`, cols[2], y + 6)
      pdf.text(row.daysEarned.toFixed(2), cols[3], y + 6)
      pdf.setFont('helvetica', 'bold')
      pdf.text(fmt(row.amount), cols[4], y + 6)
      y += 9
    })

    // Total row
    pdf.setFillColor(4, 120, 87)
    pdf.rect(margin, y, contentWidth, 10, 'F')
    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(255, 255, 255)
    pdf.text('TOTAL GRATUITY', cols[0], y + 7)
    pdf.text(`AED ${fmt(result.totalGratuity)}`, cols[4], y + 7)
    y += 18

    // ── Daily wage note ──────────────────────────────────────
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(120, 113, 108)
    pdf.text(
      `Daily wage used: AED ${result.dailyWage.toFixed(2)}  (basic salary ÷ 30)`,
      margin,
      y
    )
    y += 14

    // ── Law reference box ────────────────────────────────────────────
    const notesBoxHeight = 66
    pdf.setDrawColor(200, 200, 200)
    pdf.setLineWidth(0.3)
    pdf.roundedRect(margin, y, contentWidth, notesBoxHeight, 2, 2, 'S')
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(26, 26, 26)
    pdf.text('UAE Labour Law Reference', margin + 4, y + 7)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(80, 80, 80)
    const notes = [
    '• Applies to: expatriate workers in the UAE private sector only',
    '• Does NOT apply to: UAE nationals, government employees, domestic workers, DIFC/ADGM',
    '• Calculated on basic salary only — allowances excluded',
    '• Less than 1 year of service: no entitlement',
    '• Years 1–5: 21 days basic salary per year',
    '• Years 6+: 30 days basic salary per year (for each year beyond year 5)',
    '• Partial years are pro-rated (total service must exceed 1 year)',
    '• Total gratuity cannot exceed 2 years\' basic salary',
    ]
    notes.forEach((note, i) => pdf.text(note, margin + 4, y + 14 + i * 6))
    y += notesBoxHeight + 10   // ← this is the key line, was y += 48 before

    // ── Footer ───────────────────────────────────────────
    pdf.setFontSize(7)
        pdf.setTextColor(160, 160, 160)
        pdf.text(
        `Generated ${format(new Date(), 'dd MMMM yyyy')}  ·  For reference only. Consult a legal professional for official advice.`,
        margin,
        285
        )

    pdf.save('UAE-Gratuity-Calculation.pdf')
  }

  // ── Not eligible state ───────────────────────────────────
  if (!result.eligible) {
    return (
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 text-center">
        <p className="text-amber-800 font-semibold font-display text-lg mb-2">
          Not eligible for gratuity
        </p>
        <p className="text-amber-700 text-sm leading-relaxed max-w-sm mx-auto">
          {result.reason}
        </p>
        <div className="flex justify-center gap-3 mt-5">
            <button
                onClick={onRecalculate}
                className="text-sm border border-stone-200 rounded-xl px-4 py-2 hover:bg-stone-50 transition-colors"
            >
                Edit details
            </button>
            <button
                onClick={onReset}
                className="text-sm bg-[#1a1a1a] text-white rounded-xl px-4 py-2 hover:bg-stone-700 transition-colors"
            >
                New calculation
            </button>
        </div>
      </div>
    )
  }

  // ── Result state ─────────────────────────────────────────
  return (
    <div>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-stone-400 mb-1.5">
            Calculation result
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-stone-500">
            <span className="font-medium text-stone-700">
              {CONTRACT_LABELS[form.contractType]} contract
            </span>
            <span className="text-stone-300">·</span>
            <span>{REASON_LABELS[form.reason]}</span>
            <span className="text-stone-300">·</span>
            <span>
              {format(new Date(form.joinDate), 'dd MMM yyyy')}
              <span className="mx-1.5 text-stone-400">→</span>
              {format(new Date(form.endDate), 'dd MMM yyyy')}
            </span>
          </div>
        </div>
        <div className="flex gap-2 shrink-0 ml-4">
            <button
                onClick={exportPDF}
                className="flex items-center gap-2 text-xs font-medium border border-stone-200 rounded-xl px-4 py-2.5 hover:bg-stone-50 transition-colors"
            >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Export PDF
            </button>
            <button
                onClick={onRecalculate}
                className="text-xs font-medium border border-stone-200 rounded-xl px-4 py-2.5 hover:bg-stone-50 transition-colors"
            >
                Edit
            </button>
            <button
                onClick={onReset}
                className="text-xs font-medium bg-[#1a1a1a] text-white rounded-xl px-4 py-2.5 hover:bg-stone-700 transition-colors"
            >
                New
            </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <StatCard
          label="Total gratuity"
          value={`AED ${fmt(result.totalGratuity)}`}
          sub={result.capped ? 'Cap of 2 years applied' : `Based on ${years} years`}
          accent
        />
        <StatCard
          label="Service period"
          value={`${years} yrs`}
          sub={`${result.totalDays} calendar days`}
        />
        <StatCard
          label="Daily wage"
          value={`AED ${result.dailyWage.toFixed(2)}`}
          sub="Basic salary ÷ 30"
        />
      </div>

      
      {/* Cap notice */}
      {result.capped && (
        <div className="mb-4 p-4 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-700 leading-relaxed">
          <span className="font-semibold">Two-year cap applied — </span>
          Gratuity is capped at AED {fmt(result.maxGratuity)} (2 × annual basic salary) as required by UAE Labour Law.
        </div>
      )}

      {/* Breakdown table */}
      <div className="bg-white rounded-2xl border border-stone-100 p-6 mb-4">
        <p className="text-xs uppercase tracking-widest font-medium text-stone-400 mb-5">
          Year-by-year breakdown
        </p>
        <BreakdownTable breakdown={result.breakdown} totalGratuity={result.totalGratuity} />
      </div>

      {/* Law reference */}
      <div className="bg-white rounded-2xl border border-stone-100 p-6">
        <p className="text-xs uppercase tracking-widest font-medium text-stone-400 mb-4">
          UAE labour law reference
        </p>
        <ul className="text-sm text-stone-500 space-y-2.5 leading-relaxed">
            <li>• Gratuity is calculated on <strong className="text-stone-700">basic salary only</strong> — housing, transport and other allowances are excluded.</li>
            <li>• Less than 1 year of service → <strong className="text-stone-700">no entitlement.</strong></li>
            <li>• Years 1–5: <strong className="text-stone-700">21 days' basic salary per year.</strong></li>
            <li>• Years 6+: <strong className="text-stone-700">30 days' basic salary per year</strong> (for each year beyond year 5).</li>
            <li>• Partial years are pro-rated, provided total service exceeds 1 year.</li>
            <li>• Daily wage = basic salary ÷ 30.</li>
            <li>• Total gratuity cannot exceed <strong className="text-stone-700">2 years' basic salary.</strong></li>
            <li>• The formula applies equally to all contract types and reasons for leaving.</li>
            <li>• Reference: <strong className="text-stone-700">Federal Decree-Law No. 33 of 2021, Article 51</strong></li>
            <li>• <strong className="text-stone-700">Applies to:</strong> Expatriate workers in the UAE private sector only.</li>
            <li>• <strong className="text-stone-700">Does not apply to:</strong> UAE nationals, government/public sector employees, domestic workers, or DIFC/ADGM free zone employees.</li>
            </ul>
      </div>

    </div>
  )
}
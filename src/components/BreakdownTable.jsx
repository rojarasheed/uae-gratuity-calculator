export default function BreakdownTable({ breakdown, totalGratuity }) {
  const fmt = (n) => n.toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-100">
            {['Period', 'Duration', 'Rate', 'Days earned', 'Amount (AED)'].map(h => (
              <th key={h} className="text-left py-3 px-3 text-xs uppercase tracking-widest font-medium text-stone-400 first:pl-0 last:pr-0 last:text-right">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {breakdown.map((row, i) => (
            <tr key={i} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
              <td className="py-3.5 px-3 pl-0 font-medium text-[#1a1a1a]">
                {row.label}
                {row.isPartial && (
                  <span className="ml-2 text-[10px] bg-amber-50 text-amber-600 border border-amber-100 rounded-full px-2 py-0.5 font-medium">
                    partial
                  </span>
                )}
              </td>
              <td className="py-3.5 px-3 text-stone-500">{row.duration}</td>
              <td className="py-3.5 px-3">
                <span className="text-[11px] bg-stone-100 text-stone-600 rounded-full px-2.5 py-1 font-medium">
                  {row.rateDays} days/yr
                </span>
              </td>
              <td className="py-3.5 px-3 text-stone-600">{fmt(row.daysEarned)}</td>
              <td className="py-3.5 px-3 pr-0 text-right font-medium">{fmt(row.amount)}</td>
            </tr>
          ))}
          <tr className="bg-emerald-50 rounded-xl">
            <td colSpan={4} className="py-4 px-3 pl-0 text-right text-sm font-semibold text-emerald-800 font-display">
              Total gratuity
            </td>
            <td className="py-4 px-3 pr-0 text-right text-base font-bold text-emerald-700 font-display">
              {fmt(totalGratuity)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
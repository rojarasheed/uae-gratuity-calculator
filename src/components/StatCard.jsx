export default function StatCard({ label, value, sub, accent }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 p-5 flex flex-col gap-1">
      <p className="text-xs uppercase tracking-widest font-medium text-stone-400">{label}</p>
      <p className={`text-3xl font-display font-semibold ${accent ? 'text-emerald-600' : 'text-[#1a1a1a]'}`}>
        {value}
      </p>
      {sub && <p className="text-xs text-stone-400">{sub}</p>}
    </div>
  )
}
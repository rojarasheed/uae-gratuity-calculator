export default function RadioGroup({ options, value, onChange }) {
  return (
    <div className="flex gap-2">
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium border transition-all duration-150
            ${value === opt.value
              ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
              : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400'
            }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
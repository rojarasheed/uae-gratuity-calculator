import { useGratuityCalc } from './hooks/useGratuityCalc'
import CalculatorForm from './components/CalculatorForm'
import ResultPanel from './components/ResultPanel'

export default function App() {
  const { form, errors, result, submitted, updateField, submit, reset, recalculate } = useGratuityCalc()

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      {/* Header */}
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display font-semibold text-lg text-[#1a1a1a]">
              UAE Gratuity Calculator
            </h1>
            <p className="text-xs text-stone-400">Federal Decree-Law No. 33 of 2021</p>
          </div>
          <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full px-3 py-1 font-medium uppercase tracking-wider">
            Free · No data stored
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* Hero */}
        {!submitted && (
          <div className="mb-10">
            <h2 className="font-display text-4xl font-bold text-[#1a1a1a] leading-tight mb-3">
              Know your<br />end of service rights.
            </h2>
            <p className="text-stone-400 text-xs tracking-wide">
              UAE private sector · Expatriate employees · Federal Decree-Law No. 33 of 2021
            </p>
          </div>
        )}

        {/* Content */}
        <div className="bg-white rounded-3xl border border-stone-100 p-8 shadow-sm">
          {!submitted ? (
            <CalculatorForm
              form={form}
              errors={errors}
              updateField={updateField}
              onSubmit={submit}
            />
          ) : (
            <ResultPanel
              result={result}
              form={form}
              onReset={reset}
              onRecalculate={recalculate}
            />
          )}
        </div>

        <p className="text-center text-xs text-stone-400 mt-8">
          For reference only. Consult a legal professional for official advice.
        </p>
      </main>
    </div>
  )
}
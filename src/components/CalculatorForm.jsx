import { CONTRACT_TYPES, LEAVE_REASONS } from '../utils/gratuityEngine'
import FormField from './FormField'
import RadioGroup from './RadioGroup'

const contractOptions = [
  { label: 'Unlimited', value: CONTRACT_TYPES.UNLIMITED },
  { label: 'Limited', value: CONTRACT_TYPES.LIMITED },
]

const reasonOptions = [
  { label: 'Resignation', value: LEAVE_REASONS.RESIGNATION },
  { label: 'Termination', value: LEAVE_REASONS.TERMINATION },
]

export default function CalculatorForm({ form, errors, updateField, onSubmit }) {
  return (
    <div className="space-y-6">

      <FormField label="Basic monthly salary (AED)" error={errors.basicSalary}>
        <input
          type="number"
          min="0"
          placeholder="e.g. 10,000"
          value={form.basicSalary}
          onChange={e => updateField('basicSalary', e.target.value)}
          className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-stone-400 transition-colors"
        />
        <p className="text-xs text-stone-400 mt-1">
          Basic salary only — exclude housing, transport and other allowances
        </p>
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormField label="Joining date" error={errors.joinDate}>
          <input
            type="date"
            value={form.joinDate}
            min="1950-01-01"
            max="2100-12-31"
            onChange={e => updateField('joinDate', e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-stone-400 transition-colors"
          />
        </FormField>
        <FormField label="Last working day" error={errors.endDate}>
          <input
            type="date"
            value={form.endDate}
            min="1950-01-01"
            max="2100-12-31"
            onChange={e => updateField('endDate', e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-stone-400 transition-colors"
          />
        </FormField>
      </div>

      <FormField label="Contract type">
        <RadioGroup
          options={contractOptions}
          value={form.contractType}
          onChange={val => updateField('contractType', val)}
        />
      </FormField>

      <FormField label="Reason for leaving">
        <RadioGroup
          options={reasonOptions}
          value={form.reason}
          onChange={val => updateField('reason', val)}
        />
      </FormField>

      {/* Info note */}
      <div className="rounded-xl bg-stone-50 border border-stone-100 px-4 py-3 text-xs text-stone-500 leading-relaxed">
        <strong className="text-stone-600">Scope:</strong> This calculator applies to{' '}
        <strong className="text-stone-600">expatriate workers in the UAE private sector</strong> under{' '}
        Federal Decree-Law No. 33 of 2021. It does not apply to UAE nationals (covered by pension
        and social security law), government/public sector employees, domestic workers, or employees
        in certain free zones with separate regulations (e.g. DIFC, ADGM).
        </div>

      <button
        onClick={onSubmit}
        className="w-full bg-[#1a1a1a] text-white font-display font-semibold rounded-xl py-4 text-sm tracking-wide hover:bg-stone-700 active:scale-[0.99] transition-all duration-150"
      >
        Calculate Gratuity →
      </button>

    </div>
  )
}
import { useState, useCallback, useMemo } from 'react'
import { calculateGratuity, CONTRACT_TYPES, LEAVE_REASONS } from '../utils/gratuityEngine'

const defaultForm = {
  basicSalary: '',
  joinDate: '',
  endDate: '',
  contractType: CONTRACT_TYPES.UNLIMITED,
  reason: LEAVE_REASONS.RESIGNATION,
}

export function useGratuityCalc() {
  const [form, setForm] = useState(defaultForm)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  const updateField = useCallback((field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    // Clear error for this field when user edits it
    setErrors(prev => ({ ...prev, [field]: null }))
  }, [])

  const validate = useCallback(() => {
    const errs = {}
    if (!form.basicSalary || Number(form.basicSalary) <= 0)
      errs.basicSalary = 'Enter a valid basic salary'
    if (!form.joinDate)
      errs.joinDate = 'Select a joining date'
    if (!form.endDate)
      errs.endDate = 'Select a last working day'
    if (form.joinDate && form.endDate && new Date(form.endDate) <= new Date(form.joinDate))
      errs.endDate = 'Must be after joining date'
    return errs
  }, [form])

  const submit = useCallback(() => {
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    setSubmitted(true)
  }, [validate])

  const reset = useCallback(() => {
    setForm(defaultForm)
    setSubmitted(false)
    setErrors({})
  }, [])

  // useMemo: only recalculates when submitted form data actually changes
  const result = useMemo(() => {
    if (!submitted) return null
    return calculateGratuity({
      basicSalary: Number(form.basicSalary),
      joinDate: new Date(form.joinDate),
      endDate: new Date(form.endDate),
      contractType: form.contractType,
      reason: form.reason,
    })
  }, [submitted, form])

  const recalculate = useCallback(() => {
  setSubmitted(false)
    // form values are kept as-is
    }, [])


return { form, errors, result, submitted, updateField, submit, reset, recalculate }
}
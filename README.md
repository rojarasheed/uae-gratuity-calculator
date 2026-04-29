# UAE Gratuity Calculator

A full-featured end-of-service gratuity calculator for the UAE, built with React + Vite. Accurate calculations based on **Federal Decree-Law No. 33 of 2021, Article 51** — the current UAE Labour Law.

🔗 **Live Demo:** [uae-gratuity-calculator.vercel.app](https://uae-gratuity-calculator.vercel.app)

---

## Features

- UAE Labour Law accurate calculations (Federal Decree-Law No. 33 of 2021)
- Year-by-year breakdown of gratuity entitlement
- Partial year pro-rating
- 2-year salary cap enforcement
- PDF export — professionally formatted, no screenshots
- Edit previous inputs without losing data
- Clean, responsive UI built with Tailwind CSS
- Works entirely in the browser — no data sent to any server

## Who This Applies To

This calculator is for **expatriate employees in the UAE private sector**.

It does **not** apply to:
- UAE nationals (covered by pension and social security law)
- Government / public sector employees
- Domestic workers (Federal Law No. 10 of 2017)
- DIFC or ADGM free zone employees (separate employment regulations)

## Calculation Rules

Based on Article 51 of Federal Decree-Law No. 33 of 2021:

| Service Period | Entitlement |
|---|---|
| Less than 1 year | No gratuity |
| 1 – 5 years | 21 days' basic salary per year |
| More than 5 years | 30 days' basic salary per year (for years beyond 5) |

- Calculated on **basic salary only** — housing, transport and other allowances are excluded
- Daily wage = basic salary ÷ 30
- Partial years are pro-rated (provided total service exceeds 1 year)
- Total gratuity cannot exceed **2 years' basic salary**

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS v4 |
| Date handling | date-fns |
| PDF export | jsPDF |
| Deployment | Vercel |

## Project Structure

```
src/
├── components/
│   ├── BreakdownTable.jsx    # Year-by-year results table
│   ├── CalculatorForm.jsx    # Input form
│   ├── FormField.jsx         # Reusable field wrapper with error display
│   ├── RadioGroup.jsx        # Reusable toggle button group
│   ├── ResultPanel.jsx       # Results view + PDF export
│   └── StatCard.jsx          # Summary metric cards
├── hooks/
│   └── useGratuityCalc.js   # Form state, validation, useMemo calculation
├── utils/
│   └── gratuityEngine.js    # Pure calculation logic (no React)
└── App.jsx
```

## Getting Started

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/uae-gratuity-calculator.git
cd uae-gratuity-calculator

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## React Concepts Used

This project was built to practise and demonstrate:

- `useState` — form fields, submission state, error handling
- `useCallback` — stable references for handlers
- `useMemo` — calculation only re-runs when form data changes
- `useRef` — PDF export target
- Custom hook — `useGratuityCalc` encapsulates all logic away from the UI
- Component composition — form, hook, engine, and result are fully separated

## Disclaimer

This tool is for **reference purposes only**. Results are based on the minimum statutory entitlements under UAE Labour Law. Consult a qualified legal professional or your HR department for official advice.

---

Built by [Your Name](https://github.com/rojarasheed) · UAE 🇦🇪

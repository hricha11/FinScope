interface Props {
  income: number
  allocated: number
  emi: number
  available: number
}

const StatCard = ({ label, value, accent }: { label: string; value: number; accent: string }) => (
  <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
    <div className="text-sm text-slate-500">{label}</div>
    <div className={`mt-2 text-2xl font-semibold ${accent}`}>
      ₹ {value.toLocaleString(undefined, { minimumFractionDigits: 0 })}
    </div>
  </div>
)

const SummaryCards = ({ income, allocated, emi, available }: Props) => (
  <div className="grid gap-4 md:grid-cols-4">
    <StatCard label="Monthly Income" value={income} accent="text-primary-600" />
    <StatCard label="Total Allocated" value={allocated} accent="text-slate-700" />
    <StatCard label="EMI Allocation" value={emi} accent="text-amber-600" />
    <StatCard label="Available for Savings" value={available} accent="text-emerald-600" />
  </div>
)

export default SummaryCards



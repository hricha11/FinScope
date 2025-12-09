import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { BudgetAllocation } from '../../types'

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#0ea5e9', '#ef4444', '#14b8a6']

const BudgetPie = ({ data }: { data: BudgetAllocation[] }) => {
  if (!data?.length) {
    return (
      <div className="flex h-72 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-white">
        <p className="text-sm text-slate-500">No budget data yet</p>
      </div>
    )
  }

  return (
    <div className="h-72 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 text-sm font-semibold text-slate-700">Budget Breakdown</div>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="category"
            outerRadius={100}
            innerRadius={50}
            paddingAngle={4}
          >
            {data.map((entry, index) => (
              <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default BudgetPie



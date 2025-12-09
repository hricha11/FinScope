import { Link } from 'react-router-dom'
import { Goal } from '../../types'

const GoalsPreview = ({ goals }: { goals: Goal[] }) => (
  <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
    <div className="mb-3 flex items-center justify-between">
      <h3 className="text-sm font-semibold text-slate-700">Goals</h3>
      <Link to="/goals" className="text-sm font-medium text-primary-600">
        View all
      </Link>
    </div>
    <div className="space-y-3">
      {(goals || []).slice(0, 3).map((goal) => (
        <div key={goal.id} className="rounded border border-slate-100 p-3">
          <div className="text-sm font-semibold text-slate-800">{goal.name}</div>
          <div className="text-xs text-slate-500">
            Target ₹{goal.targetAmount.toLocaleString()} • {goal.months} months
          </div>
        </div>
      ))}
      {!goals?.length && (
        <p className="text-sm text-slate-500">No goals yet — create one to get started.</p>
      )}
    </div>
  </div>
)

export default GoalsPreview



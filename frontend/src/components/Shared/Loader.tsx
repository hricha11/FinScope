const shimmer = 'bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200'

const Loader = () => (
  <div className="space-y-3">
    <div className={`h-4 w-48 rounded ${shimmer} animate-pulse`} />
    <div className={`h-4 w-64 rounded ${shimmer} animate-pulse`} />
    <div className={`h-4 w-56 rounded ${shimmer} animate-pulse`} />
  </div>
)

export default Loader



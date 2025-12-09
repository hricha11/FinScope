import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import classNames from 'classnames'

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/budget', label: 'Budget' },
  { to: '/goals', label: 'Goals' },
  { to: '/profile', label: 'Profile' },
]

const Sidebar = () => {
  const [open, setOpen] = useState(false)

  return (
    <aside className="border-r border-slate-200 bg-white md:w-60">
      <div className="flex items-center justify-between px-4 py-3 md:hidden">
        <span className="text-sm font-semibold text-slate-700">Menu</span>
        <button
          className="rounded border border-slate-200 px-2 py-1 text-xs"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Hide' : 'Show'}
        </button>
      </div>
      <nav
        className={classNames('space-y-1 px-3 pb-4', {
          'hidden md:block': !open,
          block: open,
        })}
      >
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              classNames(
                'block rounded px-3 py-2 text-sm font-medium transition hover:bg-primary-50',
                isActive ? 'bg-primary-50 text-primary-700' : 'text-slate-700',
              )
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar


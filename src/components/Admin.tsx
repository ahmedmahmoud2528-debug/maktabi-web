import { useEffect, useRef, useState, type ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import { I } from './Icons'

/* ---------- shell ---------- */
export function AdminLayout({ children }: { children: ReactNode }) {
  const { user, toast } = useStore()
  const nav = useNavigate()
  const link = ({ isActive }: { isActive: boolean }) => (isActive ? 'on' : '')
  return (
    <div className="admin">
      <main className="admin-main"><div className="admin-inner page-fade">{children}</div></main>
      <nav className="admin-nav">
        <img className="brand" src="./assets/logo.svg" alt="مكتبي" style={{ width: 108, filter: 'brightness(0) invert(1)' }} />
        <button className="ws" onClick={() => nav('/workspaces')}><span className="tile"><I.Building size={15} /></span>مساحة عمل قمرة<I.Chevron size={14} className="chev" /></button>
        <div style={{ height: 10 }} />
        <NavLink to="/floor" className={link}><I.Apps size={17} />المكتب</NavLink>
        <NavLink to="/admin/members" className={link}><I.People size={17} />الفريق</NavLink>
        <div className="sec">عمل</div>
        <NavLink to="/admin/recordings" className={link}><I.Cam size={17} />التسجيلات</NavLink>
        <div className="sec">الإدارة</div>
        <NavLink to="/admin/workspace" className={link}><I.Status size={17} />إدارة المساحة</NavLink>
        <NavLink to="/admin/attendance" className={link}><I.Calendar size={17} />الحضور والانصراف</NavLink>
        <NavLink to="/admin/billing" className={link}><I.Card size={17} />الفوترة والاشتراك</NavLink>
        <NavLink to="/admin/settings" className={link}><I.Settings size={17} />الإعدادات</NavLink>
        <button className="prof" onClick={() => nav('/admin/profile')}>
          <span className="avatar sm teal">{user.initial}</span>
          <span style={{ flex: 1 }}><b>{user.name}</b><span>{user.role}</span></span>
          <I.ChevronR size={14} style={{ opacity: .5 }} />
        </button>
        <button className="nav-item" style={{ marginTop: 4 }} onClick={() => { toast('تم تسجيل الخروج'); nav('/') }}><I.Logout size={16} />تسجيل الخروج</button>
      </nav>
    </div>
  )
}

export function PageHead({ title, sub, actions }: { title: string; sub?: string; actions?: ReactNode }) {
  return <div className="page-head"><div><h1>{title}</h1>{sub && <p>{sub}</p>}</div>{actions && <div style={{ display: 'flex', gap: 8 }}>{actions}</div>}</div>
}

export function Tabs({ items, value, onChange }: { items: string[]; value: string; onChange: (v: string) => void }) {
  return <div className="tabbar">{items.map(t => <button key={t} className={value === t ? 'on' : ''} onClick={() => onChange(t)}>{t}</button>)}</div>
}

export function Panel({ title, sub, icon, actions, children, className = '' }: { title?: string; sub?: string; icon?: ReactNode; actions?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`card panel card-in ${className}`}>
      {(title || actions) && (
        <div className="panel-head">
          <div><h3>{title}</h3>{sub && <p>{sub}</p>}</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>{actions}{icon && <span className="ic">{icon}</span>}</div>
        </div>
      )}
      {children}
    </section>
  )
}

export function Stat({ icon, n, unit, t }: { icon: ReactNode; n: string; unit?: string; t: string }) {
  return <div className="card stat card-in"><div style={{ flex: 1 }}><div className="n">{n}{unit && <small>{unit}</small>}</div><div className="t">{t}</div></div><span className="ic">{icon}</span></div>
}

export function Switch({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return <button className={`switch ${on ? 'on' : ''}`} onClick={() => onChange(!on)} role="switch" aria-checked={on}><i /></button>
}

export function PrefRow({ title, sub, children }: { title: string; sub?: string; children?: ReactNode }) {
  return <div className="pref-row"><div className="t"><b>{title}</b>{sub && <span>{sub}</span>}</div>{children}</div>
}

/* ---------- dropdown filter ---------- */
export function Filter({ label, items, value, onPick, width = 150 }: { label: string; items: string[]; value: string; onPick: (v: string) => void; width?: number }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h)
  }, [open])
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button className="btn btn-secondary btn-sm" style={{ width, justifyContent: 'space-between' }} onClick={() => setOpen(o => !o)}>
        <span style={{ color: value === items[0] ? 'var(--text-2)' : 'var(--text)' }}>{label}: {value}</span><I.Chevron size={14} />
      </button>
      {open && <div className="popover menu" style={{ top: 42, insetInlineStart: 0, minWidth: width }}>
        {items.map(it => <button key={it} className="menu-item" onClick={() => { onPick(it); setOpen(false) }}>{it}{value === it && <I.Check size={14} style={{ marginInlineStart: 'auto', color: 'var(--teal)' }} />}</button>)}
      </div>}
    </div>
  )
}

/* ---------- row action menu ---------- */
export function RowMenu({ items }: { items: { label: string; danger?: boolean; onClick: () => void }[] }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h)
  }, [open])
  return (
    <div className="rowmenu" ref={ref}>
      <button className="btn btn-ghost btn-icon" onClick={() => setOpen(o => !o)} aria-label="إجراءات"><I.More size={18} /></button>
      {open && <div className="popover menu" style={{ top: 38, insetInlineEnd: 0, minWidth: 190, zIndex: 20 }}>
        {items.map(it => <button key={it.label} className={`menu-item ${it.danger ? 'danger' : ''}`} onClick={() => { it.onClick(); setOpen(false) }}>{it.label}</button>)}
      </div>}
    </div>
  )
}

/* ---------- confirm modal ---------- */
export function Confirm({ title, body, confirmLabel, danger, onConfirm, onClose }: { title: string; body: string; confirmLabel: string; danger?: boolean; onConfirm: () => void; onClose: () => void }) {
  return (
    <div className="scrim" onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal" style={{ width: 440 }}>
        <div className="modal-header">
          <span className="tile" style={danger ? { background: '#fef2f2', color: '#b91c1c' } : undefined}><I.Info size={20} /></span>
          <div><div className="modal-title">{title}</div><div className="modal-sub">{body}</div></div>
          <button className="btn btn-ghost btn-icon close" onClick={onClose} aria-label="إغلاق"><I.Close size={18} /></button>
        </div>
        <div className="modal-footer" style={{ marginTop: 20 }}>
          <button className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm}>{confirmLabel}</button>
          <button className="btn btn-secondary" onClick={onClose}>إلغاء</button>
        </div>
      </div>
    </div>
  )
}

export function Empty({ icon, title, sub, action }: { icon?: ReactNode; title: string; sub?: string; action?: ReactNode }) {
  return <div className="empty card-in"><div className="ic">{icon ?? <I.Search size={24} />}</div><b style={{ fontSize: 14 }}>{title}</b>{sub && <p className="caption" style={{ marginTop: 6 }}>{sub}</p>}{action && <div style={{ marginTop: 14 }}>{action}</div>}</div>
}

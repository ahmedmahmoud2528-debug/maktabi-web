import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DESKS, FLOORS, PEOPLE, PLAN, type Desk, type Person } from '../data'
import { useStore } from '../store'
import { AssignOwnerDialog } from '../components/AssignOwner'
import { I } from '../components/Icons'
import { InviteModal } from '../components/InviteModal'
import { Sidebar } from '../components/Sidebar'

type Pop =
  | { kind: 'ctx'; desk: Desk }
  | { kind: 'clock'; desk: Desk }
  | { kind: 'person'; person: Person }
  | { kind: 'floors' }
  | { kind: 'assign'; desk: Desk }
  | null

export default function Floor() {
  const nav = useNavigate()
  const s = useStore()
  const wrap = useRef<HTMLDivElement>(null)
  const [fit, setFit] = useState(1)
  const [zoom, setZoom] = useState(1)
  const [pop, setPop] = useState<Pop>(null)
  const [me, setMe] = useState<{ x: number; y: number }>({ x: 796, y: 157 })

  // fit the plan to the available canvas
  useLayoutEffect(() => {
    const el = wrap.current; if (!el) return
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect()
      const sx = (r.width - 132) / PLAN.w, sy = (r.height - 136) / PLAN.h
      setFit(Math.max(0.25, Math.min(sx, sy, 1.2)))
    })
    ro.observe(el); return () => ro.disconnect()
  }, [])
  const scale = fit * zoom
  useEffect(() => { const h = (e: KeyboardEvent) => { if (e.key === 'Escape') setPop(null) }; window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h) }, [])

  const px = (v: number) => v * scale
  const people = useMemo(() => PEOPLE.filter(p => p.x !== undefined && !p.me), [])

  const walkTo = (x: number, y: number, label: string) => { setMe({ x, y }); s.toast('تم الانتقال إلى ' + label, 'أنت الآن عند هذا المكان.'); setPop(null) }
  const locate = (p: Person) => { if (p.x !== undefined && p.y !== undefined) setMe({ x: p.x + 50, y: p.y }) }

  return (
    <div className="floor-page">
      <Sidebar onLocate={locate} />
      <div className="floor-main" ref={wrap} onClick={() => setPop(null)}>
        <div className="floor-canvas">
          <div className="plan" style={{ width: px(PLAN.w), height: px(PLAN.h) }} onClick={e => e.stopPropagation()}>
            <img src="./assets/floor@2x.jpg" alt="مخطط الطابق الأول" draggable={false} />

            {DESKS.map(d => (
              <div key={d.id} className={`hot ${pop?.kind === 'ctx' && pop.desk.id === d.id ? 'selected' : ''}`} title={d.room ?? 'مكتب'}
                style={{ left: px(d.x), top: px(d.y), width: px(d.w), height: px(d.h) }}
                onClick={() => setPop(p => p?.kind === 'ctx' && p.desk.id === d.id ? null : { kind: 'ctx', desk: d })} />
            ))}

            {DESKS.filter(d => d.clock).map(d => {
              const owned = !!s.owners[d.id]
              return (
                <button key={'c' + d.id} className="badge-clock" title="ساعة الدوام" style={{ left: px(d.x + d.w) - 16, top: px(d.y) - 10 }}
                  onClick={() => setPop({ kind: 'clock', desk: d })}>
                  <I.Clock size={13} /><i style={{ background: owned ? 'var(--green)' : 'var(--slate-300)' }} />
                </button>
              )
            })}

            {people.map(p => (
              <div key={p.id} className="person" style={{ left: px(p.x!), top: px(p.y!) }} onMouseEnter={() => setPop({ kind: 'person', person: p })} onClick={() => setPop({ kind: 'person', person: p })}>
                <span className={`av`} style={{ background: p.color === 'purple' ? 'var(--purple)' : 'var(--navy)' }}>{p.initial}<i style={{ background: p.presence === 'focus' ? 'var(--purple)' : 'var(--green)' }} /></span>
                <span className="nm">{p.name.split(' ').slice(0, 2).join(' ')}</span>
              </div>
            ))}
            <div className="person me" style={{ left: px(me.x), top: px(me.y), transition: 'left .5s ease, top .5s ease' }}>
              <span className="av">{s.user.initial}<i style={{ background: 'var(--green)' }} /></span><span className="nm">{s.user.name} · أنت</span>
            </div>

            {pop?.kind === 'ctx' && <ContextMenu desk={pop.desk} scale={scale} onWalk={() => walkTo(pop.desk.x + pop.desk.w + 8, pop.desk.y, pop.desk.room ?? 'المكتب')} onStart={() => { s.setStartPoint(pop.desk.id); s.toast('تم تعيين نقطة البداية', 'سيتم إحضارك إلى هذا المكتب عند الدخول.'); setPop(null) }} onBack={() => { const d = DESKS.find(x => x.id === s.startPoint); if (d) walkTo(d.x + d.w + 8, d.y, 'نقطة البداية'); else { s.toast('لا توجد نقطة بداية بعد', 'اختر «تعيين كنقطة البداية» أولًا.'); setPop(null) } }} onAssign={() => setPop({ kind: 'assign', desk: pop.desk })} />}
            {pop?.kind === 'clock' && <ClockPopover desk={pop.desk} scale={scale} onClose={() => setPop(null)} />}
            {pop?.kind === 'person' && <PersonPopover person={pop.person} scale={scale} onLeave={() => setPop(null)} onChat={() => { s.openDM(pop.person.id); setPop(null) }} onGo={() => { locate(pop.person); s.toast('تم الانتقال إلى ' + pop.person.name.split(' ')[0]); setPop(null) }} />}
          </div>
        </div>

        <div className="rail" onClick={e => e.stopPropagation()}>
          <button title="تعديل الطابق" onClick={() => s.toast('محرر الطابق', 'المحرر سيُضاف في التحديث القادم.')}><I.Magic /></button>
          <button title="الطوابق" className={pop?.kind === 'floors' ? 'on' : ''} onClick={() => setPop(p => p?.kind === 'floors' ? null : { kind: 'floors' })}><I.Layers /></button>
          <button title="ملء الشاشة" onClick={() => document.documentElement.requestFullscreen?.()}><I.Expand /></button>
          <button title="موقعي" onClick={() => s.toast('موقعك', 'أنت في ' + s.user.where + '.')}><I.Gps /></button>
          <hr />
          <span className="zoom">{Math.round(zoom * 100)}%</span>
          <button title="تكبير" onClick={() => setZoom(z => Math.min(1.6, +(z + 0.1).toFixed(2)))}><I.Plus /></button>
          <button title="تصغير" onClick={() => setZoom(z => Math.max(0.6, +(z - 0.1).toFixed(2)))}><I.Minus /></button>
          {pop?.kind === 'floors' && <FloorSwitcher onPick={id => { s.setFloor(id); s.toast(FLOORS.find(f => f.id === id)!.name, 'تم الانتقال إلى الطابق.'); setPop(null) }} current={s.floor} />}
        </div>
        <button className="ai-btn" title="المساعد الذكي" onClick={() => s.toast('المساعد الذكي', 'يساعدك في تنظيم يومك — قريبًا.')}><I.Sparkle /></button>

        <ControlBar onLeave={() => nav('/workspaces')} />
      </div>

      {pop?.kind === 'assign' && <AssignOwnerDialog desk={pop.desk} onClose={() => setPop(null)} />}
      {s.invite && <InviteModal />}
      <Toasts />
    </div>
  )
}

function ContextMenu({ desk, scale, onWalk, onStart, onBack, onAssign }: { desk: Desk; scale: number; onWalk: () => void; onStart: () => void; onBack: () => void; onAssign: () => void }) {
  const left = Math.max(0, (desk.x + desk.w / 2) * scale - 105)
  return (
    <div className="popover menu ctx" style={{ left, top: (desk.y + desk.h) * scale + 8 }} onClick={e => e.stopPropagation()}>
      <button className="menu-item" onClick={onWalk}><I.Walk size={17} />المشي إلى هنا</button>
      <button className="menu-item" onClick={onStart}><I.Flag size={17} />تعيين كنقطة البداية</button>
      <button className="menu-item" onClick={onBack}><I.Home size={17} />العودة لنقطة البداية</button>
      <button className="menu-item" onClick={onAssign}><I.UserCircle size={17} />تعيين مالك المكتب</button>
    </div>
  )
}

function ClockPopover({ desk, scale, onClose }: { desk: Desk; scale: number; onClose: () => void }) {
  const { owners } = useStore()
  const owner = PEOPLE.find(p => p.id === owners[desk.id])
  const pct = owner ? 0 : 0
  const x = Math.min((desk.x + desk.w + 14) * scale, PLAN.w * scale - 350)
  const y = Math.max(0, (desk.y - 10) * scale)
  return (
    <div className="popover clock-pop" style={{ left: x, top: y }} onClick={e => e.stopPropagation()}>
      <div className="head">
        {owner ? <span className="ring" style={{ background: `conic-gradient(var(--teal) ${pct * 3.6}deg, var(--slate-100) 0)` }}><span style={{ background: '#fff', borderRadius: '50%', width: 34, height: 34, display: 'grid', placeItems: 'center' }}>{pct}%</span></span> : <span className="avatar"><I.Clock /></span>}
        <div style={{ flex: 1 }}><b style={{ fontSize: 14 }}>{owner ? owner.name : 'مكتب بدون مالك'}</b><div className="caption">{owner ? (desk.room ?? 'مكتب في المساحة المفتوحة') : 'عيّن مالكًا لتفعيل ساعة الدوام'}</div></div>
        <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="إغلاق"><I.Close size={18} /></button>
      </div>
      {owner ? (
        <>
          <div className="stats"><div className="stat"><b>0 د</b><span>عمل اليوم</span></div><div className="stat"><b>8 س</b><span>المتبقي من الدوام</span></div></div>
          <p className="caption" style={{ marginTop: 12 }}>دوام اليوم 8 ساعات — من ٩:٠٠ ص إلى ٥:٠٠ م</p>
          <p className="caption" style={{ color: 'var(--teal-pressed)', marginTop: 4 }}>الساعة تعمل الآن</p>
        </>
      ) : <p className="caption" style={{ marginTop: 12 }}>اضغط على المكتب ثم «تعيين مالك المكتب» لربط الساعة بموظف.</p>}
    </div>
  )
}

function PersonPopover({ person, scale, onLeave, onChat, onGo }: { person: Person; scale: number; onLeave: () => void; onChat: () => void; onGo: () => void }) {
  return (
    <div className="popover menu" style={{ left: Math.max(0, (person.x! + 23) * scale - 105), top: (person.y! + 52) * scale + 4 }} onMouseLeave={onLeave} onClick={e => e.stopPropagation()}>
      <div style={{ padding: '6px 12px 4px', fontSize: 12, color: 'var(--text-2)' }}>{person.name} · {person.role}</div>
      <button className="menu-item" onClick={onChat}><I.Chat size={17} />بدء محادثة</button>
      <button className="menu-item" onClick={onGo}><I.Walk size={17} />الذهاب إليه</button>
    </div>
  )
}

function FloorSwitcher({ current, onPick }: { current: string; onPick: (id: string) => void }) {
  return (
    <div className="popover fs-pop" style={{ left: 84, top: 40 }}>
      <b style={{ fontSize: 14 }}>الطوابق المتاحة</b>
      {FLOORS.map(f => <button key={f.id} className={`fs-row ${current === f.id ? 'on' : ''}`} onClick={() => onPick(f.id)}><span className="avatar sm"><I.Layers size={15} /></span><span style={{ flex: 1 }}><b>{f.name}</b><span>{f.desc}</span></span>{current === f.id && <I.Check size={16} style={{ color: 'var(--teal)' }} />}</button>)}
    </div>
  )
}

function ControlBar({ onLeave }: { onLeave: () => void }) {
  const s = useStore()
  const [status, setStatus] = useState('متاح')
  const [showStatus, setShowStatus] = useState(false)
  return (
    <div className="ctrl-bar" onClick={e => e.stopPropagation()}>
      <button className={`ctrl ${s.mic ? 'on' : 'off'}`} onClick={() => s.toggle('mic')}>{s.mic ? <I.Mic /> : <I.MicOff />}الميكروفون</button>
      <button className={`ctrl ${s.cam ? 'on' : 'off'}`} onClick={() => s.toggle('cam')}>{s.cam ? <I.Cam /> : <I.CamOff />}الكاميرا</button>
      <span className="ctrl-sep" />
      <button className={`ctrl ${s.sharing ? 'on' : ''}`} onClick={() => { s.toggle('sharing'); s.toast(s.sharing ? 'تم إيقاف مشاركة الشاشة' : 'بدأت مشاركة الشاشة') }}><I.Screen />مشاركة الشاشة</button>
      <button className={`ctrl ${s.recording ? 'off' : ''}`} onClick={() => { s.toggle('recording'); s.toast(s.recording ? 'تم إيقاف التسجيل' : 'بدأ التسجيل', s.recording ? undefined : 'سيُحفظ التسجيل في مكتبة التسجيلات.') }}><I.Record />التسجيل</button>
      <div style={{ position: 'relative' }}>
        <button className="ctrl" onClick={() => setShowStatus(v => !v)}><I.Status />{status}</button>
        {showStatus && <div className="popover menu" style={{ bottom: 64, left: '50%', transform: 'translateX(-50%)' }}>{['متاح', 'تركيز', 'بعيد', 'لا تزعجني'].map(x => <button key={x} className="menu-item" onClick={() => { setStatus(x); setShowStatus(false) }}><i className={`dot ${x === 'متاح' ? 'green' : x === 'تركيز' ? 'purple' : x === 'بعيد' ? 'amber' : 'gray'}`} />{x}</button>)}</div>}
      </div>
      <button className="ctrl" onClick={() => s.toast('المشاركون', `${PEOPLE.filter(p => p.presence !== 'offline').length} متصلون الآن في الطابق الأول.`)}><I.People />المشاركون</button>
      <button className="ctrl" onClick={() => s.toast('الغرف', 'قاعة الاجتماعات · غرفة التركيز · المطبخ · المكاتب الخاصة')}><I.Rooms />الغرف</button>
      <button className="ctrl" onClick={() => s.toast('نافذة مستقلة', 'سيتم فتح المكتب في نافذة مستقلة.')}><I.Popout />نافذة مستقلة</button>
      <span className="ctrl-sep" />
      <button className="ctrl leave" onClick={onLeave}><I.Leave />مغادرة</button>
    </div>
  )
}

export function Toasts() {
  const { toasts, dismissToast } = useStore()
  return (
    <div className="toast-wrap">
      {toasts.map(t => <div className="toast" key={t.id} onClick={() => dismissToast(t.id)}><span className="tile"><I.Check size={18} /></span><div><b>{t.title}</b>{t.body && <span>{t.body}</span>}</div></div>)}
    </div>
  )
}

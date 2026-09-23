import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DESKS, FLOORS, PEOPLE, PLAN, ROOMS, type Desk, type Person, type Room } from '../data'
import { useStore } from '../store'
import { AssignOwnerDialog } from '../components/AssignOwner'
import { I } from '../components/Icons'
import { Sidebar } from '../components/Sidebar'

type Pop =
  | { kind: 'ctx'; desk: Desk }
  | { kind: 'clock'; desk: Desk }
  | { kind: 'person'; person: Person }
  | { kind: 'floors' }
  | { kind: 'assign'; desk: Desk }
  | { kind: 'ai' }
  | null

const AUDIO_R = 88 // نصف قطر مدى الصوت في المساحة المفتوحة (بوحدات المخطط — مطابق لفيجما)
const roomAt = (x: number, y: number): Room | null => ROOMS.find(r => x > r.x && x < r.x + r.w && y > r.y && y < r.y + r.h) ?? null

export default function Floor() {
  const nav = useNavigate()
  const s = useStore()
  const wrap = useRef<HTMLDivElement>(null)
  const planRef = useRef<HTMLDivElement>(null)
  const [fit, setFit] = useState(1)
  const [zoom, setZoom] = useState(1)
  const [pop, setPop] = useState<Pop>(null)
  const [me, setMe] = useState({ x: 520, y: 520 })
  const [walking, setWalking] = useState(false)
  const [knock, setKnock] = useState<Room | null>(null)

  useLayoutEffect(() => {
    const el = wrap.current; if (!el) return
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect()
      setFit(Math.max(0.25, Math.min((r.width - 56) / PLAN.w, (r.height - 136) / PLAN.h, 1.2)))
    })
    ro.observe(el); return () => ro.disconnect()
  }, [])
  const scale = fit * zoom
  const px = (v: number) => v * scale
  useEffect(() => { const h = (e: KeyboardEvent) => { if (e.key === 'Escape') setPop(null) }; window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h) }, [])

  const myRoom = roomAt(me.x + 23, me.y + 25)
  const others = useMemo(() => PEOPLE.filter(p => p.x !== undefined && !p.me), [])
  const inRange = (p: Person) => {
    const pr = roomAt(p.x! + 23, p.y! + 25)
    if (myRoom) return pr?.name === myRoom.name
    if (pr) return false
    return Math.hypot(p.x! - me.x, p.y! - me.y) < AUDIO_R
  }

  /* التنقّل بدون إشعار — الحركة نفسها هي التغذية الراجعة */
  const walkTo = (x: number, y: number, _label?: string) => {
    const nx = Math.max(16, Math.min(PLAN.w - 62, x)), ny = Math.max(16, Math.min(PLAN.h - 66, y))
    setWalking(true); setMe({ x: nx, y: ny }); setPop(null)
    window.setTimeout(() => setWalking(false), 640)
  }
  const onPlanDouble = (e: React.MouseEvent) => {
    const box = planRef.current!.getBoundingClientRect()
    const x = (e.clientX - box.left) / scale - 23, y = (e.clientY - box.top) / scale - 25
    const r = roomAt(x + 23, y + 25)
    walkTo(x, y, r ? r.name : 'المساحة المفتوحة')
  }
  const locate = (p: Person) => { if (p.x !== undefined) walkTo(p.x + 54, p.y!, p.name.split(' ')[0]) }

  return (
    <div className="floor-page">
      <Sidebar onLocate={locate} />
      <div className="floor-main" ref={wrap} onClick={() => setPop(null)}>
        <div className="floor-canvas">
          <div ref={planRef} className="plan" style={{ width: px(PLAN.w), height: px(PLAN.h) }}
            onClick={e => e.stopPropagation()} onDoubleClick={onPlanDouble} title="اضغط مرتين للانتقال إلى أي مكان">
            <img src="./assets/floor@2x.jpg" alt="مخطط الطابق الأول" draggable={false} />

            {/* إضاءة الغرفة: الغرفة منوّرة والباقي مظلم */}
            <svg className="spotlight" viewBox={`0 0 ${PLAN.w} ${PLAN.h}`} preserveAspectRatio="none" style={{ opacity: myRoom ? 1 : 0 }}>
              <defs><mask id="room-mask">
                <rect width={PLAN.w} height={PLAN.h} fill="#fff" />
                {myRoom && <rect x={myRoom.x} y={myRoom.y} width={myRoom.w} height={myRoom.h} rx={8} fill="#000" />}
              </mask></defs>
              <rect width={PLAN.w} height={PLAN.h} fill="#050b14" opacity={0.58} mask="url(#room-mask)" />
              {myRoom && <rect x={myRoom.x + 1} y={myRoom.y + 1} width={myRoom.w - 2} height={myRoom.h - 2} rx={8} fill="none" stroke="#14b8a6" strokeWidth={2} />}
            </svg>

            {/* مدى الصوت في المساحة المفتوحة */}
            {!myRoom && <div className="audio-radius" style={{ left: px(me.x + 23 - AUDIO_R), top: px(me.y + 25 - AUDIO_R), width: px(AUDIO_R * 2), height: px(AUDIO_R * 2) }} />}

            {DESKS.map(d => (
              <div key={d.id} className={`hot ${pop?.kind === 'ctx' && pop.desk.id === d.id ? 'selected' : ''}`} title={d.room ?? 'مكتب'}
                style={{ left: px(d.x), top: px(d.y), width: px(d.w), height: px(d.h) }}
                onClick={() => setPop(p => p?.kind === 'ctx' && p.desk.id === d.id ? null : { kind: 'ctx', desk: d })}
                onDoubleClick={e => { e.stopPropagation(); walkTo(d.x + d.w + 6, d.y, d.room ?? 'المكتب') }} />
            ))}

            {ROOMS.filter(r => r.name !== 'المطبخ').map(r => (
              <button key={'k' + r.name} className="door" title={`اطرق باب ${r.name}`} style={{ left: px(r.x + r.w / 2 - 13), top: px(r.y + r.h - 7) }}
                onClick={e => { e.stopPropagation(); setKnock(r) }}><I.Door size={13} /></button>
            ))}

            {DESKS.filter(d => d.clock).map(d => (
              <button key={'c' + d.id} className="badge-clock" title="ساعة الدوام" style={{ left: px(d.x + d.w) - 16, top: px(d.y) - 10 }}
                onClick={e => { e.stopPropagation(); setPop({ kind: 'clock', desk: d }) }}>
                <I.Clock size={13} /><i style={{ background: s.owners[d.id] ? 'var(--green)' : 'var(--slate-300)' }} />
              </button>
            ))}

            {others.map(p => {
              const heard = inRange(p)
              return (
                <div key={p.id} className={`person ${heard ? 'heard' : 'faded'}`} style={{ left: px(p.x!), top: px(p.y!) }}
                  onMouseEnter={() => setPop({ kind: 'person', person: p })} onClick={e => { e.stopPropagation(); setPop({ kind: 'person', person: p }) }}
                  onDoubleClick={e => { e.stopPropagation(); locate(p) }}>
                  <span className="av" style={{ background: p.color === 'purple' ? 'var(--purple)' : 'var(--navy)' }}>{p.initial}<i style={{ background: p.presence === 'focus' ? 'var(--purple)' : 'var(--green)' }} /></span>
                  <span className="nm">{p.name.split(' ').slice(0, 2).join(' ')}</span>
                </div>
              )
            })}

            <div className={`person me ${walking ? 'walking' : ''}`} style={{ left: px(me.x), top: px(me.y) }}>
              <span className="av">{s.user.initial}<i style={{ background: 'var(--green)' }} /></span>
              <span className="nm">{s.user.name} · أنت</span>
            </div>

            {pop?.kind === 'ctx' && <ContextMenu desk={pop.desk} scale={scale}
              onWalk={() => walkTo(pop.desk.x + pop.desk.w + 6, pop.desk.y, pop.desk.room ?? 'المكتب')}
              onStart={() => { s.setStartPoint(pop.desk.id); s.toast('تم تعيين نقطة البداية', 'سيتم إحضارك إلى هذا المكتب عند الدخول.'); setPop(null) }}
              onBack={() => { const d = DESKS.find(x => x.id === s.startPoint); if (d) walkTo(d.x + d.w + 6, d.y, 'نقطة البداية'); else { s.toast('لا توجد نقطة بداية بعد', 'اختر «تعيين كنقطة البداية» أولًا.'); setPop(null) } }}
              onAssign={() => setPop({ kind: 'assign', desk: pop.desk })} />}
            {pop?.kind === 'clock' && <ClockPopover desk={pop.desk} scale={scale} onClose={() => setPop(null)} />}
            {pop?.kind === 'person' && <PersonPopover person={pop.person} scale={scale} heard={inRange(pop.person)} onLeave={() => setPop(null)}
              onChat={() => { s.openDM(pop.person.id); setPop(null) }} onGo={() => locate(pop.person)} />}
          </div>
        </div>


        <div className="rail" onClick={e => e.stopPropagation()}>
          <button title="تعديل الطابق" onClick={() => nav('/editor')}><I.Magic /></button>
          <button title="الطوابق" className={pop?.kind === 'floors' ? 'on' : ''} onClick={() => setPop(p => p?.kind === 'floors' ? null : { kind: 'floors' })}><I.Layers /></button>
          <button title="ملء الشاشة" onClick={() => document.documentElement.requestFullscreen?.()}><I.Expand /></button>
          <button title="العودة لمكاني" onClick={() => walkTo(520, 520, 'المساحة المفتوحة')}><I.Gps /></button>
          <hr />
          <span className="zoom">{Math.round(zoom * 100)}%</span>
          <button title="تكبير" onClick={() => setZoom(z => Math.min(1.6, +(z + 0.1).toFixed(2)))}><I.Plus /></button>
          <button title="تصغير" onClick={() => setZoom(z => Math.max(0.6, +(z - 0.1).toFixed(2)))}><I.Minus /></button>
          {pop?.kind === 'floors' && <FloorSwitcher current={s.floor} onPick={id => { s.setFloor(id); s.toast(FLOORS.find(f => f.id === id)!.name, 'تم الانتقال إلى الطابق.'); setPop(null) }} />}
        </div>

        <button className="ai-btn" title="المساعد الذكي" onClick={e => { e.stopPropagation(); setPop({ kind: 'ai' }) }}><I.Sparkle /></button>
        {pop?.kind === 'ai' && <AIPanel onClose={() => setPop(null)} />}

        <div className="ctrl-wrap"><ControlBar onLeave={() => nav('/workspaces')} inRoom={!!myRoom} /></div>
      </div>

      {pop?.kind === 'assign' && <AssignOwnerDialog desk={pop.desk} onClose={() => setPop(null)} />}
      {knock && <KnockToast room={knock} onClose={() => setKnock(null)} />}
    </div>
  )
}

function ContextMenu({ desk, scale, onWalk, onStart, onBack, onAssign }: { desk: Desk; scale: number; onWalk: () => void; onStart: () => void; onBack: () => void; onAssign: () => void }) {
  return (
    <div className="popover menu ctx" style={{ left: Math.max(0, (desk.x + desk.w / 2) * scale - 105), top: (desk.y + desk.h) * scale + 8 }} onClick={e => e.stopPropagation()}>
      <button className="menu-item" onClick={onWalk}><I.Walk size={17} />المشي إلى هنا</button>
      <button className="menu-item" onClick={onStart}><I.Flag size={17} />تعيين كنقطة البداية</button>
      <button className="menu-item" onClick={onBack}><I.Home size={17} />العودة لنقطة البداية</button>
      <button className="menu-item" onClick={onAssign}><I.UserCircle size={17} />تعيين مالك المكتب</button>
    </div>
  )
}

function ClockPopover({ desk, scale, onClose }: { desk: Desk; scale: number; onClose: () => void }) {
  const { owners, toast } = useStore()
  const owner = PEOPLE.find(p => p.id === owners[desk.id])
  const [running, setRunning] = useState(true)
  const pct = running ? 62 : 38
  return (
    <div className="popover clock-pop" style={{ left: Math.min((desk.x + desk.w + 14) * scale, PLAN.w * scale - 350), top: Math.max(0, (desk.y - 10) * scale) }} onClick={e => e.stopPropagation()}>
      <div className="head">
        {owner ? <span className="ring" style={{ background: `conic-gradient(var(--teal) ${pct * 3.6}deg, var(--slate-100) 0)` }}><span style={{ background: '#fff', borderRadius: '50%', width: 34, height: 34, display: 'grid', placeItems: 'center' }}>{pct}%</span></span> : <span className="avatar"><I.Clock /></span>}
        <div style={{ flex: 1 }}><b style={{ fontSize: 14 }}>{owner ? owner.name : 'مكتب بدون مالك'}</b><div className="caption">{owner ? (desk.room ?? 'مكتب في المساحة المفتوحة') : 'عيّن مالكًا لتفعيل ساعة الدوام'}</div></div>
        <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="إغلاق"><I.Close size={18} /></button>
      </div>
      {owner ? <>
        <div className="stats"><div className="stat"><b>{running ? '4 س 58 د' : '3 س 02 د'}</b><span>عمل اليوم</span></div><div className="stat"><b>{running ? '3 س 02 د' : '4 س 58 د'}</b><span>المتبقي من الدوام</span></div></div>
        <p className="caption" style={{ marginTop: 12 }}>دوام اليوم 8 ساعات — من ٩:٠٠ ص إلى ٥:٠٠ م</p>
        <button className="btn btn-secondary btn-sm" style={{ marginTop: 10, width: '100%' }} onClick={() => { setRunning(r => !r); toast(running ? 'تم إيقاف الساعة مؤقتًا' : 'الساعة تعمل الآن') }}>
          {running ? <><I.Minus size={15} />إيقاف مؤقت</> : <><I.Play size={15} />استئناف العمل</>}
        </button>
      </> : <p className="caption" style={{ marginTop: 12 }}>اضغط على المكتب ثم «تعيين مالك المكتب» لربط الساعة بموظف.</p>}
    </div>
  )
}

function PersonPopover({ person, scale, heard, onLeave, onChat, onGo }: { person: Person; scale: number; heard: boolean; onLeave: () => void; onChat: () => void; onGo: () => void }) {
  return (
    <div className="popover menu" style={{ left: Math.max(0, (person.x! + 23) * scale - 105), top: (person.y! + 52) * scale + 4 }} onMouseLeave={onLeave} onClick={e => e.stopPropagation()}>
      <div style={{ padding: '6px 12px 4px' }}>
        <b style={{ fontSize: 12.5 }}>{person.name}</b>
        <div className="caption">{person.role} · {person.where}</div>
        <span className={`pill ${heard ? 'green' : ''}`} style={{ marginTop: 6 }}>{heard ? 'ضمن نطاق صوتك' : 'خارج نطاق السماع'}</span>
      </div>
      <button className="menu-item" onClick={onChat}><I.Chat size={17} />بدء محادثة</button>
      <button className="menu-item" onClick={onGo}><I.Walk size={17} />الذهاب إليه</button>
    </div>
  )
}

function FloorSwitcher({ current, onPick }: { current: string; onPick: (id: string) => void }) {
  const nav = useNavigate()
  return (
    <div className="popover fs-pop" style={{ left: 84, top: 40 }} onClick={e => e.stopPropagation()}>
      <b style={{ fontSize: 14 }}>الطوابق المتاحة</b>
      {FLOORS.map(f => <button key={f.id} className={`fs-row ${current === f.id ? 'on' : ''}`} onClick={() => onPick(f.id)}>
        <span className="avatar sm"><I.Layers size={15} /></span><span style={{ flex: 1 }}><b>{f.name}</b><span>{f.desc}</span></span>{current === f.id && <I.Check size={16} style={{ color: 'var(--teal)' }} />}
      </button>)}
      <button className="btn btn-secondary btn-sm" style={{ width: '100%', marginTop: 10 }} onClick={() => nav('/create-floor')}><I.Plus size={15} />إنشاء طابق جديد</button>
    </div>
  )
}

function AIPanel({ onClose }: { onClose: () => void }) {
  const { toast } = useStore()
  const [msgs, setMsgs] = useState([{ me: false, t: 'أهلاً أحمد 👋 أقدر ألخّص لك يومك أو أجهّزك لاجتماعك القادم.' }])
  const [rec, setRec] = useState(false)
  const [text, setText] = useState('')
  const quick = ['ملخص يومي', 'جهّزني للاجتماع', 'ملاحظات الاجتماع', 'تابع معي المهام']
  const ask = (q: string) => setMsgs(m => [...m, { me: true, t: q }, { me: false, t: q === 'ملخص يومي' ? 'اليوم: 3 اجتماعات، 5 رسائل غير مقروءة، وطلبان بانتظار موافقتك.' : 'تمام — جهّزت لك الملخص، تقدر تفتحه من التسجيلات.' }])
  return (
    <div className="popover ai-panel" onClick={e => e.stopPropagation()}>
      <div className="dm-head" style={{ padding: '12px 14px' }}>
        <span className="avatar sm teal"><I.Sparkle size={16} /></span>
        <span className="t"><b>المساعد الذكي</b><span>يساعدك في تنظيم يومك</span></span>
        <button className="btn btn-ghost btn-icon" style={{ marginInlineStart: 'auto' }} onClick={onClose}><I.Close size={18} /></button>
      </div>
      <div className="ai-body">
        {msgs.map((m, i) => <div key={i} className={`bubble ${m.me ? 'me' : ''}`}>{m.t}</div>)}
        {rec && <div className="bubble" style={{ display: 'flex', gap: 8, alignItems: 'center' }}><span className="rec-dot" />جارٍ التسجيل… سألخّص لك الاجتماع بعد انتهائه.</div>}
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', padding: '0 14px 10px' }}>
        {quick.map(q => <button key={q} className="chip" style={{ height: 30, fontSize: 12 }} onClick={() => ask(q)}>{q}</button>)}
      </div>
      <form className="composer" style={{ padding: '0 14px 14px' }} onSubmit={e => { e.preventDefault(); if (text.trim()) { ask(text); setText('') } }}>
        <button type="button" className={`round ${rec ? 'send' : 'attach'}`} onClick={() => { setRec(r => !r); toast(rec ? 'تم إيقاف التسجيل' : 'بدأ تسجيل الاجتماع') }} title="تسجيل"><I.Mic size={18} /></button>
        <div className="pill"><input placeholder="اسأل المساعد…" value={text} onChange={e => setText(e.target.value)} /></div>
      </form>
    </div>
  )
}

/* تنبيه خفيف أسفل اليمين: مجرد إشارة إنك طرقت، بدون أزرار */
function KnockToast({ room, onClose }: { room: Room; onClose: () => void }) {
  useEffect(() => { const t = window.setTimeout(onClose, 2600); return () => window.clearTimeout(t) }, [onClose])
  return (
    <div className="knock">
      <span className="k-ic"><I.Door size={14} /></span>
      طرقت على باب {room.name}
    </div>
  )
}

/* ترتيب الأزرار ومسمياتها مطابق لشاشة فيجما «App / Workspace Floor / Desktop» */
function ControlBar({ onLeave, inRoom }: { onLeave: () => void; inRoom: boolean }) {
  const s = useStore()
  const [showStatus, setShowStatus] = useState(false)
  return (
    <div className="ctrl-bar" onClick={e => e.stopPropagation()}>
      <button className={`ctrl ${s.mic ? 'on' : 'off'}`} onClick={() => s.toggle('mic')}>{s.mic ? <I.Mic /> : <I.MicOff />}الميكروفون</button>
      <button className={`ctrl ${s.cam ? 'on' : 'off'}`} onClick={() => s.toggle('cam')}>{s.cam ? <I.Cam /> : <I.CamOff />}الكاميرا</button>
      <span className="ctrl-sep" />
      <button className={`ctrl ${s.sharing ? 'on' : ''}`} onClick={() => { s.toggle('sharing'); s.toast(s.sharing ? 'تم إيقاف مشاركة الشاشة' : 'بدأت مشاركة الشاشة', inRoom ? 'يراها من في الغرفة فقط.' : 'يراها من في نطاق صوتك.') }}><I.Screen />مشاركة الشاشة</button>
      <button className={`ctrl ${s.recording ? 'off' : ''}`} onClick={() => { s.toggle('recording'); s.toast(s.recording ? 'تم إيقاف التسجيل' : 'بدأ التسجيل', s.recording ? undefined : 'سيُحفظ في مكتبة التسجيلات.') }}><I.Record />التسجيل</button>
      <div style={{ position: 'relative' }}>
        <button className="ctrl" onClick={() => setShowStatus(v => !v)}><I.Status />الحالة</button>
        {showStatus && <div className="popover menu" style={{ bottom: 64, left: '50%', transform: 'translateX(-50%)' }}>
          {['متاح', 'تركيز', 'بعيد', 'لا تزعجني'].map(x => <button key={x} className="menu-item" onClick={() => { setShowStatus(false); s.toast('تم تحديث حالتك', x) }}><i className={`dot ${x === 'متاح' ? 'green' : x === 'تركيز' ? 'purple' : x === 'بعيد' ? 'amber' : 'gray'}`} />{x}</button>)}
        </div>}
      </div>
      <button className="ctrl" onClick={() => s.toast('الغرف', ROOMS.map(r => r.name).join(' · '))}><I.Rooms />الغرف</button>
      <button className="ctrl" onClick={() => s.toast('نافذة مستقلة', 'فتح المكتب في نافذة صغيرة فوق باقي التطبيقات.')}><I.Popout />نافذة مستقلة</button>
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

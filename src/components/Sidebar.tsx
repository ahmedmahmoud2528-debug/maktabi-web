import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CHANNELS, EMOJIS, GROUPS, PEOPLE, type Person } from '../data'
import { useStore } from '../store'
import { I } from './Icons'

const PRESENCE: Record<Person['presence'], [string, string]> = { available: ['متاح', 'green'], focus: ['تركيز', 'purple'], away: ['بعيد', 'amber'], offline: ['غير متصل', 'gray'] }

/* التطبيقات والإدارة — نفس شبكة فيجما */
const APPS: [string, JSX.Element, string][] = [
  ['حضوري', <I.Clock size={18} />, '/admin/attendance'],
  ['الفريق', <I.People size={18} />, '/admin/members'],
  ['الحضور والتقارير', <I.Calendar size={18} />, '/admin/attendance'],
  ['التسجيلات', <I.Cam size={18} />, '/admin/recordings'],
  ['مساحات العمل', <I.Building size={18} />, '/workspaces'],
  ['إدارة المساحة', <I.Status size={18} />, '/admin/workspace'],
  ['الإعدادات', <I.Settings size={18} />, '/admin/settings'],
]

export function Sidebar({ onLocate }: { onLocate: (p: Person) => void }) {
  const { dm, openDM, setInvite, user, toast } = useStore()
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const [apps, setApps] = useState(false)
  const appsRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!apps) return
    const h = (e: MouseEvent) => { if (appsRef.current && !appsRef.current.contains(e.target as Node)) setApps(false) }
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setApps(false) }
    document.addEventListener('mousedown', h); document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('mousedown', h); document.removeEventListener('keydown', esc) }
  }, [apps])
  const person = dm ? PEOPLE.find(p => p.id === dm) : null
  if (person) return <DM person={person} onBack={() => openDM(null)} onLocate={onLocate} />

  const online = PEOPLE.filter(p => p.presence !== 'offline' && p.name.includes(q))
  const offline = PEOPLE.filter(p => p.presence === 'offline' && p.name.includes(q))
  return (
    <aside className="sidebar">
      <div className="sb-head">
        <img src="./assets/logo.svg" alt="مكتبي" style={{ width: 118 }} />
        <div className="sb-ws"><span className="tile"><I.Building size={14} /></span>قمرة السعادة</div>
        <div className="sb-floor"><I.Layers size={13} /> الطابق الأول · فريق التصميم</div>
      </div>
      <div className="sb-invite" ref={appsRef}>
        <button className="btn btn-primary btn-fill" onClick={() => setInvite(true)}>دعوة عضو</button>
        <button className={`apps ${apps ? 'on' : ''}`} title="التطبيقات والإدارة" onClick={() => setApps(o => !o)}><I.Apps size={20} /></button>
        {apps && (
          <div className="popover apps-pop">
            <div className="caption apps-head">التطبيقات والإدارة</div>
            <div className="apps-grid">
              {APPS.map(([label, icon, to]) => (
                <button key={label as string} className="app-tile" onClick={() => { setApps(false); nav(to as string) }}>
                  <span className="ic">{icon}</span>
                  <span className="t">{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="sb-search"><div className="field"><I.Search className="icon-sm" style={{ color: 'var(--text-3)' }} /><input placeholder="ابحث عن شخص أو مكان" value={q} onChange={e => setQ(e.target.value)} /></div></div>
      <div className="sb-body">
        <div className="sb-line">الطابق الأول · {PEOPLE.filter(p => p.presence !== 'offline').length} متصلون الآن</div>
        <button className="sb-item" onClick={() => toast('المحادثة العامة', 'فتح المحادثة العامة سيُضاف في التحديث القادم.')}><span className="ic"><I.Chats size={16} /></span>المحادثة العامة<span className="cnt">7</span></button>
        <div className="sb-sec"><span>القنوات</span><I.Chevron size={14} /></div>
        {CHANNELS.map(c => <button className="sb-item" key={c} onClick={() => toast(`#${c}`, 'القنوات ستُفعّل في التحديث القادم.')}><span className="ic"><I.Hash size={16} /></span>{c}</button>)}
        <div className="sb-sec"><span>المجموعات</span><I.Chevron size={14} /></div>
        {GROUPS.map(g => <button className="sb-item" key={g.name} onClick={() => toast(g.name, 'المجموعات ستُفعّل في التحديث القادم.')}><span className="ic"><I.Group size={16} /></span>{g.name}<span className="cnt">{g.n}</span></button>)}
        <div className="sb-sec"><span>متصل {online.length}</span><I.Chevron size={14} /></div>
        {online.map(p => <PersonRow key={p.id} p={p} me={p.id === user.id} onClick={() => p.id === user.id ? toast('هذا أنت', 'يمكنك تغيير حالتك من شريط الاجتماع.') : openDM(p.id)} />)}
        <div className="sb-sec"><span>غير متصل {offline.length}</span><I.Chevron size={14} /></div>
        {offline.map(p => <PersonRow key={p.id} p={p} onClick={() => openDM(p.id)} />)}
      </div>
    </aside>
  )
}

function PersonRow({ p, me, onClick }: { p: Person; me?: boolean; onClick: () => void }) {
  const [label, dot] = PRESENCE[p.presence]
  return (
    <button className="sb-person" onClick={onClick}>
      <span className={`avatar sm ${p.color ?? 'dark'}`} style={p.presence === 'offline' ? { opacity: .5 } : undefined}>{p.initial}</span>
      <span className="t"><b>{p.name}{me ? ' · أنت' : ''}</b><span>{p.where}</span></span>
      <span className="st"><i className={`dot ${dot}`} />{label}</span>
    </button>
  )
}

function DM({ person, onBack, onLocate }: { person: Person; onBack: () => void; onLocate: (p: Person) => void }) {
  const { toast } = useStore()
  const [msgs, setMsgs] = useState([
    { me: false, t: 'أهلاً! جاهز نراجع تصميم الطابق؟' },
    { me: true, t: 'تمام، أنا في المساحة المفتوحة الآن.' },
    { me: false, t: 'أوافيك بعد الاجتماع بخمس دقائق.' },
  ])
  const [text, setText] = useState('')
  const [emoji, setEmoji] = useState(false)
  const send = (t: string) => { if (!t.trim()) return; setMsgs(m => [...m, { me: true, t }]); setText(''); setEmoji(false) }
  const [label, dot] = PRESENCE[person.presence]
  return (
    <aside className="sidebar" style={{ position: 'relative' }}>
      <div className="sb-head"><img src="./assets/logo.svg" alt="مكتبي" style={{ width: 118 }} /><div className="sb-ws"><span className="tile"><I.Building size={14} /></span>قمرة السعادة</div><div className="sb-floor"><I.Layers size={13} /> الطابق الأول · فريق التصميم</div></div>
      <div className="dm-head" style={{ marginTop: 14 }}>
        <button className="btn-ghost" onClick={onBack} aria-label="رجوع" style={{ width: 28, height: 28, borderRadius: 8, display: 'grid', placeItems: 'center' }}><I.ChevronR size={18} /></button>
        <span className={`avatar sm ${person.color ?? 'dark'}`}>{person.initial}</span>
        <span className="t"><b>{person.name}</b><span><i className={`dot ${dot}`} style={{ marginInlineEnd: 4 }} />{label} · {person.where}</span></span>
        <span className="acts" style={{ marginInlineStart: 'auto' }}>
          <button title="الذهاب إليه" onClick={() => { onLocate(person); toast('تم الانتقال إلى ' + person.name.split(' ')[0]) }}><I.Walk size={16} /></button>
          <button title="إرسال إيموجي" onClick={() => setEmoji(v => !v)}><I.Emoji size={16} /></button>
        </span>
      </div>
      <div className="dm-body">{msgs.map((m, i) => <div className={`bubble ${m.me ? 'me' : ''}`} key={i}>{m.t}</div>)}</div>
      <form className="composer" onSubmit={e => { e.preventDefault(); send(text) }}>
        <button type="button" className="round attach" aria-label="إرفاق" onClick={() => toast('إرفاق ملف', 'المرفقات ستُضاف لاحقًا.')}><I.Plus size={18} /></button>
        <div className="pill">
          <input placeholder="اكتب رسالة…" value={text} onChange={e => setText(e.target.value)} />
          <button type="button" onClick={() => setEmoji(v => !v)} aria-label="إيموجي" style={{ color: 'var(--text-2)', display: 'grid' }}><I.Emoji size={18} /></button>
          <button type="button" className="gif" onClick={() => toast('GIF', 'مكتبة الصور المتحركة ستُضاف لاحقًا.')}>GIF</button>
        </div>
        <button type="submit" className="round send" aria-label="إرسال"><I.Send size={18} /></button>
      </form>
      {emoji && (
        <div className="popover emoji-pop">
          <div className="t">تفاعل سريع</div>
          <div className="emoji-grid">{EMOJIS.map(e => <button key={e} onClick={() => send(e)}>{e}</button>)}</div>
        </div>
      )}
    </aside>
  )
}

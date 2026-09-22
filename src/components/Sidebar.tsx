import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CHANNELS, EMOJIS, GROUPS, PEOPLE, type Person } from '../data'
import { useStore } from '../store'
import { I } from './Icons'

const PRESENCE: Record<Person['presence'], [string, string]> = { available: ['متاح', 'green'], focus: ['تركيز', 'purple'], away: ['بعيد', 'amber'], offline: ['غير متصل', 'gray'] }

export function Sidebar({ onLocate }: { onLocate: (p: Person) => void }) {
  const { dm, openDM, setInvite, user, toast } = useStore()
  const nav = useNavigate()
  const [q, setQ] = useState('')
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
      <div className="sb-invite">
        <button className="btn btn-primary btn-fill" onClick={() => setInvite(true)}>دعوة عضو</button>
        <button className="apps" title="التطبيقات" onClick={() => nav('/admin/members')}><I.Apps size={20} /></button>
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
        <button type="submit" className="round send" aria-label="إرسال"><I.Send size={18} /></button>
        <div className="pill">
          <button type="button" className="gif" onClick={() => toast('GIF', 'مكتبة الصور المتحركة ستُضاف لاحقًا.')}>GIF</button>
          <button type="button" onClick={() => setEmoji(v => !v)} aria-label="إيموجي" style={{ color: 'var(--text-2)', display: 'grid' }}><I.Emoji size={18} /></button>
          <input placeholder="اكتب رسالة…" value={text} onChange={e => setText(e.target.value)} />
        </div>
        <button type="button" className="round attach" aria-label="إرفاق" onClick={() => toast('إرفاق ملف', 'المرفقات ستُضاف لاحقًا.')}><I.Plus size={18} /></button>
      </form>
      {emoji && (
        <div className="popover emoji-pop" style={{ right: 'auto', left: -232 }}>
          <div className="t">تفاعل سريع</div>
          <div className="emoji-grid">{EMOJIS.map(e => <button key={e} onClick={() => send(e)}>{e}</button>)}</div>
        </div>
      )}
    </aside>
  )
}

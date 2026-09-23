import { Fragment, useMemo, useRef, useState, useEffect } from 'react'
import { AdminLayout, Confirm, Empty, Filter, PageHead, Panel, PrefRow, RowMenu, Stat, Switch, Tabs } from '../components/Admin'
import { I } from '../components/Icons'
import { useStore } from '../store'

const TABS = ['نظرة عامة', 'دورة الحضور', 'الموافقات', 'سجل الدورات']
const RANGES = ['اليوم', 'هذا الأسبوع', 'هذا الشهر', 'آخر 3 أشهر', 'فترة مخصصة']
const STATES = ['الكل', 'مكتمل', 'تأخير', 'نصف يوم', 'إجازة', 'بانتظار الموافقة']

const HOURS = [7.4, 8.1, 8.6, 6.2, 3.4, 8.2, 7.9, 8.4, 5.1, 8.8, 8.3, 4.6, 7.7, 8.5, 8.9, 6.8, 8.1, 7.2, 8.6, 9.1]
const DAYS = ['٣ أغسطس', '٥ أغسطس', '٨ أغسطس', '١٠ أغسطس', '١٢ أغسطس', '١٦ أغسطس', '١٨ أغسطس', '٢٠ أغسطس', '٢٣ أغسطس', '٢٦ أغسطس']
const MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
const WD = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت']
const ar = (v: string | number) => String(v).replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[+d])

const TEAMS = [
  { n: 'فريق المنتج', m: 1, p: 98, d: 'محتسب 171.7 س · منفى 6 س 20 د · 0 بدون تسجيل' },
  { n: 'فريق التصميم', m: 2, p: 93, d: 'محتسب 251.8 س · منفى 18 س 15 د · 0 إجازات' },
  { n: 'الإدارة', m: 3, p: 88, d: 'محتسب 136.7 س · منفى 7 س 20 د' },
]

type St = 'مكتمل' | 'تأخير' | 'إجازة' | 'بانتظار الموافقة' | 'نصف يوم'
type Row = { d: string; day: string; in: string; out: string; net: string; late: string; state: St; log?: [string, string][] }
const ROWS: Row[] = [
  { d: '٢٦ أغسطس', day: 'الثلاثاء', in: '08:59', out: '17:04', net: '8 س 5 د', late: '—', state: 'مكتمل', log: [['08:59', 'دخل المكتب'], ['10:15', 'انضم لقاعة الاجتماعات'], ['12:30', 'بدأ فترة راحة'], ['13:00', 'عاد من الراحة'], ['17:04', 'غادر المكتب']] },
  { d: '٢٥ أغسطس', day: 'الاثنين', in: '09:19', out: '17:06', net: '7 س 47 د', late: '19 د', state: 'تأخير', log: [['09:19', 'دخل المكتب — متأخر 19 د'], ['12:40', 'بدأ فترة راحة'], ['13:10', 'عاد من الراحة'], ['17:06', 'غادر المكتب']] },
  { d: '٢٤ أغسطس', day: 'الأحد', in: '08:55', out: '13:10', net: '4 س 15 د', late: '—', state: 'نصف يوم', log: [['08:55', 'دخل المكتب'], ['13:10', 'غادر المكتب — انصراف مبكر معتمد']] },
  { d: '٢١ أغسطس', day: 'الخميس', in: '—', out: '—', net: '—', late: '—', state: 'إجازة', log: [['—', 'إجازة معتمدة من المدير']] },
  { d: '٢٠ أغسطس', day: 'الأربعاء', in: '09:02', out: '17:40', net: '8 س 38 د', late: '2 د', state: 'بانتظار الموافقة', log: [['09:02', 'دخل المكتب'], ['17:40', 'غادر المكتب'], ['17:41', 'طلب احتساب وقت إضافي']] },
]

type Ap = { id: string; who: string; type: string; when: string; reason: string; state: 'معلّق' | 'مقبول' | 'مرفوض' }
const AP0: Ap[] = [
  { id: 'a1', who: 'محمد أمين', type: 'إذن تأخير', when: '٢٦ أغسطس · 30 دقيقة', reason: 'موعد طبي', state: 'معلّق' },
  { id: 'a2', who: 'داليا سمير', type: 'إجازة يوم', when: '٢٨ أغسطس', reason: 'ظرف عائلي', state: 'معلّق' },
  { id: 'a3', who: 'نور الشامي', type: 'انصراف مبكر', when: '٢٥ أغسطس · ساعة', reason: 'مشوار رسمي', state: 'مقبول' },
]

const ACTIONS = ['إذن تأخير', 'إجازة يوم', 'انصراف مبكر', 'تعديل يدوي']

/* ---------- سجل حضور الموظفين ---------- */
type Emp = { id: string; name: string; initial: string; title: string; team: string; shift: string; req: string; done: string; of: string; extra: string; brk: string; left: string; state: 'متبقي وقت' | 'مكتمل' | 'وقت إضافي' }
const EMPS: Emp[] = [
  { id: 'e1', name: 'أحمد هشيمة', initial: 'أه', title: 'Product Designer', team: 'فريق المنتج', shift: '09:00 — 17:00 · 8 س', req: '176 س', done: '171.7 س', of: 'من أصل 224 س', extra: '—', brk: '7 س 41 د', left: '4 س 20 د', state: 'متبقي وقت' },
  { id: 'e2', name: 'محمد أمين', initial: 'مأ', title: 'Frontend Developer', team: 'فريق التصميم', shift: '09:00 — 17:00 · 8 س', req: '176 س', done: '178.2 س', of: 'من أصل 224 س', extra: '2 س 12 د', brk: '6 س 05 د', left: '—', state: 'وقت إضافي' },
  { id: 'e3', name: 'داليا سمير', initial: 'دس', title: 'UX Designer', team: 'فريق التصميم', shift: '10:00 — 18:00 · 8 س', req: '176 س', done: '176 س', of: 'من أصل 224 س', extra: '—', brk: '7 س 10 د', left: '—', state: 'مكتمل' },
  { id: 'e4', name: 'نور الشامي', initial: 'نش', title: 'QA Engineer', team: '—', shift: '09:00 — 17:00 · 8 س', req: '176 س', done: '162.4 س', of: 'من أصل 224 س', extra: '—', brk: '8 س 02 د', left: '13 س 36 د', state: 'متبقي وقت' },
]

type DRow = { d: string; in: string; out: string; net: string; brk: string; kind: 'دوام' | 'إجازة' | 'نصف يوم'; late: string; sys: string; req: string; done: string; left: string; trips: number; away: string }
const DROWS: DRow[] = [
  { d: 'السبت ١ أغسطس', in: '09:19', out: '17:36', net: '8 س', brk: '17 / 30 د', kind: 'دوام', late: 'متأخر 19 د', sys: 'ساعات مرنة', req: '7 س', done: '6 س 17 د', left: '43 د', trips: 2, away: '17 د من رصيد 30 د' },
  { d: 'الأحد ٢ أغسطس', in: '09:19', out: '17:36', net: '8 س', brk: '17 / 30 د', kind: 'دوام', late: 'متأخر 19 د', sys: 'ساعات مرنة', req: '7 س', done: '6 س 17 د', left: '43 د', trips: 2, away: '17 د من رصيد 30 د' },
  { d: 'الاثنين ٣ أغسطس', in: '08:55', out: '17:02', net: '8 س 7 د', brk: '22 / 30 د', kind: 'دوام', late: '', sys: 'دوام ثابت', req: '8 س', done: '8 س 07 د', left: '—', trips: 1, away: '8 د من رصيد 30 د' },
  { d: 'الثلاثاء ٤ أغسطس', in: '—', out: '—', net: '—', brk: '—', kind: 'إجازة', late: '', sys: '—', req: '—', done: '—', left: '—', trips: 0, away: '—' },
  { d: 'الأربعاء ٥ أغسطس', in: '09:02', out: '13:10', net: '4 س 8 د', brk: '10 / 30 د', kind: 'نصف يوم', late: '', sys: 'ساعات مرنة', req: '4 س', done: '4 س 08 د', left: '—', trips: 1, away: '10 د من رصيد 30 د' },
]

/* ---------- تقويم مصغّر لاختيار الفترة ---------- */
function MiniCal({ y, m, from, to, onPick, onNav }: { y: number; m: number; from: string | null; to: string | null; onPick: (d: string) => void; onNav: (n: number) => void }) {
  const first = new Date(y, m, 1).getDay()
  const days = new Date(y, m + 1, 0).getDate()
  const iso = (d: number) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  return (
    <div className="cal">
      <div className="cal-head">
        <button className="btn btn-ghost btn-icon btn-sm" onClick={() => onNav(1)} aria-label="الشهر التالي"><I.ChevronL size={16} /></button>
        <b>{MONTHS[m]} {ar(y)}</b>
        <button className="btn btn-ghost btn-icon btn-sm" onClick={() => onNav(-1)} aria-label="الشهر السابق"><I.ChevronR size={16} /></button>
      </div>
      <div className="cal-grid">
        {WD.map(d => <span key={d} className="cal-wd">{d}</span>)}
        {Array.from({ length: first }).map((_, i) => <span key={'e' + i} />)}
        {Array.from({ length: days }, (_, i) => i + 1).map(d => {
          const v = iso(d)
          const edge = v === from || v === to
          const inside = !!from && !!to && v > from && v < to
          return <button key={d} className={`cal-day ${edge ? 'on' : ''} ${inside ? 'in' : ''}`} onClick={() => onPick(v)}>{ar(d)}</button>
        })}
      </div>
    </div>
  )
}

export default function Attendance() {
  const { toast } = useStore()
  const [tab, setTab] = useState(TABS[0])
  const [range, setRange] = useState('هذا الشهر')
  const [emp, setEmp] = useState('كل الموظفين')
  const [team, setTeam] = useState('كل الفرق')
  const [stFilter, setStFilter] = useState('الكل')
  const [day, setDay] = useState<Row | null>(null)
  const [close, setClose] = useState(false)
  const [picker, setPicker] = useState(false)
  const [cal, setCal] = useState({ y: 2026, m: 7 })
  const [from, setFrom] = useState<string | null>(null)
  const [to, setTo] = useState<string | null>(null)
  const [custom, setCustom] = useState<string | null>(null)
  const [settings, setSettings] = useState(false)
  const [cfg, setCfg] = useState({ start: '١ من كل شهر', grace: '١٥ دقيقة', overtime: true, autoAbsence: true })
  const [cfgErr, setCfgErr] = useState('')
  const [act, setAct] = useState<{ row: Row; type: string; time: string; reason: string } | null>(null)
  const [aps, setAps] = useState<Ap[]>(AP0)
  const [exp, setExp] = useState(false)
  const [empQ, setEmpQ] = useState('')
  const [openEmp, setOpenEmp] = useState<string | null>('e1')
  const [openDay, setOpenDay] = useState<string | null>(null)
  const expRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!exp) return
    const h = (e: MouseEvent) => { if (expRef.current && !expRef.current.contains(e.target as Node)) setExp(false) }
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h)
  }, [exp])

  const label = range === 'فترة مخصصة' && custom ? custom : range
  const rows = useMemo(() => ROWS.filter(r => stFilter === 'الكل' || r.state === stFilter), [stFilter])
  const empList = useMemo(() => EMPS.filter(e =>
    (team === 'كل الفرق' || e.team === team) && (emp === 'كل الموظفين' || e.name === emp) &&
    (!empQ || e.name.includes(empQ) || e.team.includes(empQ))), [team, emp, empQ])
  const pending = aps.filter(a => a.state === 'معلّق').length

  const pickDate = (v: string) => {
    if (!from || (from && to)) { setFrom(v); setTo(null) }
    else if (v < from) { setTo(from); setFrom(v) }
    else setTo(v)
  }
  const applyRange = () => {
    if (!from || !to) return
    const f = from.split('-'), t = to.split('-')
    setCustom(`${ar(+f[2])} ${MONTHS[+f[1] - 1]} — ${ar(+t[2])} ${MONTHS[+t[1] - 1]}`)
    setRange('فترة مخصصة'); setPicker(false)
    toast('تم تطبيق الفترة المخصصة', `${ar(+f[2])} ${MONTHS[+f[1] - 1]} — ${ar(+t[2])} ${MONTHS[+t[1] - 1]}`)
  }
  const decide = (a: Ap, ok: boolean) => {
    setAps(v => v.map(x => x.id === a.id ? { ...x, state: ok ? 'مقبول' : 'مرفوض' } : x))
    toast(ok ? 'تمت الموافقة' : 'تم الرفض', `${a.type} — ${a.who}`)
  }
  const submitAction = () => {
    if (!act) return
    setAps(v => [{ id: 'n' + v.length, who: 'أحمد هشيمة', type: act.type, when: `${act.row.d}${act.time ? ' · ' + act.time : ''}`, reason: act.reason || '—', state: 'معلّق' }, ...v])
    toast('تم إرسال الطلب', `${act.type} — ${act.row.d} · بانتظار موافقة المدير`)
    setAct(null)
  }

  return (
    <AdminLayout>
      <PageHead title="الحضور والانصراف" sub="تابع حضور الموظفين وساعات العمل والتقارير حسب الفريق والفترة الزمنية"
        actions={<>
          <div ref={expRef} style={{ position: 'relative' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setExp(o => !o)}><I.Card size={15} />تصدير التقرير<I.Chevron size={13} /></button>
            {exp && <div className="popover menu" style={{ top: 42, insetInlineEnd: 0, minWidth: 200, zIndex: 60 }}>
              {[['ملف CSV', 'جدول بيانات خام'], ['ملف PDF', 'تقرير جاهز للطباعة'], ['ملف Excel', 'مع معادلات الاحتساب']].map(([t, s]) =>
                <button key={t} className="menu-item" style={{ height: 42 }} onClick={() => { setExp(false); toast('جارٍ تجهيز ' + t, `${label} · ${team} · ${emp}`) }}>
                  <span><b style={{ display: 'block', fontSize: 12.5 }}>{t}</b><span className="caption" style={{ fontSize: 11 }}>{s}</span></span>
                </button>)}
            </div>}
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setTab(TABS[1])}><I.People size={15} />سجل الحضور</button>
        </>} />
      <Tabs items={TABS} value={tab} onChange={setTab} />

      {tab === TABS[0] && <>
        <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="tabbar" style={{ margin: 0, flex: '0 0 auto' }}>
            {RANGES.map(r => <button key={r} className={range === r ? 'on' : ''} onClick={() => r === 'فترة مخصصة' ? setPicker(true) : (setRange(r), setCustom(null))}>
              {r === 'فترة مخصصة' && custom && range === r ? custom : r}
            </button>)}
          </div>
          <div style={{ flex: 1 }} />
          <Filter label="الفريق" items={['كل الفرق', 'فريق المنتج', 'فريق التصميم', 'الإدارة']} value={team} onPick={setTeam} />
          <Filter label="الموظف" items={['كل الموظفين', 'أحمد هشيمة', 'محمد أمين', 'داليا سمير']} value={emp} onPick={setEmp} width={170} />
        </div>
        <div className="grid g4" style={{ marginBottom: 14 }}>
          <Stat icon={<I.Calendar size={18} />} n="686" unit="ساعة" t={`الساعات المطلوبة · ${label}`} />
          <Stat icon={<I.Clock size={18} />} n="648.4" unit="ساعة" t="الساعات المحتسبة" />
          <Stat icon={<I.Status size={18} />} n="7.1" unit="ساعة" t="متوسط ساعات العمل لكل يوم" />
          <Stat icon={<I.Info size={18} />} n="37.6" unit="ساعة" t="الوقت المنفي · 5 موظفين يحتاجون متابعة" />
        </div>
        <Panel title="ساعات العمل خلال الفترة" sub="الساعات المحتسبة مقابل المطلوبة" icon={<I.Calendar size={16} />}>
          <div className="bars">
            {HOURS.map((h, i) => <div className="col" key={i} title={`${h} ساعة`}>
              <div className="bar" style={{ height: `${(h / 9.5) * 100}%`, animationDelay: `${i * 25}ms` }} />
              {i % 2 === 0 && <span className="lbl">{DAYS[i / 2]}</span>}
            </div>)}
          </div>
        </Panel>
        <div style={{ height: 14 }} />
        <div className="grid g3">
          {TEAMS.filter(t => team === 'كل الفرق' || t.n === team).map(t => <Panel key={t.n} title={t.n} sub={`${t.m} أعضاء`} icon={<I.Group size={16} />}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}><span className="muted">إكمال الساعات</span><b>{t.p}%</b></div>
            <div className={`meter ${t.p < 95 ? 'amber' : ''}`}><i style={{ width: `${t.p}%` }} /></div>
            <p className="caption" style={{ marginTop: 8 }}>{t.d}</p>
          </Panel>)}
        </div>
      </>}

      {tab === TABS[1] && <>
        <Panel title="دورة الحضور الحالية" sub="١ أغسطس — ٢٦ أغسطس 2026 · دورة شهرية" icon={<I.Clock size={16} />}
          actions={<div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary btn-sm" onClick={() => { setCfgErr(''); setSettings(true) }}>إعدادات الدورة</button>
            <button className="btn btn-primary btn-sm" onClick={() => setClose(true)}>إغلاق الدورة</button>
          </div>}>
          <div className="grid g4" style={{ marginBottom: 14 }}>
            <Stat icon={<I.Calendar size={18} />} n="26" unit="يوم" t="أيام الدورة" />
            <Stat icon={<I.Check size={18} />} n="21" unit="يوم" t="أيام مكتملة" />
            <Stat icon={<I.Info size={18} />} n="3" unit="أيام" t="تحتاج مراجعة" />
            <Stat icon={<I.Clock size={18} />} n={String(pending)} unit="طلبات" t="بانتظار الموافقة" />
          </div>
        </Panel>
      </>}

      {(tab === TABS[0] || tab === TABS[1]) && <>
        <div style={{ height: 14 }} />

        <Panel title="سجل الحضور" sub={`${team} — اضغط على أي موظف لعرض سجله التفصيلي.`} icon={<I.People size={16} />}
          actions={<div className="field" style={{ width: 260, height: 36, margin: 0 }}>
            <I.Search size={16} style={{ color: 'var(--text-3)' }} />
            <input placeholder="ابحث باسم الموظف أو الفريق…" value={empQ} onChange={e => setEmpQ(e.target.value)} />
          </div>}>
          {empList.length ? <table className="tbl">
            <thead><tr><th>الموظف</th><th>الفريق</th><th>الدوام المقرر</th><th>المطلوبة</th><th>المحتسبة</th><th>الإضافي</th><th>الراحة المستخدمة</th><th>المتبقي</th><th>الحالة</th><th /></tr></thead>
            <tbody>
              {empList.map((e, i) => <Fragment key={e.id}>
                <tr className="row-in" style={{ animationDelay: `${i * 30}ms`, cursor: 'pointer' }} onClick={() => { setOpenEmp(o => o === e.id ? null : e.id); setOpenDay(null) }}>
                  <td><div className="cell-user"><span className="avatar sm teal">{e.initial}</span><span><b>{e.name}</b><span dir="ltr">{e.title}</span></span></div></td>
                  <td className="muted">{e.team}</td>
                  <td dir="ltr" style={{ textAlign: 'right' }}>{e.shift}</td>
                  <td>{e.req}</td>
                  <td><b>{e.done}</b><div className="caption">{e.of}</div></td>
                  <td className="muted">{e.extra}</td>
                  <td>{e.brk}</td>
                  <td>{e.left}</td>
                  <td><span className={`pill ${e.state === 'مكتمل' ? 'green' : e.state === 'وقت إضافي' ? 'teal' : 'amber'}`}>{e.state}</span></td>
                  <td><I.Chevron size={14} className={openEmp === e.id ? 'rot' : ''} /></td>
                </tr>
                {openEmp === e.id && <tr className="sub-row" onClick={ev => ev.stopPropagation()}><td colSpan={10}>
                  <div className="emp-log">
                    <div className="emp-log-head">
                      <b>سجل {e.name} — ١ أغسطس — ٢٦ أغسطس 2026</b>
                      <span className="caption">اضغط على أي يوم لعرض السجل الزمني، أو استخدم «إجراء» لتسجيل إجازة أو إذن أو تعديل يدوي للوقت.</span>
                    </div>
                    <table className="tbl">
                      <thead><tr><th>اليوم</th><th>الحضور</th><th>الانصراف</th><th>المحتسب</th><th>الراحة</th><th>الحالة</th><th>إجراء</th></tr></thead>
                      <tbody>
                        {DROWS.filter(d => stFilter === 'الكل' || (stFilter === 'تأخير' ? !!d.late : stFilter === d.kind || (stFilter === 'مكتمل' && d.kind === 'دوام' && !d.late))).map(d => <Fragment key={d.d}>
                          <tr style={{ cursor: 'pointer' }} onClick={() => setOpenDay(o => o === e.id + d.d ? null : e.id + d.d)}>
                            <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><I.Chevron size={13} className={openDay === e.id + d.d ? 'rot' : ''} />{d.d}</span></td>
                            <td dir="ltr" style={{ textAlign: 'right' }}>{d.in}</td>
                            <td dir="ltr" style={{ textAlign: 'right' }}>{d.out}</td>
                            <td>{d.net}</td>
                            <td className="muted" dir="ltr" style={{ textAlign: 'right' }}>{d.brk}</td>
                            <td><span style={{ display: 'inline-flex', gap: 6 }}>
                              <span className={`pill ${d.kind === 'إجازة' ? 'purple' : d.kind === 'نصف يوم' ? 'teal' : 'green'}`}>{d.kind}</span>
                              {d.late && <span className="pill amber">{d.late}</span>}
                            </span></td>
                            <td onClick={ev => ev.stopPropagation()}><RowMenu items={[
                              { label: 'تسجيل إجازة', onClick: () => setAct({ row: { ...ROWS[0], d: d.d, day: e.name }, type: 'إجازة يوم', time: '', reason: '' }) },
                              { label: 'إذن تأخير', onClick: () => setAct({ row: { ...ROWS[0], d: d.d, day: e.name }, type: 'إذن تأخير', time: '٣٠ دقيقة', reason: '' }) },
                              { label: 'تعديل يدوي للوقت', onClick: () => setAct({ row: { ...ROWS[0], d: d.d, day: e.name }, type: 'تعديل يدوي', time: d.in, reason: '' }) },
                            ]} /></td>
                          </tr>
                          {openDay === e.id + d.d && <tr className="sub-row"><td colSpan={7}>
                            <div className="day-detail">
                              <div className="dd-head">
                                <b>تفاصيل الحضور لليوم</b>
                                <span className="pill teal" dir="ltr">{d.in} — {d.out}</span>
                                <span style={{ flex: 1 }} />
                                <span className="caption">وقت «بعيد» {d.away}</span>
                                <span className="pill amber">خرج ورجع {ar(d.trips)} مرات</span>
                              </div>
                              <div className="grid g4" style={{ gap: 10 }}>
                                {[['نظام الدوام', d.sys, ''], ['الساعات المطلوبة اليوم', d.req, ''], ['الساعات المحتسبة', d.done, ''], ['المتبقي', d.left, 'var(--amber)']].map(([k, v, c]) =>
                                  <div className="dd-cell" key={k}><span className="caption">{k}</span><b style={c ? { color: c } : undefined}>{v}</b></div>)}
                              </div>
                            </div>
                          </td></tr>}
                        </Fragment>)}
                      </tbody>
                    </table>
                  </div>
                </td></tr>}
              </Fragment>)}
            </tbody>
          </table> : <Empty title="لا يوجد موظف مطابق" sub={`لا نتائج لـ «${empQ}».`} action={<button className="btn btn-secondary btn-sm" onClick={() => setEmpQ('')}>مسح البحث</button>} />}
        </Panel>

      </>}

      {tab === TABS[1] && <>
        <div style={{ height: 14 }} />
        <Panel title="سجلي" sub="أيام الدورة الحالية لحسابك" icon={<I.Clock size={16} />}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
            {STATES.map(s => <button key={s} className={`chip ${stFilter === s ? 'on' : ''}`} onClick={() => setStFilter(s)}>{s}</button>)}
          </div>
          {rows.length ? <table className="tbl">
            <thead><tr><th>اليوم</th><th>الحضور</th><th>الانصراف</th><th>الصافي</th><th>التأخير</th><th>الحالة</th><th /></tr></thead>
            <tbody>
              {rows.map((r, i) => <tr key={r.d} className="row-in" style={{ animationDelay: `${i * 30}ms`, cursor: 'pointer' }} onClick={() => setDay(r)}>
                <td><b>{r.d}</b> <span className="muted">· {r.day}</span></td>
                <td dir="ltr" style={{ textAlign: 'right' }}>{r.in}</td>
                <td dir="ltr" style={{ textAlign: 'right' }}>{r.out}</td>
                <td>{r.net}</td>
                <td>{r.late !== '—' ? <span className="pill amber">{r.late}</span> : <span className="muted">—</span>}</td>
                <td><span className={`pill ${r.state === 'مكتمل' ? 'green' : r.state === 'إجازة' ? 'purple' : r.state === 'نصف يوم' ? 'teal' : 'amber'}`}>{r.state}</span></td>
                <td onClick={e => e.stopPropagation()}><RowMenu items={[
                  { label: 'تفاصيل اليوم', onClick: () => setDay(r) },
                  { label: 'إضافة إذن تأخير', onClick: () => setAct({ row: r, type: 'إذن تأخير', time: '٣٠ دقيقة', reason: '' }) },
                  { label: 'تسجيل إجازة', onClick: () => setAct({ row: r, type: 'إجازة يوم', time: '', reason: '' }) },
                  { label: 'تعديل يدوي', onClick: () => setAct({ row: r, type: 'تعديل يدوي', time: r.in, reason: '' }) },
                ]} /></td>
              </tr>)}
            </tbody>
          </table> : <Empty title="لا توجد أيام بهذه الحالة" sub={`لا يوجد يوم بحالة «${stFilter}» في هذه الدورة.`} action={<button className="btn btn-secondary btn-sm" onClick={() => setStFilter('الكل')}>عرض كل الأيام</button>} />}
        </Panel>
      </>}

      {tab === TABS[2] && <Panel title="الموافقات" sub={pending ? `${ar(pending)} طلبات بانتظار قرارك` : 'لا توجد طلبات معلّقة'} icon={<I.Check size={16} />}>
        {aps.length ? <table className="tbl">
          <thead><tr><th>الموظف</th><th>النوع</th><th>التاريخ</th><th>السبب</th><th>الحالة</th><th /></tr></thead>
          <tbody>{aps.map((a, i) => <tr key={a.id} className="row-in" style={{ animationDelay: `${i * 30}ms` }}>
            <td><div className="cell-user"><span className="avatar sm dark">{a.who[0]}</span><b>{a.who}</b></div></td>
            <td>{a.type}</td><td className="muted">{a.when}</td><td className="muted">{a.reason}</td>
            <td><span className={`pill ${a.state === 'مقبول' ? 'green' : a.state === 'مرفوض' ? 'red' : 'amber'}`}>{a.state}</span></td>
            <td>{a.state === 'معلّق' ? <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn btn-primary btn-sm" onClick={() => decide(a, true)}>موافقة</button>
              <button className="btn btn-secondary btn-sm" onClick={() => decide(a, false)}>رفض</button>
            </div> : <span className="muted">—</span>}</td>
          </tr>)}</tbody>
        </table> : <Empty title="لا توجد طلبات" sub="كل الطلبات تمت معالجتها." />}
      </Panel>}

      {tab === TABS[3] && <Panel title="سجل الدورات" sub="الدورات المغلقة وتقاريرها" icon={<I.Clock size={16} />}>
        <table className="tbl">
          <thead><tr><th>الدورة</th><th>المدة</th><th>الساعات المحتسبة</th><th>الحالة</th><th /></tr></thead>
          <tbody>
            {[['يوليو 2026', '١ — ٣١ يوليو', '712.4 ساعة'], ['يونيو 2026', '١ — ٣٠ يونيو', '688.1 ساعة'], ['مايو 2026', '١ — ٣١ مايو', '701.9 ساعة']].map(([c, d, h], i) =>
              <tr key={c} className="row-in" style={{ animationDelay: `${i * 30}ms` }}>
                <td><b>{c}</b></td><td className="muted">{d}</td><td>{h}</td>
                <td><span className="pill green">مغلقة</span></td>
                <td><button className="btn btn-secondary btn-sm" onClick={() => toast('تقرير الدورة', c)}>عرض التقرير</button></td>
              </tr>)}
          </tbody>
        </table>
      </Panel>}

      {/* الفترة المخصصة */}
      {picker && (
        <div className="scrim" onMouseDown={e => { if (e.target === e.currentTarget) setPicker(false) }}>
          <div className="modal" style={{ width: 420 }}>
            <div className="modal-header"><span className="tile"><I.Calendar size={20} /></span>
              <div><div className="modal-title">فترة مخصصة</div><div className="modal-sub">{!from ? 'اختر تاريخ البداية' : !to ? 'اختر تاريخ النهاية' : 'الفترة جاهزة للتطبيق'}</div></div>
              <button className="btn btn-ghost btn-icon close" onClick={() => setPicker(false)}><I.Close size={18} /></button></div>
            <div className="divider" />
            <MiniCal y={cal.y} m={cal.m} from={from} to={to} onPick={pickDate}
              onNav={n => setCal(c => { const m = c.m + n; return m < 0 ? { y: c.y - 1, m: 11 } : m > 11 ? { y: c.y + 1, m: 0 } : { y: c.y, m } })} />
            <div className="card" style={{ padding: '0 14px', marginTop: 12 }}>
              <div className="detail-row"><span>من</span><b dir="ltr">{from ?? '—'}</b></div>
              <div className="detail-row"><span>إلى</span><b dir="ltr">{to ?? '—'}</b></div>
            </div>
            <div className="divider" />
            <div className="modal-footer">
              <button className="btn btn-primary" disabled={!from || !to} onClick={applyRange}>تطبيق الفترة</button>
              <button className="btn btn-secondary" onClick={() => { setFrom(null); setTo(null) }}>مسح</button>
              <button className="btn btn-ghost" onClick={() => setPicker(false)}>إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* إعدادات الدورة */}
      {settings && (
        <div className="scrim" onMouseDown={e => { if (e.target === e.currentTarget) setSettings(false) }}>
          <div className="modal" style={{ width: 480 }}>
            <div className="modal-header"><span className="tile"><I.Settings size={20} /></span>
              <div><div className="modal-title">إعدادات دورة الحضور</div><div className="modal-sub">بداية الدورة وسياسة الاحتساب والوقت الإضافي</div></div>
              <button className="btn btn-ghost btn-icon close" onClick={() => setSettings(false)}><I.Close size={18} /></button></div>
            <div className="divider" />
            {cfgErr && <div className="banner error" style={{ marginBottom: 12 }}><I.Info size={16} />{cfgErr}</div>}
            <div className="form" style={{ marginTop: 0 }}>
              <div className="row"><label className="label">بداية الدورة</label>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {['١ من كل شهر', '١٥ من كل شهر', 'أول أحد من الشهر'].map(x =>
                    <button key={x} className={`chip ${cfg.start === x ? 'on' : ''}`} onClick={() => setCfg(c => ({ ...c, start: x }))}>{x}</button>)}
                </div>
              </div>
              <div className="row"><label className="label">مهلة التأخير المسموحة</label>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {['بدون مهلة', '١٠ دقائق', '١٥ دقيقة', '٣٠ دقيقة'].map(x =>
                    <button key={x} className={`chip ${cfg.grace === x ? 'on' : ''}`} onClick={() => setCfg(c => ({ ...c, grace: x }))}>{x}</button>)}
                </div>
              </div>
              <PrefRow title="احتساب الوقت الإضافي" sub="إضافة الساعات بعد نهاية الدوام إلى الرصيد"><Switch on={cfg.overtime} onChange={v => setCfg(c => ({ ...c, overtime: v }))} /></PrefRow>
              <PrefRow title="الغياب التلقائي" sub="تسجيل الموظف غائبًا إذا لم يدخل خلال ساعتين"><Switch on={cfg.autoAbsence} onChange={v => setCfg(c => ({ ...c, autoAbsence: v }))} /></PrefRow>
            </div>
            <div className="divider" />
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => {
                if (cfg.start === '١٥ من كل شهر' && cfg.grace === 'بدون مهلة') { setCfgErr('تعارض: بداية الدورة في منتصف الشهر تحتاج مهلة تأخير لتفادي تداخل الدورات.'); return }
                setSettings(false); toast('تم حفظ إعدادات الدورة', `${cfg.start} · مهلة ${cfg.grace}`)
              }}>حفظ الإعدادات</button>
              <button className="btn btn-secondary" onClick={() => setSettings(false)}>إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* إجراء على يوم */}
      {act && (
        <div className="scrim" onMouseDown={e => { if (e.target === e.currentTarget) setAct(null) }}>
          <div className="modal" style={{ width: 460 }}>
            <div className="modal-header"><span className="tile"><I.Clock size={20} /></span>
              <div><div className="modal-title">إجراء على يوم {act.row.d}</div><div className="modal-sub">{act.row.day} · سيُسجَّل الإجراء باسمك ويحتاج موافقة</div></div>
              <button className="btn btn-ghost btn-icon close" onClick={() => setAct(null)}><I.Close size={18} /></button></div>
            <div className="divider" />
            <div className="label" style={{ marginBottom: 8 }}>نوع الإجراء</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
              {ACTIONS.map(x => <button key={x} className={`chip ${act.type === x ? 'on' : ''}`} onClick={() => setAct(a => a && ({ ...a, type: x }))}>{x}</button>)}
            </div>
            {act.type !== 'إجازة يوم' && <div className="form" style={{ marginTop: 0 }}>
              <div className="row"><label className="label">{act.type === 'تعديل يدوي' ? 'وقت الحضور الصحيح' : 'المدة'}</label>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {(act.type === 'تعديل يدوي' ? ['08:30', '08:45', '09:00', '09:15'] : ['١٥ دقيقة', '٣٠ دقيقة', 'ساعة', 'ساعتان']).map(x =>
                    <button key={x} className={`chip ${act.time === x ? 'on' : ''}`} dir={act.type === 'تعديل يدوي' ? 'ltr' : undefined} onClick={() => setAct(a => a && ({ ...a, time: x }))}>{x}</button>)}
                </div>
              </div>
            </div>}
            <div className="row" style={{ marginTop: 12 }}><label className="label">السبب</label>
              <div className="field"><input placeholder="مثال: موعد طبي" value={act.reason} onChange={e => setAct(a => a && ({ ...a, reason: e.target.value }))} autoFocus /></div>
            </div>
            <div className="divider" />
            <div className="modal-footer">
              <button className="btn btn-primary" disabled={!act.reason.trim()} onClick={submitAction}>إرسال الطلب</button>
              <button className="btn btn-secondary" onClick={() => setAct(null)}>إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* تفاصيل اليوم */}
      {day && (
        <div className="scrim" onMouseDown={e => { if (e.target === e.currentTarget) setDay(null) }}>
          <div className="modal" style={{ width: 560 }}>
            <div className="modal-header"><span className="tile"><I.Clock size={20} /></span><div><div className="modal-title">تفاصيل يوم {day.d}</div><div className="modal-sub">{day.day} · دوام 8 ساعات — من ٩:٠٠ ص إلى ٥:٠٠ م</div></div><button className="btn btn-ghost btn-icon close" onClick={() => setDay(null)}><I.Close size={18} /></button></div>
            <div className="divider" />
            <div className="grid g3" style={{ marginBottom: 12 }}>
              <div className="card stat" style={{ padding: 12 }}><div><div className="n" style={{ fontSize: 16 }}>{day.in}</div><div className="t">الحضور</div></div></div>
              <div className="card stat" style={{ padding: 12 }}><div><div className="n" style={{ fontSize: 16 }}>{day.out}</div><div className="t">الانصراف</div></div></div>
              <div className="card stat" style={{ padding: 12 }}><div><div className="n" style={{ fontSize: 16 }}>{day.net}</div><div className="t">الصافي</div></div></div>
            </div>
            <div className="card" style={{ padding: '0 14px' }}>
              {[['أول دخول للمكتب', day.in], ['آخر خروج', day.out], ['فترات الراحة', '30 دقيقة'], ['الوقت المنفي', day.late], ['الحالة', day.state]].map(([k, v]) =>
                <div className="detail-row" key={k as string}><span>{k}</span><b>{v}</b></div>)}
            </div>
            <div className="label" style={{ margin: '14px 0 8px' }}>سجل اليوم الكامل</div>
            <div className="card" style={{ padding: '10px 14px' }}>
              {(day.log ?? []).map(([t, e], i) => <div key={i} className="log-row">
                <span className="log-dot" /><b dir="ltr">{t}</b><span className="muted">{e}</span>
              </div>)}
            </div>
            <div className="divider" />
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => { setAct({ row: day, type: 'تعديل يدوي', time: day.in, reason: '' }); setDay(null) }}>تعديل يدوي</button>
              <button className="btn btn-secondary" onClick={() => setDay(null)}>إغلاق</button>
            </div>
          </div>
        </div>
      )}

      {close && <Confirm title="إغلاق دورة الحضور؟" body={pending ? `يوجد ${ar(pending)} طلبات معلّقة — إغلاق الدورة سيرفضها تلقائيًا.` : 'بعد الإغلاق لن يمكن تعديل سجلات الدورة، وسيُنشأ تقرير نهائي لها.'} confirmLabel="نعم، إغلاق الدورة"
        onConfirm={() => { setClose(false); toast('تم إغلاق الدورة', 'تم إنشاء تقرير أغسطس 2026.') }} onClose={() => setClose(false)} />}
    </AdminLayout>
  )
}

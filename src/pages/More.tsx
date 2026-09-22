import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AdminLayout, PageHead, Panel, PrefRow, Stat, Switch, Tabs } from '../components/Admin'
import { I } from '../components/Icons'
import { useStore } from '../store'

/* ================= إنشاء طابق جديد ================= */
const SOURCES = [
  { id: 'blank', t: 'طابق فارغ', d: 'ابدأ من مساحة فارغة ورتّبها بنفسك', icon: <I.Plus size={22} /> },
  { id: 'template', t: 'من قالب جاهز', d: 'اختر تصميمًا جاهزًا وعدّل عليه', icon: <I.Rooms size={22} /> },
  { id: 'copy', t: 'نسخ طابق موجود', d: 'ابدأ بنسخة من طابق حالي', icon: <I.Copy size={22} /> },
]
const TEMPLATES = ['مكتب مفتوح + قاعة اجتماعات', 'ستوديو تصميم', 'مركز دعم', 'مساحة هجينة']

export function CreateFloor() {
  const nav = useNavigate()
  const { toast } = useStore()
  const [step, setStep] = useState(1)
  const [src, setSrc] = useState<string | null>(null)
  const [tpl, setTpl] = useState(TEMPLATES[0])
  const [copyFrom, setCopyFrom] = useState('الطابق الأول')
  const [name, setName] = useState('')
  const [size, setSize] = useState('متوسط · 12 مكتب')
  const [state, setState] = useState<'idle' | 'run' | 'done'>('idle')

  return (
    <div className="ws-page">
      <div className="ws-top">
        <img src="./assets/logo.svg" alt="مكتبي" style={{ width: 110 }} />
        <button className="btn btn-ghost btn-sm" onClick={() => nav('/floor')}>إلغاء</button>
      </div>
      <div className="ws-body" style={{ maxWidth: 820 }}>
        <div className="steps" style={{ marginBottom: 20 }}>
          {['المصدر', 'التفاصيل', 'المراجعة'].map((s, i) => <span key={s} className={`step ${step === i + 1 ? 'on' : step > i + 1 ? 'done' : ''}`}>{['٠١','٠٢','٠٣','٠٤'][i]} · {s}</span>)}
        </div>

        {step === 1 && <>
          <h1 style={{ fontSize: 24 }}>كيف تريد إنشاء الطابق؟</h1>
          <p className="muted" style={{ marginTop: 6 }}>اختر نقطة البداية، ويمكنك تعديل كل شيء لاحقًا من المحرر.</p>
          <div className="grid g3" style={{ marginTop: 20 }}>
            {SOURCES.map(o => <button key={o.id} className={`card panel card-in ${src === o.id ? 'plan-card on' : ''}`} style={{ textAlign: 'start' }} onClick={() => setSrc(o.id)}>
              <span className="avatar teal" style={{ borderRadius: 14 }}>{o.icon}</span>
              <h3 style={{ fontSize: 14.5, fontWeight: 700, marginTop: 12 }}>{o.t}</h3>
              <p className="caption" style={{ marginTop: 4 }}>{o.d}</p>
            </button>)}
          </div>
          {src === 'template' && <Panel title="اختر قالبًا" className="card-in" icon={<I.Rooms size={16} />}>
            <div className="opt-list">{TEMPLATES.map(t => <button key={t} className={`opt ${tpl === t ? 'on' : ''}`} onClick={() => setTpl(t)}>{t}{tpl === t && <I.Check size={16} />}</button>)}</div>
          </Panel>}
          {src === 'copy' && <Panel title="اختر الطابق المصدر" className="card-in" icon={<I.Layers size={16} />}>
            <div className="opt-list">{['الطابق الأول', 'الطابق الثاني'].map(t => <button key={t} className={`opt ${copyFrom === t ? 'on' : ''}`} onClick={() => setCopyFrom(t)}>{t}{copyFrom === t && <I.Check size={16} />}</button>)}</div>
          </Panel>}
          <button className="btn btn-primary" style={{ marginTop: 20 }} disabled={!src} onClick={() => setStep(2)}>التالي</button>
        </>}

        {step === 2 && <>
          <h1 style={{ fontSize: 24 }}>تفاصيل الطابق</h1>
          <div className="card card-in" style={{ padding: 20, marginTop: 18 }}>
            <div className="form" style={{ marginTop: 0 }}>
              <div className="row"><label className="label">اسم الطابق</label><div className="field"><input value={name} onChange={e => setName(e.target.value)} placeholder="مثال: الطابق الثالث" autoFocus /></div></div>
              <div className="row"><label className="label">حجم الطابق</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  {['صغير · 6 مكاتب', 'متوسط · 12 مكتب', 'كبير · 24 مكتب'].map(x => <button key={x} className={`chip ${size === x ? 'on' : ''}`} style={{ height: 40, justifyContent: 'center' }} onClick={() => setSize(x)}>{x}</button>)}
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
            <button className="btn btn-primary" disabled={!name.trim()} onClick={() => setStep(3)}>التالي</button>
            <button className="btn btn-secondary" onClick={() => setStep(1)}>السابق</button>
          </div>
        </>}

        {step === 3 && <>
          <h1 style={{ fontSize: 24 }}>مراجعة وإنشاء</h1>
          <div className="card card-in" style={{ padding: '0 18px', marginTop: 18 }}>
            <div className="detail-row"><span>اسم الطابق</span><b>{name}</b></div>
            <div className="detail-row"><span>طريقة الإنشاء</span><b>{SOURCES.find(s => s.id === src)?.t}</b></div>
            {src === 'template' && <div className="detail-row"><span>القالب</span><b>{tpl}</b></div>}
            {src === 'copy' && <div className="detail-row"><span>منسوخ من</span><b>{copyFrom}</b></div>}
            <div className="detail-row"><span>الحجم</span><b>{size}</b></div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
            <button className="btn btn-primary" onClick={() => { setState('run'); setTimeout(() => setState('done'), 1400) }}>إنشاء الطابق</button>
            <button className="btn btn-secondary" onClick={() => setStep(2)}>السابق</button>
          </div>
        </>}
      </div>
      {state === 'run' && <div className="scrim"><div className="modal" style={{ width: 380 }}><div className="result"><div className="ok"><span className="spinner dark" style={{ width: 26, height: 26 }} /></div><h3>جارٍ إنشاء الطابق…</h3><p>نجهّز المساحات والمكاتب.</p></div></div></div>}
      {state === 'done' && <div className="scrim"><div className="modal" style={{ width: 420 }}><div className="result"><div className="ok"><I.Check size={26} /></div><h3>تم إنشاء «{name}»</h3><p>يمكنك الآن ترتيب الأثاث ونشر الطابق لفريقك.</p></div>
        <div className="modal-footer" style={{ justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={() => { toast('تم إنشاء الطابق', name); nav('/editor') }}>فتح المحرر</button>
          <button className="btn btn-secondary" onClick={() => nav('/floor')}>لاحقًا</button>
        </div></div></div>}
    </div>
  )
}

/* ================= السبورة ================= */
type Card = { id: string; x: number; y: number; t: string; c: string }
const COLORS = ['#fef3c7', '#dcfce7', '#e0e7ff', '#fee2e2', '#ffffff']
export function Whiteboard() {
  const nav = useNavigate()
  const { toast } = useStore()
  const [cards, setCards] = useState<Card[]>([
    { id: 'c1', x: 60, y: 60, t: 'هدف الربع: إطلاق النسخة التجريبية', c: COLORS[0] },
    { id: 'c2', x: 300, y: 120, t: 'تبسيط فلو الدعوة إلى 3 خطوات', c: COLORS[1] },
    { id: 'c3', x: 120, y: 260, t: 'قياس زمن دخول العضو الجديد', c: COLORS[2] },
  ])
  const [sel, setSel] = useState<string | null>(null)
  const [drag, setDrag] = useState<{ id: string; dx: number; dy: number } | null>(null)

  const add = () => { const id = 'c' + Date.now(); setCards(c => [...c, { id, x: 200 + Math.random() * 200, y: 180 + Math.random() * 120, t: 'بطاقة جديدة', c: COLORS[4] }]); setSel(id) }
  return (
    <div className="wb" onMouseUp={() => setDrag(null)} onMouseMove={e => { if (drag) setCards(cs => cs.map(c => c.id === drag.id ? { ...c, x: c.x + e.movementX, y: c.y + e.movementY } : c)) }}>
      <div className="wb-top">
        <button className="btn btn-secondary btn-sm" onClick={() => nav('/floor')}><I.ChevronR size={15} />رجوع للمكتب</button>
        <b style={{ fontSize: 14 }}>سبورة الفريق · الطابق الأول</b>
        <span className="pill teal">3 يشاهدون الآن</span>
        <div style={{ flex: 1 }} />
        {sel && <>
          {COLORS.map(c => <button key={c} className="btn btn-icon btn-sm" style={{ background: c, border: '1px solid var(--border)' }} onClick={() => setCards(cs => cs.map(x => x.id === sel ? { ...x, c } : x))} />)}
          <button className="btn btn-secondary btn-sm" style={{ color: 'var(--red)' }} onClick={() => { setCards(cs => cs.filter(c => c.id !== sel)); setSel(null) }}>حذف البطاقة</button>
        </>}
        <button className="btn btn-primary btn-sm" onClick={add}><I.Plus size={15} />بطاقة جديدة</button>
        <button className="btn btn-secondary btn-sm" onClick={() => toast('تم حفظ السبورة')}>حفظ</button>
      </div>
      <div className="wb-canvas" onMouseDown={() => setSel(null)}>
        {cards.map(c => (
          <div key={c.id} className={`wb-card ${sel === c.id ? 'sel' : ''}`} style={{ left: c.x, top: c.y, background: c.c }}
            onMouseDown={e => { e.stopPropagation(); setSel(c.id); setDrag({ id: c.id, dx: e.clientX, dy: e.clientY }) }}>
            <div contentEditable suppressContentEditableWarning onBlur={e => setCards(cs => cs.map(x => x.id === c.id ? { ...x, t: e.currentTarget.textContent || '' } : x))} style={{ outline: 'none' }}>{c.t}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ================= ملف الموظف 360 ================= */
const TABS360 = ['نظرة عامة', 'معلومات العمل', 'المستندات', 'الحضور', 'الصلاحيات']
export function Employee() {
  const { id } = useParams()
  const nav = useNavigate()
  const { toast } = useStore()
  const [tab, setTab] = useState(TABS360[0])
  const [editing, setEditing] = useState(false)
  const [f, setF] = useState({ title: 'Frontend Developer', team: 'فريق التصميم', role: 'موظف', join: '12 فبراير 2026', phone: '+966 5• ••• ••••' })
  const person = { name: 'محمد أمين السبعي', email: 'mohamed@company.com', initial: 'م' }

  return (
    <AdminLayout>
      <button className="back-link" onClick={() => nav('/admin/members')}><I.ChevronR size={14} />رجوع إلى الأعضاء</button>
      <Panel className="card-in">
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <span className="avatar purple" style={{ width: 60, height: 60, fontSize: 20 }}>{person.initial}</span>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>{person.name}</h2>
            <p className="caption">{f.title} · {f.team}</p>
            <p className="caption" dir="ltr" style={{ textAlign: 'right' }}>{person.email}</p>
          </div>
          <span className="pill green"><i className="dot green" />متاح</span>
          <button className="btn btn-secondary btn-sm" onClick={() => { setTab('معلومات العمل'); setEditing(true) }}><I.Edit size={15} />تعديل</button>
        </div>
      </Panel>
      <div style={{ height: 14 }} />
      <Tabs items={TABS360} value={tab} onChange={setTab} />

      {tab === TABS360[0] && <>
        <div className="grid g4" style={{ marginBottom: 14 }}>
          <Stat icon={<I.Clock size={18} />} n="7.8" unit="ساعة" t="متوسط اليوم" />
          <Stat icon={<I.Calendar size={18} />} n="21" unit="يوم" t="أيام الحضور" />
          <Stat icon={<I.Info size={18} />} n="2" unit="مرات" t="التأخير هذا الشهر" />
          <Stat icon={<I.Check size={18} />} n="98" unit="%" t="نسبة الالتزام" />
        </div>
        <div className="grid g2">
          <Panel title="النشاط الأخير" icon={<I.Clock size={16} />}>
            {[['دخل المكتب', 'اليوم 08:59'], ['انضم لقاعة الاجتماعات', 'اليوم 10:15'], ['طلب إذن تأخير', 'أمس'], ['حدّث ملفه الشخصي', 'قبل 3 أيام']].map(([a, t]) =>
              <div className="detail-row" key={a}><span>{a}</span><b className="muted">{t}</b></div>)}
          </Panel>
          <Panel title="الفرق والعضويات" icon={<I.Group size={16} />}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}><span className="pill purple">فريق التصميم</span><span className="pill">قناة عام</span><span className="pill">قناة الإعلانات</span></div>
          </Panel>
        </div>
      </>}

      {tab === TABS360[1] && <Panel title="معلومات العمل" icon={<I.Building size={16} />} actions={!editing && <button className="btn btn-secondary btn-sm" onClick={() => setEditing(true)}>تعديل</button>}>
        {!editing ? <div className="card" style={{ padding: '0 14px' }}>
          <div className="detail-row"><span>المسمى الوظيفي</span><b>{f.title}</b></div>
          <div className="detail-row"><span>الفريق</span><b>{f.team}</b></div>
          <div className="detail-row"><span>الدور</span><b>{f.role}</b></div>
          <div className="detail-row"><span>تاريخ الانضمام</span><b>{f.join}</b></div>
          <div className="detail-row"><span>الجوال</span><b dir="ltr">{f.phone}</b></div>
        </div> : <>
          <div className="form" style={{ marginTop: 0 }}>
            <div className="grid g2">
              <div className="row"><label className="label">المسمى الوظيفي</label><div className="field"><input value={f.title} onChange={e => setF({ ...f, title: e.target.value })} /></div></div>
              <div className="row"><label className="label">الفريق</label><div className="field"><input value={f.team} onChange={e => setF({ ...f, team: e.target.value })} /></div></div>
              <div className="row"><label className="label">الدور</label><div className="field"><input value={f.role} onChange={e => setF({ ...f, role: e.target.value })} /></div></div>
              <div className="row"><label className="label">الجوال</label><div className="field"><input dir="ltr" style={{ textAlign: 'right' }} value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} /></div></div>
            </div>
          </div>
          <div className="savebar"><I.Info size={18} style={{ color: 'var(--amber)' }} /><span style={{ flex: 1, fontSize: 13 }}>لديك تغييرات غير محفوظة.</span>
            <button className="btn btn-secondary btn-sm" onClick={() => setEditing(false)}>تجاهل</button>
            <button className="btn btn-primary btn-sm" onClick={() => { setEditing(false); toast('تم حفظ معلومات العمل', person.name) }}>حفظ التغييرات</button></div>
        </>}
      </Panel>}

      {tab === TABS360[2] && <Panel title="المستندات" sub="عقود ومستندات الموظف" icon={<I.Card size={16} />} actions={<button className="btn btn-primary btn-sm" onClick={() => toast('رفع مستند', 'اختر ملفًا من جهازك.')}><I.Plus size={15} />رفع مستند</button>}>
        <table className="tbl"><thead><tr><th>المستند</th><th>النوع</th><th>التاريخ</th><th /></tr></thead>
          <tbody>{[['عقد العمل', 'PDF', '12 فبراير 2026'], ['إقرار السياسات', 'PDF', '12 فبراير 2026']].map(([n, t, d], i) =>
            <tr key={n} className="row-in" style={{ animationDelay: `${i * 30}ms` }}><td><b>{n}</b></td><td className="muted">{t}</td><td className="muted">{d}</td>
              <td><button className="btn btn-secondary btn-sm" onClick={() => toast('تحميل', n)}>تحميل</button></td></tr>)}</tbody></table>
      </Panel>}

      {tab === TABS360[3] && <Panel title="سجل الحضور" icon={<I.Calendar size={16} />} actions={<button className="btn btn-secondary btn-sm" onClick={() => nav('/admin/attendance')}>فتح التقرير الكامل</button>}>
        <table className="tbl"><thead><tr><th>اليوم</th><th>الحضور</th><th>الانصراف</th><th>الصافي</th><th>الحالة</th></tr></thead>
          <tbody>{[['٢٦ أغسطس', '08:59', '17:04', '8 س 5 د', 'مكتمل'], ['٢٥ أغسطس', '09:19', '17:06', '7 س 47 د', 'تأخير'], ['٢٤ أغسطس', '08:55', '17:00', '8 س 5 د', 'مكتمل']].map(([d, i2, o, n, st], i) =>
            <tr key={d} className="row-in" style={{ animationDelay: `${i * 30}ms` }}><td><b>{d}</b></td><td dir="ltr" style={{ textAlign: 'right' }}>{i2}</td><td dir="ltr" style={{ textAlign: 'right' }}>{o}</td><td>{n}</td>
              <td><span className={`pill ${st === 'مكتمل' ? 'green' : 'amber'}`}>{st}</span></td></tr>)}</tbody></table>
      </Panel>}

      {tab === TABS360[4] && <Panel title="الصلاحيات" sub={`صلاحيات دور «${f.role}» — يمكنك استثناء صلاحيات لهذا العضو`} icon={<I.Status size={16} />}>
        <PrefRow title="دخول المكتب" sub="من صلاحيات الدور"><span className="pill teal"><I.Check size={12} />مفعّل</span></PrefRow>
        <PrefRow title="تعديل تصميم الطابق" sub="استثناء خاص بهذا العضو"><Switch on={false} onChange={() => toast('تم تعديل الصلاحية', 'استثناء خاص بمحمد أمين.')} /></PrefRow>
        <PrefRow title="عرض حضور الفريق"><Switch on onChange={() => toast('تم تعديل الصلاحية')} /></PrefRow>
        <PrefRow title="تصدير التقارير"><Switch on={false} onChange={() => toast('تم تعديل الصلاحية')} /></PrefRow>
      </Panel>}
    </AdminLayout>
  )
}

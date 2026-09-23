import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminLayout, Confirm, Empty, Filter, PageHead, Panel, PrefRow, RowMenu, Stat, Switch, Tabs } from '../components/Admin'
import { I } from '../components/Icons'
import { useStore } from '../store'

const TABS = ['الأعضاء', 'الأدوار والصلاحيات', 'الفرق', 'المالكون والملكية']

type M = { id: string; name: string; email: string; title: string; role: string; team: string; presence: 'متاح' | 'يركّز' | 'بعيد' | 'غير متصل'; status: 'نشط' | 'بانتظار قبول الدعوة' | 'معطّل'; last: string; owner?: boolean; color?: string }
const MEMBERS: M[] = [
  { id: '1', name: 'أحمد هشيمة', email: 'ahmed@company.com', title: 'Product Designer', role: 'المشرف', team: 'فريق المنتج', presence: 'متاح', status: 'نشط', last: 'منذ 5 دقائق', owner: true, color: 'teal' },
  { id: '2', name: 'محمد أمين', email: 'mohamed@company.com', title: 'Frontend Developer', role: 'موظف', team: 'فريق التصميم', presence: 'متاح', status: 'نشط', last: 'الآن', color: 'purple' },
  { id: '3', name: 'داليا سمير', email: 'dalia@company.com', title: 'UX Designer', role: 'مدير طابق', team: 'فريق التصميم', presence: 'يركّز', status: 'نشط', last: 'منذ 12 دقيقة' },
  { id: '4', name: 'نور الشامي', email: 'nour@company.com', title: 'QA Engineer', role: 'موظف', team: '—', presence: 'غير متصل', status: 'نشط', last: 'أمس 6:40 م' },
  { id: '5', name: 'خالد عبد الله', email: 'khaled@company.com', title: 'Operations Manager', role: 'مدير الشركة', team: 'الإدارة', presence: 'بعيد', status: 'نشط', last: 'منذ ساعة' },
  { id: '6', name: 'سارة منيع', email: 'sara@company.com', title: 'Support Specialist', role: 'ضيف', team: 'فريق الدعم', presence: 'غير متصل', status: 'بانتظار قبول الدعوة', last: 'لم تنضم بعد' },
]

const ROLES = [
  { name: 'المالك الأساسي', n: 1, desc: 'تحكم كامل في مساحة العمل بما في ذلك الملكية والفوترة', locked: true },
  { name: 'المشرف', n: 2, desc: 'إدارة الأعضاء والطوابق والصلاحيات' },
  { name: 'مدير الشركة', n: 1, desc: 'متابعة التقارير والحضور وإدارة الفرق' },
  { name: 'مدير طابق', n: 1, desc: 'تعديل طابق محدد وإدارة مكاتبه' },
  { name: 'موظف', n: 12, desc: 'الوصول إلى المكتب والغرف والمحادثات' },
  { name: 'ضيف', n: 3, desc: 'وصول محدود لغرفة واحدة بدون صلاحيات إدارية' },
]

/* الصلاحيات: lvl = أقل دور يملكها افتراضيًا (0 = المالك فقط … 5 = الجميع) */
const RANK: Record<string, number> = { 'المالك الأساسي': 0, 'المشرف': 1, 'مدير الشركة': 2, 'مدير طابق': 3, 'موظف': 4, 'ضيف': 5 }
type P = { t: string; lvl: number; sub?: string }
const PERMS: { g: string; items: P[] }[] = [
  {
    g: 'مساحة العمل', items: [
      { t: 'دخول الطوابق', lvl: 5 },
      { t: 'إدارة الغرف', lvl: 3 },
      { t: 'تعديل غرفته فقط', lvl: 4, sub: 'يملك العضو الذي يكون مالكًا لمكتب تغيير الأثاث والاسم والأرضية دون أي غرفة أخرى.' },
      { t: 'تعديل الخريطة', lvl: 3 },
      { t: 'تخصيص المساحات', lvl: 1 },
      { t: 'استخدام متجر الأثاث', lvl: 3 },
    ],
  },
  {
    g: 'الأعضاء', items: [
      { t: 'عرض الأعضاء', lvl: 4 },
      { t: 'دعوة عضو', lvl: 1 },
      { t: 'تعديل بيانات الأعضاء', lvl: 1 },
      { t: 'تعديل الأدوار', lvl: 1 },
      { t: 'تعطيل عضو', lvl: 1 },
    ],
  },
  {
    g: 'الحضور والتقارير', items: [
      { t: 'عرض حضوره', lvl: 5 },
      { t: 'عرض حضور الفريق', lvl: 2 },
      { t: 'تعديل سجل الحضور', lvl: 1 },
      { t: 'تصدير التقارير', lvl: 2 },
    ],
  },
  {
    g: 'الاجتماعات والتسجيلات', items: [
      { t: 'بدء اجتماع', lvl: 4 },
      { t: 'تسجيل الاجتماعات', lvl: 4 },
      { t: 'مشاركة الشاشة', lvl: 5 },
      { t: 'إدارة وصول التسجيلات', lvl: 2 },
    ],
  },
  {
    g: 'الفوترة والاشتراك', items: [
      { t: 'عرض الفواتير', lvl: 2 },
      { t: 'تغيير الباقة', lvl: 0 },
      { t: 'تحديث طريقة الدفع', lvl: 0 },
    ],
  },
]

const TEAMS = [
  { name: 'فريق التصميم', lead: 'داليا سمير', n: 4, tpl: 'إدارة فريق التصميم' },
  { name: 'الإدارة', lead: 'خالد عبد الله', n: 3, tpl: 'مشرف العمليات' },
  { name: 'فريق الدعم', lead: 'سارة منيع', n: 2, tpl: 'وصول محدود للتقارير' },
]

export default function Team() {
  const [tab, setTab] = useState(TABS[0])
  return (
    <AdminLayout>
      <Tabs items={TABS} value={tab} onChange={setTab} />
      {tab === TABS[0] && <Members />}
      {tab === TABS[1] && <Roles />}
      {tab === TABS[2] && <TeamsTab />}
      {tab === TABS[3] && <Ownership />}
    </AdminLayout>
  )
}

/* ================= الأعضاء ================= */
function Members() {
  const { setInvite, toast } = useStore()
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const [role, setRole] = useState('الكل')
  const [team, setTeam] = useState('الكل')
  const [presence, setPresence] = useState('الكل')
  const [status, setStatus] = useState('الكل')
  const [confirm, setConfirm] = useState<M | null>(null)

  const rows = useMemo(() => MEMBERS.filter(m =>
    (m.name.includes(q) || m.email.includes(q) || m.title.includes(q)) &&
    (role === 'الكل' || m.role === role) && (team === 'الكل' || m.team === team) &&
    (presence === 'الكل' || m.presence === presence) && (status === 'الكل' || m.status === status)), [q, role, team, presence, status])

  return (
    <>
      <PageHead title="الأعضاء" sub="إدارة أعضاء مساحة العمل وبياناتهم الوظيفية وأدوارهم"
        actions={<button className="btn btn-primary btn-sm" onClick={() => setInvite(true)}><I.People size={16} />دعوة عضو</button>} />
      <div className="grid g4" style={{ marginBottom: 14 }}>
        <Stat icon={<I.People size={18} />} n="24" unit="عضو" t="إجمالي الأعضاء" />
        <Stat icon={<I.Status size={18} />} n="11" unit="عضو" t="متصل الآن" />
        <Stat icon={<I.Mail size={18} />} n="3" unit="دعوات" t="بانتظار الدعوة" />
        <Stat icon={<I.Close size={18} />} n="0" unit="حساب" t="الحسابات المعطّلة" />
      </div>
      <Panel>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
          <div className="field" style={{ flex: 1, minWidth: 220, height: 36 }}><I.Search size={16} style={{ color: 'var(--text-3)' }} /><input placeholder="ابحث عن عضو…" value={q} onChange={e => setQ(e.target.value)} /></div>
          <Filter label="الدور" items={['الكل', 'المشرف', 'مدير الشركة', 'مدير طابق', 'موظف', 'ضيف']} value={role} onPick={setRole} width={140} />
          <Filter label="الفريق" items={['الكل', 'فريق المنتج', 'فريق التصميم', 'الإدارة', 'فريق الدعم']} value={team} onPick={setTeam} width={150} />
          <Filter label="التواجد" items={['الكل', 'متاح', 'يركّز', 'بعيد', 'غير متصل']} value={presence} onPick={setPresence} width={140} />
          <Filter label="العضوية" items={['الكل', 'نشط', 'بانتظار قبول الدعوة', 'معطّل']} value={status} onPick={setStatus} width={160} />
        </div>
        {rows.length === 0 ? <Empty title="لا يوجد أعضاء مطابقون" sub="جرّب تغيير الفلاتر أو كلمة البحث." /> : (
          <div style={{ overflow: 'auto' }}>
            <table className="tbl">
              <thead><tr><th>العضو</th><th>المسمى الوظيفي</th><th>الدور</th><th>الفريق</th><th>التواجد</th><th>حالة العضوية</th><th>آخر نشاط</th><th /></tr></thead>
              <tbody>
                {rows.map((m, i) => (
                  <tr key={m.id} className="row-in" style={{ animationDelay: `${i * 30}ms` }}>
                    <td><div className="cell-user"><span className={`avatar sm ${m.color === 'teal' ? 'teal' : m.color === 'purple' ? 'purple' : 'dark'}`}>{m.name[0]}</span><span><b>{m.name} {m.owner && <span className="pill teal">المالك الأساسي</span>}</b><span dir="ltr">{m.email}</span></span></div></td>
                    <td dir="ltr" style={{ textAlign: 'right' }}>{m.title}</td>
                    <td>{m.role}</td>
                    <td>{m.team === '—' ? <span className="pill">—</span> : <span className="pill purple">{m.team}</span>}</td>
                    <td><span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}><i className={`dot ${m.presence === 'متاح' ? 'green' : m.presence === 'يركّز' ? 'purple' : m.presence === 'بعيد' ? 'amber' : 'gray'}`} />{m.presence}</span></td>
                    <td><span className={`pill ${m.status === 'نشط' ? 'green' : m.status === 'معطّل' ? 'red' : 'amber'}`}>{m.status}</span></td>
                    <td className="muted">{m.last}</td>
                    <td><RowMenu items={[
                      { label: 'عرض الملف الشخصي', onClick: () => nav('/admin/employee/' + m.id) },
                      { label: 'تعديل الدور', onClick: () => toast('تعديل الدور', 'افتح تبويب «الأدوار والصلاحيات» لتعديل الصلاحيات.') },
                      { label: 'نقل إلى فريق آخر', onClick: () => toast('نقل العضو', 'اختر الفريق من تبويب «الفرق».') },
                      m.status === 'بانتظار قبول الدعوة' ? { label: 'إلغاء الدعوة', danger: true, onClick: () => setConfirm(m) } : { label: 'تعطيل الحساب', danger: true, onClick: () => setConfirm(m) },
                    ]} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
      {confirm && <Confirm danger title={confirm.status === 'بانتظار قبول الدعوة' ? 'إلغاء دعوة العضو؟' : 'تعطيل حساب العضو؟'}
        body={confirm.status === 'بانتظار قبول الدعوة' ? `سيتم إلغاء دعوة ${confirm.name} ولن يتمكن من الانضمام بهذا الرابط.` : `لن يتمكن ${confirm.name} من الدخول إلى مساحة العمل حتى تعيد تفعيل حسابه.`}
        confirmLabel={confirm.status === 'بانتظار قبول الدعوة' ? 'نعم، إلغاء الدعوة' : 'نعم، تعطيل الحساب'}
        onConfirm={() => { toast(confirm.status === 'بانتظار قبول الدعوة' ? 'تم إلغاء الدعوة' : 'تم تعطيل الحساب', confirm.name); setConfirm(null) }} onClose={() => setConfirm(null)} />}
    </>
  )
}

/* ================= الأدوار والصلاحيات ================= */
function Roles() {
  const { toast } = useStore()
  const [sel, setSel] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [pf, setPf] = useState('الكل')
  const [state, setState] = useState<Record<string, boolean>>({})
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [confirm, setConfirm] = useState(false)

  if (!sel) return (
    <>
      <PageHead title="الأدوار والصلاحيات" sub="اضبط ما يستطيع كل دور فعله داخل مساحة العمل" actions={<button className="btn btn-secondary btn-sm" onClick={() => toast('إنشاء دور مخصص', 'سيُتاح في التحديث القادم.')}><I.Plus size={16} />دور جديد</button>} />
      <div className="grid g3">
        {ROLES.map(r => (
          <button key={r.name} className="card panel card-in" style={{ textAlign: 'start' }} onClick={() => setSel(r.name)}>
            <div className="panel-head" style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', gap: 10 }}><span className="ic">{r.locked ? <I.Crown size={16} /> : <I.UserCircle size={16} />}</span><div><h3>{r.name}</h3><p>{r.n} عضو</p></div></div>
              {r.locked && <span className="pill">محمي</span>}
            </div>
            <p className="caption">{r.desc}</p>
            <div className="link-row" style={{ marginTop: 12 }}><span className="link">تعديل الصلاحيات ←</span></div>
          </button>
        ))}
      </div>
    </>
  )

  const locked = sel === 'المالك الأساسي'
  const rank = RANK[sel] ?? 4
  const isOn = (g: string, p: P) => state[g + p.t] ?? (locked ? true : p.lvl >= rank)
  const all = PERMS.flatMap(g => g.items.map(p => isOn(g.g, p)))
  const onN = all.filter(Boolean).length
  const groups = PERMS
    .map(g => ({ g: g.g, items: g.items.filter(p => (!q || p.t.includes(q)) && (pf === 'الكل' || (pf === 'المفعّلة') === isOn(g.g, p))) }))
    .filter(g => g.items.length)
  return (
    <>
      <PageHead title="الصلاحيات" sub="تحكّم في الصلاحيات الافتراضية لكل دور داخل مساحة العمل"
        actions={<button className="btn btn-secondary btn-sm" onClick={() => { setSel(null); setDirty(false); setQ(''); setPf('الكل') }}><I.ChevronR size={14} />كل الأدوار</button>} />

      <div className="card card-in" style={{ padding: 10, display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
        <div className="field" style={{ flex: 1, minWidth: 200, height: 36, margin: 0 }}>
          <I.Search size={16} style={{ color: 'var(--text-3)' }} />
          <input placeholder="ابحث في الصلاحيات…" value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['الكل', 'المفعّلة', 'غير المفعّلة'].map(f => <button key={f} className={`chip ${pf === f ? 'on' : ''}`} onClick={() => setPf(f)}>{f}</button>)}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        {ROLES.map(r => <button key={r.name} className={`chip ${sel === r.name ? 'on' : ''}`} onClick={() => { setSel(r.name); setState({}); setDirty(false) }}>
          {r.locked && <I.Status size={13} />}{r.name}
        </button>)}
      </div>

      <Panel className="card-in">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700 }}>{sel}</h3>
            <p className="caption" style={{ marginTop: 3 }}>{locked ? 'دور محمي — كل الصلاحيات مفعّلة دائمًا' : `${onN} صلاحية مفعّلة · ${all.length - onN} غير مفعّلة`}</p>
          </div>
          <span className="pill"><I.People size={13} />{ROLES.find(r => r.name === sel)?.n} عضوًا يستخدمون هذا الدور</span>
        </div>
      </Panel>
      <div style={{ height: 14 }} />

      <div className="grid" style={{ gap: 14 }}>
        {groups.map(g => (
          <Panel key={g.g} title={g.g}>
            {g.items.map(p => (
              <PrefRow key={p.t} title={p.t} sub={p.sub ?? (locked ? 'مفعّل دائمًا لهذا الدور' : undefined)}>
                {locked ? <span className="pill teal"><I.Check size={12} />مفعّل</span>
                  : <Switch on={isOn(g.g, p)} onChange={v => { setState(s => ({ ...s, [g.g + p.t]: v })); setDirty(true) }} />}
              </PrefRow>
            ))}
          </Panel>
        ))}
        {!groups.length && <Empty title="لا توجد صلاحيات مطابقة" sub="جرّب كلمة أخرى أو غيّر الفلتر." />}
      </div>
      {dirty && !locked && (
        <div className="savebar">
          <I.Info size={18} style={{ color: 'var(--amber)' }} />
          <span style={{ flex: 1, fontSize: 13 }}>لديك تغييرات غير محفوظة على صلاحيات «{sel}».</span>
          <button className="btn btn-secondary btn-sm" onClick={() => { setState({}); setDirty(false) }}>تجاهل</button>
          <button className="btn btn-primary btn-sm" onClick={() => setConfirm(true)}>حفظ التغييرات</button>
        </div>
      )}
      {confirm && <Confirm title="حفظ تعديلات الصلاحيات؟" body={`سيتم تطبيق الصلاحيات الجديدة على كل أعضاء دور «${sel}» فورًا.`} confirmLabel={saving ? 'جارٍ الحفظ…' : 'نعم، احفظ'}
        onConfirm={() => { setSaving(true); setTimeout(() => { setSaving(false); setConfirm(false); setDirty(false); toast('تم حفظ الصلاحيات', `دور «${sel}» اتحدّث بنجاح.`) }, 1200) }} onClose={() => setConfirm(false)} />}
    </>
  )
}

/* ================= الفرق ================= */
const TEMPLATES = ['إدارة فريق التصميم', 'إدارة الطابق', 'مشرف العمليات', 'وصول محدود للتقارير']

function TeamsTab() {
  const { toast } = useStore()
  const [create, setCreate] = useState(false)
  const [name, setName] = useState('')
  const [sel, setSel] = useState<string | null>(null)
  if (sel) return <TeamDetails name={sel} onBack={() => setSel(null)} />
  return (
    <>
      <PageHead title="الفرق" sub="نظّم الأعضاء في فرق واربط كل فريق بقالب صلاحيات" actions={<button className="btn btn-primary btn-sm" onClick={() => setCreate(true)}><I.Plus size={16} />فريق جديد</button>} />
      <div className="grid g3">
        {TEAMS.map(t => (
          <Panel key={t.name} title={t.name} sub={`${t.n} أعضاء · قائد الفريق: ${t.lead}`} icon={<I.Group size={16} />}>
            <div className="pill teal" style={{ marginBottom: 12 }}>{t.tpl}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary btn-sm btn-fill" onClick={() => setSel(t.name)}>التفاصيل</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setSel(t.name)}>القالب</button>
            </div>
          </Panel>
        ))}
      </div>
      {create && (
        <div className="scrim" onMouseDown={e => { if (e.target === e.currentTarget) setCreate(false) }}>
          <div className="modal" style={{ width: 460 }}>
            <div className="modal-header"><span className="tile"><I.Group size={20} /></span><div><div className="modal-title">فريق جديد</div><div className="modal-sub">أنشئ فريقًا وحدد قائده وقالب صلاحياته</div></div><button className="btn btn-ghost btn-icon close" onClick={() => setCreate(false)}><I.Close size={18} /></button></div>
            <div className="divider" />
            <div className="form" style={{ marginTop: 0 }}>
              <div className="row"><label className="label">اسم الفريق</label><div className="field"><input value={name} onChange={e => setName(e.target.value)} placeholder="مثال: فريق التسويق" autoFocus /></div></div>
              <div className="row"><label className="label">قائد الفريق</label><div className="field"><input readOnly value="داليا سمير" /></div></div>
            </div>
            <div className="divider" />
            <div className="modal-footer"><button className="btn btn-primary" disabled={!name.trim()} onClick={() => { setCreate(false); toast('تم إنشاء الفريق', name) }}>إنشاء الفريق</button><button className="btn btn-secondary" onClick={() => setCreate(false)}>إلغاء</button></div>
          </div>
        </div>
      )}
    </>
  )
}

/* ================= تفاصيل الفريق ================= */
const T_TABS = ['نظرة عامة', 'الأعضاء', 'الصلاحيات']
function TeamDetails({ name, onBack }: { name: string; onBack: () => void }) {
  const { toast } = useStore()
  const t = TEAMS.find(x => x.name === name)!
  const [tab, setTab] = useState(T_TABS[0])
  const [tpl, setTpl] = useState(t.tpl)
  const [lead, setLead] = useState(t.lead)
  const [ids, setIds] = useState(MEMBERS.filter(m => m.team === name).map(m => m.id))
  const [dlg, setDlg] = useState<'add' | 'lead' | 'tpl' | 'archive' | null>(null)
  const [rm, setRm] = useState<M | null>(null)
  const [pick, setPick] = useState<string | null>(null)
  const list = MEMBERS.filter(m => ids.includes(m.id))
  const outside = MEMBERS.filter(m => !ids.includes(m.id))

  const PickList = ({ items, onPick }: { items: M[]; onPick: (m: M) => void }) => (
    <div className="opt-list">
      {items.map(m => <button key={m.id} className={`ao-row ${pick === m.id ? 'on' : ''}`} onClick={() => { setPick(m.id); onPick(m) }}>
        <span className="avatar">{m.name[0]}</span>
        <span className="txt"><b>{m.name}</b><small>{m.title} · {m.role}</small></span>
        {pick === m.id && <span className="chk"><I.Check size={14} /></span>}
      </button>)}
      {!items.length && <p className="caption" style={{ padding: 10 }}>لا يوجد أعضاء متاحون.</p>}
    </div>
  )

  return (
    <>
      <button className="back-link" onClick={onBack}><I.ChevronR size={14} />كل الفرق</button>
      <PageHead title={name} sub={`${list.length} أعضاء · قائد الفريق: ${lead}`}
        actions={<button className="btn btn-secondary btn-sm" style={{ color: 'var(--red)' }} onClick={() => setDlg('archive')}>أرشفة الفريق</button>} />
      <Tabs items={T_TABS} value={tab} onChange={setTab} />

      {tab === T_TABS[0] && <>
        <div className="grid g3" style={{ marginBottom: 14 }}>
          <Stat icon={<I.People size={18} />} n={String(list.length)} unit="عضو" t="أعضاء الفريق" />
          <Stat icon={<I.Status size={18} />} n={tpl} t="قالب الصلاحيات" />
          <Stat icon={<I.Calendar size={18} />} n="1 فبراير 2026" t="تاريخ الإنشاء" />
        </div>
        <div className="grid g2">
          <Panel title="قائد الفريق" icon={<I.Crown size={16} />} actions={<button className="btn btn-secondary btn-sm" onClick={() => { setPick(null); setDlg('lead') }}>تغيير القائد</button>}>
            <div className="cell-user" style={{ padding: '8px 0' }}>
              <span className="avatar teal">{lead[0]}</span>
              <div style={{ flex: 1 }}><b>{lead}</b><span className="caption">يملك إدارة أعضاء الفريق وقالب صلاحياته</span></div>
            </div>
          </Panel>
          <Panel title="قالب الصلاحيات" icon={<I.Status size={16} />} actions={<button className="btn btn-secondary btn-sm" onClick={() => { setPick(null); setDlg('tpl') }}>تغيير القالب</button>}>
            <div className="card" style={{ padding: '0 14px' }}>
              <div className="detail-row"><span>القالب الحالي</span><b>{tpl}</b></div>
              <div className="detail-row"><span>ينطبق على</span><b>{list.length} أعضاء</b></div>
            </div>
          </Panel>
        </div>
      </>}

      {tab === T_TABS[1] && <Panel title="أعضاء الفريق" sub="الأعضاء المرتبطون بهذا الفريق" icon={<I.People size={16} />}
        actions={<button className="btn btn-primary btn-sm" onClick={() => { setPick(null); setDlg('add') }}><I.Plus size={15} />إضافة عضو</button>}>
        {list.length ? <table className="tbl">
          <thead><tr><th>العضو</th><th>المسمى الوظيفي</th><th>الدور</th><th /></tr></thead>
          <tbody>
            {list.map((m, i) => <tr key={m.id} className="row-in" style={{ animationDelay: `${i * 30}ms` }}>
              <td><div className="cell-user"><span className="avatar sm dark">{m.name[0]}</span><span><b>{m.name} {m.name === lead && <span className="pill teal">قائد الفريق</span>}</b><span dir="ltr">{m.email}</span></span></div></td>
              <td dir="ltr" style={{ textAlign: 'right' }}>{m.title}</td>
              <td>{m.role}</td>
              <td><RowMenu items={[
                { label: 'تعيينه قائدًا للفريق', onClick: () => { setLead(m.name); toast('تم تغيير قائد الفريق', m.name) } },
                { label: 'إزالة من الفريق', danger: true, onClick: () => setRm(m) },
              ]} /></td>
            </tr>)}
          </tbody>
        </table> : <Empty title="لا يوجد أعضاء في هذا الفريق" sub="أضف أعضاء ليظهروا هنا." action={<button className="btn btn-primary btn-sm" onClick={() => setDlg('add')}>إضافة عضو</button>} />}
      </Panel>}

      {tab === T_TABS[2] && <Panel title="صلاحيات الفريق" sub={`مصدرها قالب «${tpl}» — ينطبق على كل أعضاء الفريق`} icon={<I.Status size={16} />}
        actions={<button className="btn btn-secondary btn-sm" onClick={() => { setPick(null); setDlg('tpl') }}>تغيير القالب</button>}>
        <PrefRow title="إدارة أعضاء الفريق" sub="من صلاحيات القالب"><span className="pill teal"><I.Check size={12} />مفعّل</span></PrefRow>
        <PrefRow title="تعديل طابق الفريق"><span className="pill teal"><I.Check size={12} />مفعّل</span></PrefRow>
        <PrefRow title="عرض حضور الفريق"><span className="pill teal"><I.Check size={12} />مفعّل</span></PrefRow>
        <PrefRow title="تصدير التقارير"><span className="pill">غير مفعّل</span></PrefRow>
        <p className="caption" style={{ marginTop: 12 }}>تعديل الصلاحيات نفسها يتم من «الأدوار والصلاحيات»، وينطبق على كل من يستخدم القالب.</p>
      </Panel>}

      {(dlg === 'add' || dlg === 'lead') && (
        <div className="scrim" onMouseDown={e => { if (e.target === e.currentTarget) setDlg(null) }}>
          <div className="modal" style={{ width: 460 }}>
            <div className="modal-header"><span className="tile">{dlg === 'add' ? <I.Plus size={20} /> : <I.Crown size={20} />}</span>
              <div><div className="modal-title">{dlg === 'add' ? 'إضافة عضو إلى الفريق' : 'تغيير قائد الفريق'}</div>
                <div className="modal-sub">{dlg === 'add' ? `اختر عضوًا لإضافته إلى «${name}»` : 'القائد يدير أعضاء الفريق وقالب صلاحياته'}</div></div>
              <button className="btn btn-ghost btn-icon close" onClick={() => setDlg(null)}><I.Close size={18} /></button></div>
            <div className="divider" />
            <PickList items={dlg === 'add' ? outside : list} onPick={() => { }} />
            <div className="divider" />
            <div className="modal-footer">
              <button className="btn btn-primary" disabled={!pick} onClick={() => {
                const m = MEMBERS.find(x => x.id === pick)!
                if (dlg === 'add') { setIds(v => [...v, m.id]); toast('تمت إضافة العضو', `${m.name} → ${name}`) }
                else { setLead(m.name); toast('تم تغيير قائد الفريق', m.name) }
                setDlg(null); setPick(null)
              }}>{dlg === 'add' ? 'إضافة العضو' : 'تعيين قائدًا'}</button>
              <button className="btn btn-secondary" onClick={() => setDlg(null)}>إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {dlg === 'tpl' && (
        <div className="scrim" onMouseDown={e => { if (e.target === e.currentTarget) setDlg(null) }}>
          <div className="modal" style={{ width: 460 }}>
            <div className="modal-header"><span className="tile"><I.Status size={20} /></span>
              <div><div className="modal-title">تغيير قالب الصلاحيات</div><div className="modal-sub">سينطبق القالب على كل أعضاء «{name}» فورًا</div></div>
              <button className="btn btn-ghost btn-icon close" onClick={() => setDlg(null)}><I.Close size={18} /></button></div>
            <div className="divider" />
            <div className="opt-list">
              {TEMPLATES.map(x => <button key={x} className={`opt ${(pick ?? tpl) === x ? 'on' : ''}`} onClick={() => setPick(x)}>{x}{(pick ?? tpl) === x && <I.Check size={16} />}</button>)}
            </div>
            <div className="divider" />
            <div className="modal-footer">
              <button className="btn btn-primary" disabled={!pick || pick === tpl} onClick={() => { setTpl(pick!); setDlg(null); setPick(null); toast('تم تطبيق القالب', pick!) }}>تطبيق القالب</button>
              <button className="btn btn-secondary" onClick={() => { setDlg(null); setPick(null) }}>إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {rm && <Confirm danger title="إزالة العضو من الفريق؟" body={`سيخرج ${rm.name} من «${name}» ويفقد صلاحيات القالب.`} confirmLabel="نعم، إزالة"
        onConfirm={() => { setIds(v => v.filter(x => x !== rm.id)); toast('تمت إزالة العضو', rm.name); setRm(null) }} onClose={() => setRm(null)} />}
      {dlg === 'archive' && <Confirm danger title="أرشفة الفريق؟" body={`سيُخفى «${name}» من القوائم ويفقد أعضاؤه قالب الصلاحيات. يمكن استرجاعه لاحقًا.`} confirmLabel="نعم، أرشفة"
        onConfirm={() => { setDlg(null); toast('تمت أرشفة الفريق', name); onBack() }} onClose={() => setDlg(null)} />}
    </>
  )
}

/* ================= المالكون والملكية ================= */
function Ownership() {
  const { toast } = useStore()
  const [step, setStep] = useState<0 | 1 | 2 | 3 | 4>(0)
  const [pick, setPick] = useState<string | null>(null)
  const [code, setCode] = useState('')
  const cands = MEMBERS.filter(m => !m.owner).slice(0, 4)
  return (
    <>
      <PageHead title="المالكون والملكية" sub="ملكية مساحة العمل «قمرة السعادة» وإجراءات نقلها" />
      <Panel title="المالك الأساسي" sub="أعلى مستوى تحكم في مساحة العمل بما في ذلك الفوترة والملكية" icon={<I.Crown size={16} />}
        actions={<button className="btn btn-secondary btn-sm" onClick={() => setStep(1)}><I.Logout size={15} />نقل الملكية</button>}>
        <div className="cell-user" style={{ padding: '8px 0' }}>
          <span className="avatar teal">أ</span>
          <div style={{ flex: 1 }}><b>أحمد هشيمة <span className="pill teal">المالك الأساسي</span></b><span dir="ltr">ahmed@company.com</span></div>
        </div>
      </Panel>
      <div style={{ height: 14 }} />
      <Panel title="سجل الملكية" icon={<I.Clock size={16} />}>
        <table className="tbl"><tbody>
          <tr><td>أنشأ مساحة العمل</td><td className="muted">أحمد هشيمة</td><td className="muted">1 يناير 2026</td></tr>
          <tr><td>آخر تغيير للملكية</td><td className="muted">—</td><td className="muted">لا يوجد</td></tr>
        </tbody></table>
      </Panel>

      {step === 1 && (
        <div className="scrim" onMouseDown={e => { if (e.target === e.currentTarget) setStep(0) }}>
          <div className="modal" style={{ width: 520 }}>
            <div className="modal-header"><span className="tile"><I.Crown size={20} /></span><div><div className="modal-title">نقل ملكية مساحة العمل</div><div className="modal-sub">نقل الملكية سيمنح العضو الجديد أعلى مستوى من التحكم في مساحة العمل</div></div><button className="btn btn-ghost btn-icon close" onClick={() => setStep(0)}><I.Close size={18} /></button></div>
            <div className="divider" />
            <div className="label" style={{ marginBottom: 8 }}>المالك الجديد</div>
            <div className="opt-list">
              {cands.map(m => <button key={m.id} className={`ao-row ${pick === m.id ? 'on' : ''}`} onClick={() => setPick(m.id)}>
                <span className="avatar">{m.name[0]}</span>
                <span className="txt"><b>{m.name}</b><small>{m.role}</small></span>
                {pick === m.id && <span className="chk"><I.Check size={14} /></span>}
              </button>)}
            </div>
            <div className="divider" />
            <div className="modal-footer"><button className="btn btn-primary" disabled={!pick} onClick={() => setStep(2)}>متابعة</button><button className="btn btn-secondary" onClick={() => setStep(0)}>إلغاء</button></div>
          </div>
        </div>
      )}
      {step === 2 && <Confirm title="تأكيد نقل الملكية" body={`سيصبح ${MEMBERS.find(m => m.id === pick)?.name} المالك الأساسي بعد قبول الطلب. ستظل المالك الحالي حتى يتم قبول النقل.`} confirmLabel="نقل الملكية" onConfirm={() => setStep(3)} onClose={() => setStep(1)} />}
      {step === 3 && (
        <div className="scrim" onMouseDown={e => { if (e.target === e.currentTarget) setStep(0) }}>
          <div className="modal" style={{ width: 470 }}>
            <div className="modal-header"><span className="tile"><I.Status size={20} /></span><div><div className="modal-title">تأكيد الهوية</div><div className="modal-sub">أدخل الرمز المرسل إلى بريدك للتأكيد</div></div><button className="btn btn-ghost btn-icon close" onClick={() => setStep(0)}><I.Close size={18} /></button></div>
            <div className="divider" />
            <div className="field" style={{ justifyContent: 'center' }}><input style={{ textAlign: 'center', letterSpacing: 8, fontSize: 18 }} dir="ltr" maxLength={6} placeholder="______" value={code} onChange={e => setCode(e.target.value)} autoFocus /></div>
            <div className="divider" />
            <div className="modal-footer"><button className="btn btn-primary" disabled={code.length < 4} onClick={() => setStep(4)}>تأكيد الرمز</button><button className="btn btn-secondary" onClick={() => toast('تم إعادة إرسال الرمز')}>إعادة إرسال الرمز</button></div>
          </div>
        </div>
      )}
      {step === 4 && <Confirm title="تم إرسال طلب نقل الملكية" body={`تم إرسال الطلب إلى ${MEMBERS.find(m => m.id === pick)?.name}. أمامه 48 ساعة لقبول نقل الملكية.`} confirmLabel="تم" onConfirm={() => { setStep(0); setPick(null); setCode(''); toast('تم إرسال طلب نقل الملكية') }} onClose={() => setStep(0)} />}
    </>
  )
}

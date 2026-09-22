import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminLayout, Confirm, PageHead, Panel, PrefRow, Stat, Switch, Tabs } from '../components/Admin'
import { I } from '../components/Icons'
import { useStore } from '../store'

const TABS = ['نظرة عامة', 'تفضيلات التطبيق', 'الأمان', 'إعدادات مساحة العمل', 'الدومين والانضمام']

export default function Settings({ initial }: { initial?: string }) {
  const [tab, setTab] = useState(initial ?? TABS[0])
  const { toast } = useStore()
  const nav = useNavigate()
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [prefs, setPrefs] = useState({ dark: false, sound: true, knock: true, mail: false, autoAbsence: true })
  const [ws, setWs] = useState({ name: 'مساحة عمل قمرة', slug: 'maktabi.app/qomra', week: 'الأحد', hours: '٩:٠٠ ص — ٥:٠٠ م' })
  const [domain, setDomain] = useState({ on: true, value: 'qomra.app', autoJoin: true })
  const [endSession, setEndSession] = useState<string | null>(null)
  const [leave, setLeave] = useState(false)

  const save = () => { setSaving(true); setTimeout(() => { setSaving(false); setDirty(false); toast('تم حفظ التغييرات') }, 1100) }

  return (
    <AdminLayout>
      <PageHead title="الإعدادات" sub="إدارة تفضيلات التطبيق وإعدادات مساحة العمل حسب صلاحياتك" />
      <Tabs items={TABS} value={tab} onChange={t => { setTab(t); setDirty(false) }} />

      {tab === TABS[0] && <>
        <div className="grid g2">
          <Panel title="تفضيلات التطبيق" sub="اللغة، المظهر، أصوات التنبيه وحجم النص" icon={<I.Settings size={16} />}>
            <div className="card" style={{ padding: '0 14px' }}><div className="detail-row"><span>اللغة والواجهة</span><b>العربية · الوضع الفاتح</b></div></div>
            <button className="btn btn-secondary btn-sm" style={{ marginTop: 14 }} onClick={() => setTab(TABS[1])}>إدارة التفضيلات</button>
          </Panel>
          <Panel title="الأمان" sub="الجلسات النشطة وإجراءات حماية الحساب" icon={<I.Status size={16} />}>
            <div className="card" style={{ padding: '0 14px' }}><div className="detail-row"><span>الجلسات</span><b>3 جلسات نشطة</b></div></div>
            <button className="btn btn-secondary btn-sm" style={{ marginTop: 14 }} onClick={() => setTab(TABS[2])}>إدارة الأمان</button>
          </Panel>
          <Panel title="إعدادات مساحة العمل" sub="الاسم، الرابط المعرّف، الأسبوع الرسمي وبداية الدوام" icon={<I.Building size={16} />}>
            <div className="card" style={{ padding: '0 14px' }}><div className="detail-row"><span>المعرّف</span><b dir="ltr">{ws.slug}</b></div></div>
            <button className="btn btn-secondary btn-sm" style={{ marginTop: 14 }} onClick={() => setTab(TABS[3])}>إدارة مساحة العمل</button>
          </Panel>
          <Panel title="الدومين والانضمام" sub="سياسة انضمام المستخدمين المطابقين لدومين الشركة" icon={<I.Link size={16} />}>
            <div className="card" style={{ padding: '0 14px' }}><div className="detail-row"><span>الانضمام التلقائي</span><b className="pill green">مفعّل</b></div></div>
            <button className="btn btn-secondary btn-sm" style={{ marginTop: 14 }} onClick={() => setTab(TABS[4])}>إدارة الدومين</button>
          </Panel>
        </div>
        <div style={{ height: 14 }} />
        <Panel title="أدوات من أقسام أخرى">
          <div className="link-row">
            <a onClick={() => nav('/admin/members')}>الأدوار والصلاحيات ←</a>
            <a onClick={() => nav('/admin/billing')}>الفوترة والاشتراك ←</a>
            <a onClick={() => nav('/admin/members')}>نقل ملكية المساحة ←</a>
            <a onClick={() => nav('/admin/profile')}>الملف الشخصي ←</a>
          </div>
        </Panel>
      </>}

      {tab === TABS[1] && <Panel title="تفضيلات التطبيق" icon={<I.Settings size={16} />}>
        <PrefRow title="اللغة" sub="لغة الواجهة داخل التطبيق"><span className="pill">العربية</span></PrefRow>
        <PrefRow title="الوضع الداكن" sub="مظهر داكن مريح للعين في الإضاءة المنخفضة"><Switch on={prefs.dark} onChange={v => { setPrefs(p => ({ ...p, dark: v })); setDirty(true) }} /></PrefRow>
        <PrefRow title="أصوات التنبيه" sub="صوت عند الطرق على الباب أو وصول رسالة"><Switch on={prefs.sound} onChange={v => { setPrefs(p => ({ ...p, sound: v })); setDirty(true) }} /></PrefRow>
        <PrefRow title="إشعارات الطرق" sub="إظهار نافذة عند طرق أحد على بابك"><Switch on={prefs.knock} onChange={v => { setPrefs(p => ({ ...p, knock: v })); setDirty(true) }} /></PrefRow>
        <PrefRow title="ملخص يومي بالبريد" sub="تقرير يومي بحضورك ومهامك"><Switch on={prefs.mail} onChange={v => { setPrefs(p => ({ ...p, mail: v })); setDirty(true) }} /></PrefRow>
      </Panel>}

      {tab === TABS[2] && <>
        <div className="grid g3" style={{ marginBottom: 14 }}>
          <Stat icon={<I.Status size={18} />} n="3" unit="جلسات" t="جلسات نشطة" />
          <Stat icon={<I.Clock size={18} />} n="اليوم" t="آخر تغيير لكلمة المرور" />
          <Stat icon={<I.Check size={18} />} n="مفعّل" t="التحقق بخطوتين" />
        </div>
        <Panel title="الجلسات النشطة" sub="الأجهزة المسجّل دخولها بحسابك" icon={<I.Status size={16} />}
          actions={<button className="btn btn-secondary btn-sm" onClick={() => setEndSession('all')}>تسجيل الخروج من الأجهزة الأخرى</button>}>
          <table className="tbl">
            <thead><tr><th>الجهاز</th><th>الموقع</th><th>آخر نشاط</th><th /></tr></thead>
            <tbody>
              {[['Chrome · Windows', 'الرياض، السعودية', 'الآن · هذا الجهاز', true], ['Safari · iPhone', 'الرياض، السعودية', 'منذ ساعتين', false], ['Chrome · MacBook', 'جدة، السعودية', 'أمس', false]].map(([d, l, t, cur], i) =>
                <tr key={d as string} className="row-in" style={{ animationDelay: `${i * 30}ms` }}>
                  <td><b>{d}</b> {cur && <span className="pill teal">الحالي</span>}</td><td className="muted">{l}</td><td className="muted">{t}</td>
                  <td>{!cur && <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)' }} onClick={() => setEndSession(d as string)}>إنهاء الجلسة</button>}</td>
                </tr>)}
            </tbody>
          </table>
        </Panel>
        <div style={{ height: 14 }} />
        <Panel title="كلمة المرور" icon={<I.Status size={16} />} actions={<button className="btn btn-secondary btn-sm" onClick={() => nav('/admin/profile')}>تغيير كلمة المرور</button>}>
          <p className="caption">ننصح بتغيير كلمة المرور كل 3 أشهر واستخدام كلمة مرور فريدة لهذه المساحة.</p>
        </Panel>
      </>}

      {tab === TABS[3] && <Panel title="إعدادات مساحة العمل" icon={<I.Building size={16} />}>
        <div className="form" style={{ marginTop: 0 }}>
          <div className="grid g2">
            <div className="row"><label className="label">اسم مساحة العمل</label><div className="field"><input value={ws.name} onChange={e => { setWs(w => ({ ...w, name: e.target.value })); setDirty(true) }} /></div></div>
            <div className="row"><label className="label">الرابط المعرّف</label><div className="field"><input dir="ltr" style={{ textAlign: 'right' }} value={ws.slug} onChange={e => { setWs(w => ({ ...w, slug: e.target.value })); setDirty(true) }} /></div></div>
            <div className="row"><label className="label">بداية الأسبوع</label><div className="field"><input value={ws.week} onChange={e => { setWs(w => ({ ...w, week: e.target.value })); setDirty(true) }} /></div></div>
            <div className="row"><label className="label">ساعات الدوام الرسمية</label><div className="field"><input value={ws.hours} onChange={e => { setWs(w => ({ ...w, hours: e.target.value })); setDirty(true) }} /></div></div>
          </div>
          <PrefRow title="الغياب التلقائي" sub="تسجيل الموظف غائبًا إذا لم يدخل المكتب خلال ساعتين من بداية الدوام"><Switch on={prefs.autoAbsence} onChange={v => { setPrefs(p => ({ ...p, autoAbsence: v })); setDirty(true) }} /></PrefRow>
        </div>
      </Panel>}

      {tab === TABS[4] && <>
        <Panel title="الدومين والانضمام" icon={<I.Link size={16} />}>
          <PrefRow title="تفعيل دومين الشركة" sub="يسمح لأصحاب البريد المطابق بطلب الانضمام"><Switch on={domain.on} onChange={v => { setDomain(d => ({ ...d, on: v })); setDirty(true) }} /></PrefRow>
          <div className="row" style={{ padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
            <label className="label" style={{ marginBottom: 6, display: 'block' }}>الدومين</label>
            <div className="field" style={{ maxWidth: 320 }}><input dir="ltr" style={{ textAlign: 'right' }} value={domain.value} onChange={e => { setDomain(d => ({ ...d, value: e.target.value })); setDirty(true) }} /></div>
          </div>
          <PrefRow title="الانضمام التلقائي" sub="قبول الطلبات تلقائيًا دون مراجعة المشرف"><Switch on={domain.autoJoin} onChange={v => { setDomain(d => ({ ...d, autoJoin: v })); setDirty(true) }} /></PrefRow>
        </Panel>
        <div style={{ height: 14 }} />
        <Panel title="طلبات الانضمام" sub="طلبات بانتظار قرارك" icon={<I.People size={16} />}>
          <table className="tbl">
            <thead><tr><th>الشخص</th><th>البريد</th><th>تاريخ الطلب</th><th /></tr></thead>
            <tbody>
              {[['ريم الحارثي', 'reem@qomra.app', 'اليوم'], ['فهد العتيبي', 'fahad@qomra.app', 'أمس']].map(([n, e, d], i) =>
                <tr key={n} className="row-in" style={{ animationDelay: `${i * 30}ms` }}>
                  <td><div className="cell-user"><span className="avatar sm dark">{n[0]}</span><b>{n}</b></div></td>
                  <td dir="ltr" style={{ textAlign: 'right' }} className="muted">{e}</td><td className="muted">{d}</td>
                  <td><div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-primary btn-sm" onClick={() => toast('تم قبول الطلب', n)}>قبول</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => toast('تم رفض الطلب', n)}>رفض</button>
                  </div></td>
                </tr>)}
            </tbody>
          </table>
        </Panel>
        <div style={{ height: 14 }} />
        <Panel title="مغادرة مساحة العمل" icon={<I.Logout size={16} />}>
          <p className="caption" style={{ marginBottom: 12 }}>لن تتمكن من الدخول إلى «قمرة السعادة» إلا بدعوة جديدة. المالك الأساسي لا يمكنه المغادرة قبل نقل الملكية.</p>
          <button className="btn btn-secondary btn-sm" style={{ color: 'var(--red)' }} onClick={() => setLeave(true)}>مغادرة مساحة العمل</button>
        </Panel>
      </>}

      {dirty && (
        <div className="savebar">
          <I.Info size={18} style={{ color: 'var(--amber)' }} />
          <span style={{ flex: 1, fontSize: 13 }}>لديك تغييرات غير محفوظة.</span>
          <button className="btn btn-secondary btn-sm" onClick={() => setDirty(false)}>تجاهل</button>
          <button className="btn btn-primary btn-sm" onClick={save} disabled={saving}>{saving ? <span className="spinner" /> : 'حفظ التغييرات'}</button>
        </div>
      )}
      {endSession && <Confirm danger title={endSession === 'all' ? 'تسجيل الخروج من كل الأجهزة الأخرى؟' : 'إنهاء هذه الجلسة؟'} body={endSession === 'all' ? 'سيتم إنهاء كل الجلسات ما عدا الجهاز الحالي.' : `سيتم تسجيل الخروج من ${endSession}.`} confirmLabel="نعم، تأكيد" onConfirm={() => { toast(endSession === 'all' ? 'تم تسجيل الخروج من الأجهزة الأخرى' : 'تم إنهاء الجلسة'); setEndSession(null) }} onClose={() => setEndSession(null)} />}
      {leave && <Confirm danger title="مغادرة مساحة العمل؟" body="لن تتمكن من الدخول مرة أخرى إلا بدعوة جديدة من المشرف." confirmLabel="نعم، مغادرة" onConfirm={() => { setLeave(false); toast('لا يمكن المغادرة', 'أنت المالك الأساسي — انقل الملكية أولًا.') }} onClose={() => setLeave(false)} />}
    </AdminLayout>
  )
}

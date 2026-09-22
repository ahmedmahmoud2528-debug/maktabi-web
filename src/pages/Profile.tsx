import { useState } from 'react'
import { AdminLayout, PageHead, Panel, PrefRow, Stat, Switch, Tabs } from '../components/Admin'
import { I } from '../components/Icons'
import { useStore } from '../store'

const TABS = ['نظرة عامة', 'تعديل الملف', 'كلمة المرور']
const STATUSES = [['متاح', 'green'], ['تركيز', 'purple'], ['بعيد', 'amber'], ['لا تزعجني', 'gray']] as const

export default function Profile() {
  const { user, toast } = useStore()
  const [tab, setTab] = useState(TABS[0])
  const [status, setStatus] = useState('متاح')
  const [menu, setMenu] = useState(false)
  const [form, setForm] = useState({ name: user.name, title: 'Product Designer', phone: '+966 5• ••• ••••', team: 'فريق المنتج' })
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [pwStep, setPwStep] = useState<1 | 2 | 3 | 4>(1)
  const [pw, setPw] = useState({ a: '', b: '' })
  const [code, setCode] = useState('')
  const [err, setErr] = useState('')
  const [notif, setNotif] = useState({ knock: true, dm: true, mention: true })

  return (
    <AdminLayout>
      <PageHead title="الملف الشخصي" sub="بياناتك داخل مساحة العمل وحالتك وإعدادات حسابك" />
      <Tabs items={TABS} value={tab} onChange={setTab} />

      {tab === TABS[0] && <>
        <Panel>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <span className="avatar teal" style={{ width: 64, height: 64, fontSize: 22 }}>{user.initial}</span>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>{user.name}</h2>
              <p className="caption" style={{ marginTop: 2 }}>{form.title} · {user.role}</p>
              <p className="caption" dir="ltr" style={{ textAlign: 'right' }}>{user.email}</p>
            </div>
            <div style={{ position: 'relative' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setMenu(m => !m)}>
                <i className={`dot ${STATUSES.find(s => s[0] === status)![1]}`} />{status}<I.Chevron size={14} />
              </button>
              {menu && <div className="popover menu" style={{ top: 42, insetInlineEnd: 0, minWidth: 180 }}>
                {STATUSES.map(([s, c]) => <button key={s} className="menu-item" onClick={() => { setStatus(s); setMenu(false); toast('تم تحديث حالتك', s) }}><i className={`dot ${c}`} />{s}{status === s && <I.Check size={14} style={{ marginInlineStart: 'auto', color: 'var(--teal)' }} />}</button>)}
              </div>}
            </div>
          </div>
        </Panel>
        <div style={{ height: 14 }} />
        <div className="grid g3">
          <Stat icon={<I.Clock size={18} />} n="7.4" unit="ساعة" t="ساعات اليوم" />
          <Stat icon={<I.Calendar size={18} />} n="21" unit="يوم" t="أيام الحضور هذا الشهر" />
          <Stat icon={<I.People size={18} />} n="فريق المنتج" t="الفريق" />
        </div>
        <div style={{ height: 14 }} />
        <div className="grid g2">
          <Panel title="بيانات العمل" icon={<I.Building size={16} />}>
            <div className="card" style={{ padding: '0 14px' }}>
              <div className="detail-row"><span>المسمى الوظيفي</span><b>{form.title}</b></div>
              <div className="detail-row"><span>الفريق</span><b>{form.team}</b></div>
              <div className="detail-row"><span>المكتب</span><b>المساحة المفتوحة</b></div>
              <div className="detail-row"><span>تاريخ الانضمام</span><b>1 يناير 2026</b></div>
            </div>
          </Panel>
          <Panel title="إشعاراتي" icon={<I.Bell size={16} />}>
            <PrefRow title="الطرق على الباب"><Switch on={notif.knock} onChange={v => setNotif(n => ({ ...n, knock: v }))} /></PrefRow>
            <PrefRow title="الرسائل المباشرة"><Switch on={notif.dm} onChange={v => setNotif(n => ({ ...n, dm: v }))} /></PrefRow>
            <PrefRow title="الإشارات في القنوات"><Switch on={notif.mention} onChange={v => setNotif(n => ({ ...n, mention: v }))} /></PrefRow>
          </Panel>
        </div>
      </>}

      {tab === TABS[1] && <Panel title="تعديل الملف الشخصي" icon={<I.Edit size={16} />}>
        <div className="form" style={{ marginTop: 0 }}>
          <div className="grid g2">
            <div className="row"><label className="label">الاسم</label><div className="field"><input value={form.name} onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setDirty(true) }} /></div></div>
            <div className="row"><label className="label">المسمى الوظيفي</label><div className="field"><input value={form.title} onChange={e => { setForm(f => ({ ...f, title: e.target.value })); setDirty(true) }} /></div></div>
            <div className="row"><label className="label">رقم الجوال</label><div className="field"><input dir="ltr" style={{ textAlign: 'right' }} value={form.phone} onChange={e => { setForm(f => ({ ...f, phone: e.target.value })); setDirty(true) }} /></div></div>
            <div className="row"><label className="label">الفريق</label><div className="field"><input value={form.team} readOnly /></div></div>
          </div>
          {dirty && <div className="savebar">
            <I.Info size={18} style={{ color: 'var(--amber)' }} />
            <span style={{ flex: 1, fontSize: 13 }}>لديك تغييرات غير محفوظة على ملفك.</span>
            <button className="btn btn-secondary btn-sm" onClick={() => setDirty(false)}>تجاهل</button>
            <button className="btn btn-primary btn-sm" disabled={saving} onClick={() => { setSaving(true); setTimeout(() => { setSaving(false); setDirty(false); toast('تم حفظ الملف الشخصي') }, 1100) }}>{saving ? <span className="spinner" /> : 'حفظ التغييرات'}</button>
          </div>}
        </div>
      </Panel>}

      {tab === TABS[2] && <Panel title="تغيير كلمة المرور" sub="خمس خطوات: كلمة مرور جديدة ثم التحقق" icon={<I.Status size={16} />}>
        <div className="steps" style={{ maxWidth: 520, marginBottom: 16 }}>
          {['كلمة المرور الجديدة', 'التحقق', 'تم'].map((s, i) => <span key={s} className={`step ${pwStep === i + 1 ? 'on' : pwStep > i + 1 ? 'done' : ''}`}>٠{i + 1} · {s}</span>)}
        </div>
        {pwStep === 1 && <div className="form" style={{ marginTop: 0, maxWidth: 420 }}>
          <div className="row"><label className="label">كلمة المرور الجديدة</label><div className="field"><input type="password" value={pw.a} onChange={e => setPw(p => ({ ...p, a: e.target.value }))} /></div></div>
          <div className="row"><label className="label">تأكيد كلمة المرور</label><div className="field"><input type="password" value={pw.b} onChange={e => setPw(p => ({ ...p, b: e.target.value }))} /></div></div>
          {err && <div className="banner error"><I.Info size={16} />{err}</div>}
          <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={() => { if (pw.a.length < 8) return setErr('كلمة المرور يجب أن تكون 8 أحرف على الأقل.'); if (pw.a !== pw.b) return setErr('كلمتا المرور غير متطابقتين.'); setErr(''); setPwStep(2) }}>التالي</button>
        </div>}
        {pwStep === 2 && <div className="form" style={{ marginTop: 0, maxWidth: 420 }}>
          <p className="caption">أرسلنا رمز تحقق إلى بريدك <b dir="ltr">{user.email}</b>.</p>
          <div className="field" style={{ justifyContent: 'center' }}><input dir="ltr" maxLength={6} placeholder="______" style={{ textAlign: 'center', letterSpacing: 8, fontSize: 18 }} value={code} onChange={e => setCode(e.target.value)} /></div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary" disabled={code.length < 4} onClick={() => { setPwStep(3); setTimeout(() => setPwStep(4), 1200) }}>تأكيد الرمز</button>
            <button className="btn btn-secondary" onClick={() => toast('تم إعادة إرسال الرمز')}>إعادة إرسال</button>
          </div>
        </div>}
        {pwStep === 3 && <div className="result"><div className="ok"><span className="spinner dark" style={{ width: 26, height: 26 }} /></div><h3>جارٍ تغيير كلمة المرور…</h3></div>}
        {pwStep === 4 && <div className="result"><div className="ok"><I.Check size={26} /></div><h3>تم تغيير كلمة المرور</h3><p>سُجّل خروجك من باقي الأجهزة للحفاظ على أمان حسابك.</p>
          <button className="btn btn-primary btn-sm" style={{ marginTop: 14 }} onClick={() => { setPwStep(1); setPw({ a: '', b: '' }); setCode('') }}>تم</button></div>}
      </Panel>}
    </AdminLayout>
  )
}

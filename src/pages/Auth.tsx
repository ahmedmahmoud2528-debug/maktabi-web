import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { I } from '../components/Icons'
import { useStore } from '../store'

/* ---------- الشِل المشترك ---------- */
function Hero({ title, sub }: { title?: string; sub?: string }) {
  return (
    <div className="auth-hero">
      <img src="./assets/logo.svg" alt="مكتبي" style={{ width: 132, filter: 'brightness(0) invert(1)', marginBottom: 40 }} />
      <h2>{title ?? 'مكتبك الافتراضي، منظّم وواضح'}</h2>
      <p>{sub ?? 'طوابق وغرف ومكاتب، مع حضور مباشر للفريق وتفاعل حي داخل المساحة.'}</p>
      <div className="pills"><span>Device Check</span><span>Live Interaction</span><span>Workspace</span></div>
    </div>
  )
}
function Shell({ children, hero }: { children: ReactNode; hero?: { title?: string; sub?: string } }) {
  return <div className="auth"><div className="auth-form">{children}</div><Hero {...hero} /></div>
}

/* ---------- سبلاش ---------- */
export function Splash() {
  const nav = useNavigate()
  useEffect(() => { const t = setTimeout(() => nav('/onboarding'), 1600); return () => clearTimeout(t) }, [nav])
  return (
    <div style={{ height: '100vh', display: 'grid', placeItems: 'center', background: 'radial-gradient(700px 700px at 50% 40%, rgba(20,184,166,.28), transparent 60%), #0b1220' }}>
      <div style={{ textAlign: 'center', animation: 'pop-in 500ms var(--ease) both' }}>
        <img src="./assets/logo.svg" alt="مكتبي" style={{ width: 168, filter: 'brightness(0) invert(1)' }} />
        <p style={{ color: 'rgba(255,255,255,.6)', marginTop: 14, fontSize: 14 }}>جارٍ تجهيز مساحتك…</p>
        <div style={{ width: 160, height: 4, borderRadius: 99, background: 'rgba(255,255,255,.12)', margin: '18px auto 0', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'var(--teal)', animation: 'load 1.5s var(--ease) forwards' }} />
        </div>
      </div>
      <style>{'@keyframes load { from { width: 0 } to { width: 100% } }'}</style>
    </div>
  )
}

/* ---------- أونبوردنج ---------- */
const STEPS = [
  { t: 'مكتب افتراضي يشبه مكتبك الحقيقي', d: 'طوابق وغرف ومكاتب — تشوف فريقك وتتحرك بينهم بضغطة.', icon: <I.Building size={30} /> },
  { t: 'تحدّث بالصوت كأنك جنبهم', d: 'اقترب من زميلك ليسمعك، وادخل غرفة ليصبح الحديث خاصًا بمن فيها.', icon: <I.Mic size={30} /> },
  { t: 'حضور وتقارير بلا متابعة يدوية', d: 'ساعة الدوام تعمل تلقائيًا، والتقارير جاهزة في أي وقت.', icon: <I.Clock size={30} /> },
]
export function Onboarding() {
  const nav = useNavigate()
  const [i, setI] = useState(0)
  const s = STEPS[i]
  return (
    <Shell hero={{ title: s.t, sub: s.d }}>
      <img src="./assets/logo.svg" alt="مكتبي" style={{ width: 132, marginBottom: 32 }} />
      <div key={i} className="card-in">
        <span className="avatar teal" style={{ width: 60, height: 60, borderRadius: 18 }}>{s.icon}</span>
        <h1 style={{ marginTop: 18 }}>{s.t}</h1>
        <p className="lead">{s.d}</p>
      </div>
      <div style={{ display: 'flex', gap: 6, margin: '28px 0' }}>
        {STEPS.map((_, n) => <span key={n} style={{ height: 4, flex: n === i ? 2 : 1, borderRadius: 99, background: n === i ? 'var(--teal)' : 'var(--slate-200)', transition: 'all var(--t) var(--ease)' }} />)}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn btn-primary" onClick={() => i < 2 ? setI(i + 1) : nav('/')}>{i < 2 ? 'التالي' : 'ابدأ الآن'}</button>
        <button className="btn btn-secondary" onClick={() => nav('/')}>تخطٍّ</button>
      </div>
    </Shell>
  )
}

/* ---------- إنشاء حساب ---------- */
export function SignUp() {
  const nav = useNavigate()
  const [f, setF] = useState({ name: '', email: '', pw: '' })
  return (
    <Shell>
      <img src="./assets/logo.svg" alt="مكتبي" style={{ width: 132, marginBottom: 28 }} />
      <h1>أنشئ حسابك</h1>
      <p className="lead">ابدأ تجربة مجانية 14 يومًا — بدون بطاقة.</p>
      <form className="form" onSubmit={(e: FormEvent) => { e.preventDefault(); nav('/trial') }}>
        <div className="row"><label className="label">الاسم الكامل</label><div className="field"><input value={f.name} onChange={e => setF({ ...f, name: e.target.value })} placeholder="أحمد هشيمة" /></div></div>
        <div className="row"><label className="label">بريد العمل</label><div className="field"><I.Mail className="icon-sm" style={{ color: 'var(--text-3)' }} /><input dir="ltr" style={{ textAlign: 'right' }} value={f.email} onChange={e => setF({ ...f, email: e.target.value })} placeholder="name@company.com" /></div></div>
        <div className="row"><label className="label">كلمة المرور</label><div className="field"><input type="password" value={f.pw} onChange={e => setF({ ...f, pw: e.target.value })} placeholder="8 أحرف على الأقل" /></div></div>
        <button className="btn btn-primary" disabled={!f.name || !f.email.includes('@') || f.pw.length < 8}>إنشاء الحساب</button>
        <p className="caption" style={{ textAlign: 'center' }}>لديك حساب؟ <a className="link" onClick={() => nav('/')}>تسجيل الدخول</a></p>
      </form>
    </Shell>
  )
}

/* ---------- نسيت كلمة المرور ---------- */
export function Forgot() {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  return (
    <Shell>
      <img src="./assets/logo.svg" alt="مكتبي" style={{ width: 132, marginBottom: 28 }} />
      {!sent ? <>
        <h1>نسيت كلمة المرور؟</h1>
        <p className="lead">أدخل بريدك وسنرسل لك رابط إعادة التعيين.</p>
        <form className="form" onSubmit={(e: FormEvent) => { e.preventDefault(); setSent(true) }}>
          <div className="row"><label className="label">البريد الإلكتروني</label><div className="field"><I.Mail className="icon-sm" style={{ color: 'var(--text-3)' }} /><input dir="ltr" style={{ textAlign: 'right' }} value={email} onChange={e => setEmail(e.target.value)} placeholder="name@company.com" /></div></div>
          <button className="btn btn-primary" disabled={!email.includes('@')}>إرسال الرابط</button>
          <button type="button" className="btn btn-secondary" onClick={() => nav('/')}>رجوع لتسجيل الدخول</button>
        </form>
      </> : <div className="result card-in"><div className="ok"><I.Mail size={26} /></div><h3>تفقّد بريدك</h3><p>أرسلنا رابط إعادة التعيين إلى <b dir="ltr">{email}</b>.</p>
        <button className="btn btn-primary" style={{ marginTop: 18 }} onClick={() => nav('/')}>العودة لتسجيل الدخول</button></div>}
    </Shell>
  )
}

/* ---------- الدخول بدعوة ---------- */
export function InviteLogin() {
  const nav = useNavigate()
  return (
    <Shell>
      <img src="./assets/logo.svg" alt="مكتبي" style={{ width: 132, marginBottom: 28 }} />
      <h1>لديك دعوة للانضمام</h1>
      <p className="lead">دُعيت للانضمام إلى مساحة عمل «شركة قمرة السعادة».</p>
      <div className="card card-in" style={{ padding: 18, marginTop: 22 }}>
        <div className="detail-row"><span>مساحة العمل</span><b>شركة قمرة السعادة</b></div>
        <div className="detail-row"><span>الدور المدعو إليه</span><b>عضو فريق</b></div>
        <div className="detail-row"><span>الغرفة</span><b>قاعة الاجتماعات</b></div>
        <div className="detail-row"><span>أرسلها</span><b>نورة العامري — مشرف</b></div>
        <div className="detail-row"><span>حالة الدعوة</span><b className="pill green">صالحة حتى 12 فبراير</b></div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
        <button className="btn btn-primary" onClick={() => nav('/floor')}>قبول الدعوة</button>
        <button className="btn btn-secondary" onClick={() => nav('/')}>تسجيل الدخول بحساب آخر</button>
      </div>
    </Shell>
  )
}

/* ---------- بدء التجربة ---------- */
export function Trial() {
  const nav = useNavigate()
  return (
    <Shell hero={{ title: 'تجربتك بدأت 🎉', sub: '14 يومًا كاملة بكل مزايا باقة الفريق.' }}>
      <img src="./assets/logo.svg" alt="مكتبي" style={{ width: 132, marginBottom: 28 }} />
      <div className="result card-in"><div className="ok"><I.Check size={26} /></div><h3>تم إنشاء حسابك</h3><p>تجربتك المجانية فعّالة حتى 5 أكتوبر 2026.</p></div>
      <div className="card" style={{ padding: 16, marginTop: 18 }}>
        {['حتى 25 عضو', '3 طوابق', 'تسجيلات 30 يومًا', 'تقارير الحضور', 'المساعد الذكي'].map(f => <div key={f} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '4px 0', fontSize: 13 }}><I.Check size={15} style={{ color: 'var(--teal)' }} />{f}</div>)}
      </div>
      <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => nav('/create-workspace')}>إنشاء مساحة العمل</button>
    </Shell>
  )
}

/* ---------- إنشاء مساحة عمل ---------- */
const KINDS = ['شركة', 'فريق صغير', 'مشروع ناشئ', 'فريق مستقل']
export function CreateWorkspace() {
  const nav = useNavigate()
  const { toast } = useStore()
  const [f, setF] = useState({ name: '', slug: '', kind: 'شركة', domain: '' })
  return (
    <Shell>
      <img src="./assets/logo.svg" alt="مكتبي" style={{ width: 132, marginBottom: 24 }} />
      <h1>إنشاء مساحة عمل جديدة</h1>
      <p className="lead">ابدأ بإعداد مساحة عمل لفريقك.</p>
      <div className="card card-in" style={{ padding: 20, marginTop: 20 }}>
        <div className="form" style={{ marginTop: 0 }}>
          <div className="row"><label className="label">اسم الشركة أو الفريق</label><div className="field"><input value={f.name} onChange={e => setF({ ...f, name: e.target.value })} placeholder="مثال: شركة الأفق للتقنية" /></div></div>
          <div className="row"><label className="label">رابط مساحة العمل</label><div className="field"><span className="caption" dir="ltr">maktabi.app/</span><input dir="ltr" style={{ textAlign: 'right' }} value={f.slug} onChange={e => setF({ ...f, slug: e.target.value })} placeholder="qomra-team" /></div>
            <span className="hint">سيظهر في رابط دخول فريقك إلى مساحة العمل.</span></div>
          <div className="row"><label className="label">نوع مساحة العمل</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {KINDS.map(k => <button key={k} className={`chip ${f.kind === k ? 'on' : ''}`} style={{ height: 42, justifyContent: 'center' }} onClick={() => setF({ ...f, kind: k })}>{k}</button>)}
            </div>
          </div>
          <div className="row"><label className="label">دومين الشركة (اختياري)</label><div className="field"><input dir="ltr" style={{ textAlign: 'right' }} value={f.domain} onChange={e => setF({ ...f, domain: e.target.value })} placeholder="company.com" /></div>
            <span className="hint">اختياري — يمكنك إضافته لاحقًا لتسهيل انضمام أعضاء الشركة.</span></div>
          <button className="btn btn-primary" disabled={!f.name.trim()} onClick={() => { toast('تم إنشاء مساحة العمل', f.name); nav('/floor') }}>إنشاء مساحة العمل</button>
        </div>
      </div>
    </Shell>
  )
}

/* ---------- حالة طلب الانضمام ---------- */
export function JoinRequest() {
  const nav = useNavigate()
  const [state, setState] = useState<'pending' | 'accepted' | 'rejected'>('pending')
  const map = {
    pending: { icon: <I.Clock size={26} />, t: 'طلبك قيد المراجعة', d: 'أرسلنا طلب انضمامك إلى مشرف «شركة قمرة السعادة». سيصلك إشعار فور الرد.', pill: 'بانتظار الموافقة' },
    accepted: { icon: <I.Check size={26} />, t: 'تم قبول طلبك', d: 'أهلاً بك في «شركة قمرة السعادة» — يمكنك الدخول الآن.', pill: 'مقبول' },
    rejected: { icon: <I.Close size={26} />, t: 'تم رفض الطلب', d: 'لم يوافق المشرف على طلب الانضمام. يمكنك التواصل معه أو طلب دعوة مباشرة.', pill: 'مرفوض' },
  }[state]
  return (
    <Shell>
      <img src="./assets/logo.svg" alt="مكتبي" style={{ width: 132, marginBottom: 28 }} />
      <div className="result card-in"><div className="ok">{map.icon}</div><h3>{map.t}</h3><p>{map.d}</p>
        <span className={`pill ${state === 'accepted' ? 'green' : state === 'rejected' ? 'red' : 'amber'}`} style={{ marginTop: 12 }}>{map.pill}</span></div>
      <div className="card" style={{ padding: '0 16px', marginTop: 18 }}>
        <div className="detail-row"><span>مساحة العمل</span><b>شركة قمرة السعادة</b></div>
        <div className="detail-row"><span>بريدك</span><b dir="ltr">ahmed@qomra.app</b></div>
        <div className="detail-row"><span>تاريخ الطلب</span><b>اليوم</b></div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
        {state === 'accepted' ? <button className="btn btn-primary" onClick={() => nav('/floor')}>الدخول إلى المكتب</button>
          : <button className="btn btn-primary" onClick={() => setState(state === 'pending' ? 'accepted' : 'pending')}>{state === 'pending' ? 'محاكاة القبول' : 'إعادة إرسال الطلب'}</button>}
        <button className="btn btn-secondary" onClick={() => nav('/workspaces')}>مساحات العمل</button>
      </div>
    </Shell>
  )
}

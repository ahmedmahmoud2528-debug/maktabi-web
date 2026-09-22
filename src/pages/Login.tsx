import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { I } from '../components/Icons'

function Hero() {
  return (
    <div className="auth-hero">
      <img src="./assets/logo.svg" alt="مكتبي" style={{ width: 132, filter: 'brightness(0) invert(1)', marginBottom: 40 }} />
      <h2>مكتبك الافتراضي، منظّم وواضح</h2>
      <p>طوابق وغرف ومكاتب، مع حضور مباشر للفريق وتفاعل حي داخل المساحة.</p>
      <div className="pills"><span>Device Check</span><span>Live Interaction</span><span>Workspace</span></div>
    </div>
  )
}

export default function Login() {
  const nav = useNavigate()
  const [email, setEmail] = useState('ahmed@company.com')
  const [pw, setPw] = useState('••••••••')
  const [show, setShow] = useState(false)
  const submit = (e: FormEvent) => { e.preventDefault(); nav('/workspaces') }
  return (
    <div className="auth">
      <div className="auth-form">
        <img src="./assets/logo.svg" alt="مكتبي" style={{ width: 132, marginBottom: 32 }} />
        <h1>مرحبًا بعودتك</h1>
        <p className="lead">سجّل دخولك للوصول إلى مساحات عملك.</p>
        <form className="form" onSubmit={submit}>
          <div className="row">
            <label className="label">البريد الإلكتروني</label>
            <div className="field"><I.Mail className="icon-sm" style={{ color: 'var(--text-3)' }} /><input value={email} onChange={e => setEmail(e.target.value)} placeholder="name@company.com" dir="ltr" style={{ textAlign: 'right' }} /></div>
          </div>
          <div className="row">
            <label className="label">كلمة المرور</label>
            <div className="field"><input type={show ? 'text' : 'password'} value={pw} onChange={e => setPw(e.target.value)} /><button type="button" className="btn-ghost" onClick={() => setShow(s => !s)} aria-label="إظهار"><I.Eye className="icon-sm" style={{ color: 'var(--text-3)' }} /></button></div>
          </div>
          <div className="actions">
            <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}><input type="checkbox" defaultChecked /> تذكّرني</label>
            <a className="link" href="#/forgot">نسيت كلمة المرور؟</a>
          </div>
          <button className="btn btn-primary" type="submit">تسجيل الدخول</button>
          <p className="caption" style={{ textAlign: 'center' }}>ليس لديك حساب؟ <a className="link" href="#/signup">أنشئ حسابًا</a></p>
        </form>
      </div>
      <Hero />
    </div>
  )
}

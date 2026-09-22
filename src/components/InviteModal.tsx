import { useState } from 'react'
import { EXPIRY, ROLES, ROOM_NAMES } from '../data'
import { useStore } from '../store'
import { I } from './Icons'

type Mode = 'email' | 'link'

export function InviteModal() {
  const { setInvite, toast } = useStore()
  const [mode, setMode] = useState<Mode>('email')
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<string | null>(null)
  const [room, setRoom] = useState<string | null>(null)
  const [expiry, setExpiry] = useState('٧ أيام')
  const [status, setStatus] = useState<'idle' | 'sending' | 'error' | 'done'>('idle')
  const [confirmClose, setConfirmClose] = useState(false)

  const dirty = email !== '' || role !== null || room !== null
  const close = () => setInvite(false)
  const tryClose = () => (dirty && status !== 'done' ? setConfirmClose(true) : close())
  const reset = (m: Mode) => { setMode(m); setStep(1); setRole(null); setRoom(null); setStatus('idle') }
  const finish = () => {
    setStatus('sending')
    window.setTimeout(() => setStatus('done'), 1200)
  }

  const steps = mode === 'email' ? ['البريد الإلكتروني', 'الدور', 'الغرفة'] : ['الدور', 'الغرفة', 'الصلاحية']
  const valid = (mode === 'email' ? (email.includes('@')) : true)

  return (
    <div className="scrim" onMouseDown={e => { if (e.target === e.currentTarget) tryClose() }}>
      <div className="modal" role="dialog" aria-modal>
        <div className="modal-header">
          <span className="tile">{mode === 'email' ? <I.Mail size={20} /> : <I.Link size={20} />}</span>
          <div><div className="modal-title">دعوة عضو</div><div className="modal-sub">{mode === 'email' ? 'أرسل دعوة وحدد الغرفة التي يمكن الوصول إليها' : 'أنشئ رابط دعوة وحدد الغرفة ومدة الصلاحية'}</div></div>
          <button className="btn btn-ghost btn-icon close" onClick={tryClose} aria-label="إغلاق"><I.Close /></button>
        </div>
        <div className="divider" />
        {status !== 'done' && (
          <div className="tabs" style={{ justifyContent: 'flex-start' }}>
            <button className={`chip ${mode === 'email' ? 'on' : ''}`} onClick={() => reset('email')}><I.Mail size={14} /> البريد الإلكتروني</button>
            <button className={`chip ${mode === 'link' ? 'on' : ''}`} onClick={() => reset('link')}><I.Link size={14} /> رابط دعوة</button>
          </div>
        )}

        {status === 'done' ? (
          <Done mode={mode} email={email} role={role!} room={room!} expiry={expiry} onAgain={() => { setEmail(''); reset(mode) }} onClose={close} onCopy={() => toast('تم نسخ الرابط', 'شارك الرابط مع الشخص المدعو.')} />
        ) : (
          <>
            <div className="steps" style={{ margin: '14px 0' }}>
              {steps.map((s, i) => <span className={`step ${step === i + 1 ? 'on' : step > i + 1 ? 'done' : ''}`} key={s}>{['٠١','٠٢','٠٣','٠٤'][i]} · {s}</span>)}
            </div>
            {status === 'error' && <div className="banner error" style={{ marginBottom: 12 }}><I.Info size={16} />{mode === 'email' ? 'تعذر إرسال الدعوة. تحقق من البيانات وحاول مرة أخرى.' : 'تعذر إنشاء الرابط. حاول مرة أخرى.'}</div>}

            {mode === 'email' && step === 1 && (
              <div className="form" style={{ marginTop: 0 }}>
                <div className="row"><label className="label">البريد الإلكتروني</label><div className="field"><input dir="ltr" style={{ textAlign: 'right' }} placeholder="name@company.com" value={email} onChange={e => setEmail(e.target.value)} autoFocus /></div></div>
                <p className="hint">سنرسل الدعوة إلى هذا البريد. في الخطوة التالية اختر الدور ثم الغرفة.</p>
              </div>
            )}
            {((mode === 'email' && step === 2) || (mode === 'link' && step === 1)) && (
              <Options label={mode === 'email' ? 'اختر الدور' : 'اختر دور صاحب الرابط'} items={ROLES} value={role} onPick={v => { setRole(v); setStep(s => s + 1) }} />
            )}
            {((mode === 'email' && step === 3) || (mode === 'link' && step === 2)) && (
              <Options label="اختر الغرفة التي يمكنه الوصول إليها" items={ROOM_NAMES} value={room} onPick={v => { setRoom(v); if (mode === 'link') setStep(3) }} />
            )}
            {mode === 'link' && step === 3 && (
              <>
                <Options label="مدة صلاحية الرابط" items={EXPIRY} value={expiry} onPick={setExpiry} />
                <p className="hint" style={{ marginTop: 10 }}>الرابط صالح لمستخدم واحد وينتهي تلقائيًا بعد المدة المحددة.</p>
              </>
            )}

            <div className="divider" />
            <div className="modal-footer">
              {(() => {
                const last = step === 3
                const canNext = mode === 'email' ? (step === 1 ? valid : step === 2 ? !!role : !!room) : (step === 1 ? !!role : step === 2 ? !!room : true)
                const label = last ? (mode === 'email' ? 'إرسال الدعوة' : 'إنشاء الرابط') : 'التالي'
                return <button className="btn btn-primary" disabled={!canNext || status === 'sending'} onClick={() => last ? finish() : setStep(s => s + 1)}>{status === 'sending' ? (mode === 'email' ? 'جارٍ الإرسال…' : 'جارٍ الإنشاء…') : label}</button>
              })()}
              {step > 1 ? <button className="btn btn-secondary" onClick={() => { setStatus('idle'); setStep(s => s - 1) }}>السابق</button> : <button className="btn btn-secondary" onClick={tryClose}>إلغاء</button>}
              {status === 'sending' && <button className="btn btn-ghost" onClick={() => setStatus('error')} title="محاكاة فشل">محاكاة خطأ</button>}
            </div>
          </>
        )}
      </div>
      {confirmClose && (
        <div className="scrim" onMouseDown={e => e.stopPropagation()}>
          <div className="modal" style={{ width: 440 }}>
            <div className="modal-header"><span className="tile" style={{ background: '#fff7ed', color: '#c2410c' }}><I.Info size={20} /></span><div><div className="modal-title">لديك بيانات دعوة غير مكتملة</div><div className="modal-sub">هل تريد إغلاق النافذة وتجاهلها؟</div></div></div>
            <div className="modal-footer" style={{ marginTop: 20 }}>
              <button className="btn btn-danger" onClick={close}>تجاهل وإغلاق</button>
              <button className="btn btn-secondary" onClick={() => setConfirmClose(false)}>متابعة التعديل</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Options({ label, items, value, onPick }: { label: string; items: string[]; value: string | null; onPick: (v: string) => void }) {
  return (
    <div>
      <div className="label" style={{ marginBottom: 8 }}>{label}</div>
      <div className="opt-list">{items.map(it => <button className={`opt ${value === it ? 'on' : ''}`} key={it} onClick={() => onPick(it)}>{it}{value === it && <I.Check size={16} />}</button>)}</div>
    </div>
  )
}

function Done({ mode, email, role, room, expiry, onAgain, onClose, onCopy }: { mode: Mode; email: string; role: string; room: string; expiry: string; onAgain: () => void; onClose: () => void; onCopy: () => void }) {
  return (
    <>
      <div className="result"><div className="ok"><I.Check size={26} /></div><h3>{mode === 'email' ? 'تم إرسال الدعوة بنجاح' : 'تم إنشاء رابط الدعوة'}</h3><p>{mode === 'email' ? `تم إرسال الدعوة إلى: ${email}` : 'انسخ الرابط وشاركه مع الشخص المدعو — الرابط صالح لمستخدم واحد.'}</p></div>
      {mode === 'link' && <div className="field" style={{ margin: '12px 0' }}><input readOnly value="maktabi.app/invite/x8K29m" dir="ltr" /><button className="btn-ghost" onClick={onCopy} aria-label="نسخ"><I.Copy size={18} style={{ color: 'var(--text-2)' }} /></button></div>}
      <div className="card" style={{ padding: '0 16px', marginTop: 8 }}>
        <div className="detail-row"><span>الدور</span><b>{role}</b></div>
        <div className="detail-row"><span>الغرفة</span><b>{room}</b></div>
        {mode === 'link' && <div className="detail-row"><span>صلاحية الرابط</span><b>{expiry}</b></div>}
      </div>
      <div className="divider" />
      <div className="modal-footer">
        {mode === 'email' ? <button className="btn btn-primary" onClick={onClose}>تم</button> : <button className="btn btn-primary" onClick={onCopy}>نسخ الرابط</button>}
        <button className="btn btn-secondary" onClick={onAgain}>{mode === 'email' ? 'إرسال دعوة أخرى' : 'إنشاء رابط جديد'}</button>
        {mode === 'link' && <button className="btn btn-ghost" style={{ color: 'var(--red)' }} onClick={onClose}>إلغاء الرابط</button>}
      </div>
    </>
  )
}

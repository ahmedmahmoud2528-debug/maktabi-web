import { useNavigate } from 'react-router-dom'
import { WORKSPACES } from '../data'
import { useStore } from '../store'

const STATUS = { active: ['نشطة', 'active'], pending: ['بانتظار الموافقة', 'pending'], expired: ['انتهى الاشتراك', 'expired'] } as const

export default function Workspaces() {
  const nav = useNavigate()
  const { toast } = useStore()
  const enter = (id: string, status: string) => {
    if (status === 'active') nav('/floor')
    else if (status === 'pending') toast('طلبك بانتظار الموافقة', 'سيصلك إشعار فور قبول المشرف لطلب الانضمام.')
    else toast('انتهى اشتراك هذه المساحة', 'تواصل مع مالك المساحة لتجديد الاشتراك.')
  }
  return (
    <div className="ws-page">
      <div className="ws-top">
        <img src="./assets/logo.svg" alt="مكتبي" style={{ width: 110 }} />
        <button className="btn btn-ghost btn-sm" onClick={() => nav('/')}>تسجيل الخروج</button>
      </div>
      <div className="ws-body">
        <h1>اختر مساحة العمل</h1>
        <p className="muted" style={{ marginTop: 6 }}>اختر المكان الذي تريد الدخول إليه، أو أنشئ مساحة عمل جديدة لفريقك.</p>
        <div className="ws-stats">
          {[['مساحات متاحة', '1', 'جاهزة للدخول'], ['بانتظار الموافقة', '1', 'المشرف يراجع طلبك'], ['تحتاج انتباه', '1', 'اشتراك منتهٍ أو معلّق']].map(([t, n, s]) => (
            <div className="card ws-stat" key={t}><span className="caption">{t}</span><div className="n">{n}</div><span className="caption">{s}</span></div>
          ))}
        </div>
        {WORKSPACES.map(w => (
          <div className="card ws-card" key={w.id} role="button" onClick={() => enter(w.id, w.status)}>
            <span className={`avatar ${w.status === 'active' ? 'teal' : 'dark'}`}>{w.initial}</span>
            <div className="info">
              <div className="name">{w.name} <span className={`status ${STATUS[w.status][1]}`}>{STATUS[w.status][0]}</span></div>
              <div className="meta"><span>{w.kind}</span>·<span className="chip soft" style={{ height: 22, fontSize: 11 }}>{w.role}</span>·<span dir="ltr">{w.domain}</span></div>
            </div>
            <button className={`btn btn-sm ${w.status === 'active' ? 'btn-primary' : 'btn-secondary'}`} onClick={e => { e.stopPropagation(); enter(w.id, w.status) }}>دخول</button>
          </div>
        ))}
        <div className="ws-cta">
          <div><h3>ابدأ مساحة عمل جديدة</h3><p>أنشئ مساحة عمل لفريقك: طوابق وغرف ومكاتب وحضور مباشر.</p></div>
          <button className="btn btn-primary" onClick={() => toast('إنشاء مساحة عمل', 'هذه الخطوة ستُضاف في التحديث القادم.')}>إنشاء مساحة عمل</button>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { AdminLayout, Confirm, Empty, PageHead, Panel, Stat, Tabs } from '../components/Admin'
import { I } from '../components/Icons'
import { useStore } from '../store'

const TABS = ['نظرة عامة', 'الباقات', 'طرق الدفع', 'الفواتير', 'بيانات الفوترة']

const PLANS = [
  { id: 'starter', name: 'المبتدئ', price: '0', per: 'مجانًا', feats: ['حتى 5 أعضاء', 'طابق واحد', 'محادثات أساسية', 'تسجيلات 3 أيام'] },
  { id: 'team', name: 'الفريق', price: '540', per: 'ر.س / شهريًا · 12 عضو', feats: ['حتى 25 عضو', '3 طوابق', 'تسجيلات 30 يوم', 'تقارير الحضور', 'المساعد الذكي'], current: true },
  { id: 'business', name: 'الأعمال', price: '1,200', per: 'ر.س / شهريًا', feats: ['أعضاء بلا حد', 'طوابق بلا حد', 'تسجيلات 180 يوم', 'تقارير متقدمة', 'دعم مخصص'] },
]

const INVOICES = [
  { id: 'INV-2026-0101', date: '15 سبتمبر 2026', amount: '540 ر.س', state: 'مدفوعة' },
  { id: 'INV-2026-0092', date: '15 أغسطس 2026', amount: '540 ر.س', state: 'مدفوعة' },
  { id: 'INV-2026-0081', date: '15 يوليو 2026', amount: '540 ر.س', state: 'مدفوعة' },
  { id: 'INV-2026-0074', date: '15 يونيو 2026', amount: '495 ر.س', state: 'فشل الدفع' },
]

export default function Billing() {
  const [tab, setTab] = useState(TABS[0])
  const { toast } = useStore()
  const [plan, setPlan] = useState('team')
  const [confirmPlan, setConfirmPlan] = useState<string | null>(null)
  const [paying, setPaying] = useState(false)
  const [addCard, setAddCard] = useState(false)
  const [invoice, setInvoice] = useState<typeof INVOICES[0] | null>(null)

  return (
    <AdminLayout>
      <PageHead title="الفوترة والاشتراك" sub="إدارة اشتراك مساحة العمل، طرق الدفع، الفواتير وبيانات الفوترة" />
      <Tabs items={TABS} value={tab} onChange={setTab} />

      {tab === TABS[0] && <>
        <div className="grid g2">
          <Panel title="الباقة الحالية" icon={<I.Card size={16} />} className="plan-now" actions={<span className="pill green">نشط</span>}>
            <h2 style={{ fontSize: 22, fontWeight: 700 }}>الفريق</h2>
            <p className="caption" style={{ marginTop: 2 }}>540 ر.س / شهريًا · 12 عضو</p>
            <div className="card" style={{ padding: '0 14px', marginTop: 14 }}>
              <div className="detail-row"><span>التجديد القادم</span><b>15 أكتوبر 2026</b></div>
              <div className="detail-row"><span>التجديد التلقائي</span><b className="pill green">مفعّل</b></div>
              <div className="detail-row"><span>دورة الفوترة</span><b>شهري</b></div>
              <div className="detail-row"><span>قيمة التجديد</span><b>540 ر.س</b></div>
            </div>
            <button className="btn btn-primary btn-sm" style={{ marginTop: 14, alignSelf: 'flex-start' }} onClick={() => setTab(TABS[1])}><I.ChevronR size={15} />إدارة الباقة</button>
          </Panel>
          <Panel title="طريقة الدفع" icon={<I.Card size={16} />}>
            <div className="card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="pill">VISA</span>
              <div style={{ flex: 1 }}><b dir="ltr">•••• 4242</b><div className="caption">تنتهي في 08/28</div></div>
              <span className="pill teal">أساسية</span>
            </div>
            <button className="btn btn-secondary btn-sm" style={{ marginTop: 14 }} onClick={() => setTab(TABS[2])}>إدارة طرق الدفع</button>
          </Panel>
        </div>
        <div style={{ height: 14 }} />
        <Panel title="استخدام الاشتراك" sub="حدود باقة الفريق للدورة الحالية" icon={<I.Status size={16} />}>
          <div className="grid g4">
            {[['الأعضاء', 12, 25, '12 من 25', 'متبقي 13 عضو'], ['التخزين', 6, 20, '6 GB من 20 GB', 'متبقي 14 GB'], ['رصيد الذكاء الاصطناعي', 420, 1000, '420 من 1000', 'متبقي 580 وحدة'], ['مساحة التسجيلات', 48, 100, '48 GB من 100 GB', 'متبقي 52 GB']].map(([t, v, max, label, sub], i) => (
              <div className="card" style={{ padding: 14 }} key={t as string}>
                <div className="caption">{t}</div>
                <div style={{ fontSize: 16, fontWeight: 700, margin: '6px 0 8px' }}>{label}</div>
                <div className={`meter ${(v as number) / (max as number) > 0.8 ? 'amber' : ''}`}><i style={{ width: `${((v as number) / (max as number)) * 100}%`, transitionDelay: `${i * 80}ms` }} /></div>
                <div className="caption" style={{ marginTop: 6 }}>{sub}</div>
              </div>
            ))}
          </div>
        </Panel>
        <div style={{ height: 14 }} />
        <div className="grid g2">
          <Panel title="آخر فاتورة" icon={<I.Card size={16} />}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1 }}><b dir="ltr">{INVOICES[0].id}</b><div className="caption">{INVOICES[0].date} · {INVOICES[0].amount}</div></div>
              <span className="pill green">مدفوعة</span>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setInvoice(INVOICES[0])}>عرض التفاصيل</button>
              <button className="btn btn-ghost btn-sm" onClick={() => toast('تم تحميل الفاتورة', INVOICES[0].id)}>تحميل PDF</button>
            </div>
          </Panel>
          <Panel title="بيانات الفوترة" icon={<I.Building size={16} />}>
            <div className="card" style={{ padding: 14 }}><b>شركة قمرة السعادة لتقنية المعلومات</b><div className="caption" style={{ marginTop: 4 }}>الرياض · السعودية · الرقم الضريبي 3100•••••</div></div>
            <button className="btn btn-secondary btn-sm" style={{ marginTop: 14 }} onClick={() => setTab(TABS[4])}>تعديل بيانات الفوترة</button>
          </Panel>
        </div>
      </>}

      {tab === TABS[1] && <div className="grid g3">
        {PLANS.map(p => (
          <div className={`card plan-card card-in ${plan === p.id ? 'on' : ''}`} key={p.id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><h3 style={{ fontSize: 16, fontWeight: 700 }}>{p.name}</h3>{plan === p.id && <span className="pill teal">باقتك الحالية</span>}</div>
            <div className="price">{p.price} <small style={{ fontSize: 12, fontWeight: 400, color: 'var(--text-2)' }}>{p.per}</small></div>
            <ul>{p.feats.map(f => <li key={f}><I.Check size={14} style={{ color: 'var(--teal)' }} />{f}</li>)}</ul>
            <button className={`btn btn-sm ${plan === p.id ? 'btn-secondary' : 'btn-primary'}`} disabled={plan === p.id} onClick={() => setConfirmPlan(p.id)}>
              {plan === p.id ? 'الباقة الحالية' : PLANS.findIndex(x => x.id === p.id) > PLANS.findIndex(x => x.id === plan) ? 'الترقية لهذه الباقة' : 'التخفيض لهذه الباقة'}
            </button>
          </div>
        ))}
      </div>}

      {tab === TABS[2] && <>
        <Panel title="طرق الدفع" sub="البطاقات المحفوظة لتجديد الاشتراك" icon={<I.Card size={16} />} actions={<button className="btn btn-primary btn-sm" onClick={() => setAddCard(true)}><I.Plus size={15} />إضافة بطاقة</button>}>
          <div className="card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="pill">VISA</span>
            <div style={{ flex: 1 }}><b dir="ltr">•••• 4242</b><div className="caption">تنتهي في 08/28 · أحمد هشيمة</div></div>
            <span className="pill teal">أساسية</span>
            <button className="btn btn-ghost btn-sm" onClick={() => toast('حذف البطاقة', 'لا يمكن حذف البطاقة الأساسية.')}>حذف</button>
          </div>
        </Panel>
      </>}

      {tab === TABS[3] && <Panel title="الفواتير" sub="كل فواتير مساحة العمل" icon={<I.Card size={16} />}>
        <table className="tbl">
          <thead><tr><th>رقم الفاتورة</th><th>التاريخ</th><th>المبلغ</th><th>الحالة</th><th /></tr></thead>
          <tbody>{INVOICES.map((v, i) => <tr key={v.id} className="row-in" style={{ animationDelay: `${i * 30}ms` }}>
            <td dir="ltr" style={{ textAlign: 'right' }}><b>{v.id}</b></td><td className="muted">{v.date}</td><td>{v.amount}</td>
            <td><span className={`pill ${v.state === 'مدفوعة' ? 'green' : 'red'}`}>{v.state}</span></td>
            <td><div style={{ display: 'flex', gap: 6 }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setInvoice(v)}>التفاصيل</button>
              {v.state === 'فشل الدفع' && <button className="btn btn-primary btn-sm" onClick={() => { setPaying(true); setTimeout(() => { setPaying(false); toast('تم دفع الفاتورة', v.id) }, 1300) }}>{paying ? <span className="spinner" /> : 'دفع الآن'}</button>}
            </div></td>
          </tr>)}</tbody>
        </table>
      </Panel>}

      {tab === TABS[4] && <Panel title="بيانات الفوترة" sub="تظهر هذه البيانات على كل فاتورة" icon={<I.Building size={16} />}>
        <div className="form" style={{ marginTop: 0 }}>
          <div className="grid g2">
            <div className="row"><label className="label">اسم الجهة</label><div className="field"><input defaultValue="شركة قمرة السعادة لتقنية المعلومات" /></div></div>
            <div className="row"><label className="label">الرقم الضريبي</label><div className="field"><input dir="ltr" style={{ textAlign: 'right' }} defaultValue="310012345600003" /></div></div>
            <div className="row"><label className="label">المدينة</label><div className="field"><input defaultValue="الرياض" /></div></div>
            <div className="row"><label className="label">الدولة</label><div className="field"><input defaultValue="السعودية" /></div></div>
          </div>
          <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={() => toast('تم حفظ بيانات الفوترة')}>حفظ التغييرات</button>
        </div>
      </Panel>}

      {confirmPlan && <Confirm title="تأكيد تغيير الباقة" body={`سيتم تحويل اشتراكك إلى باقة «${PLANS.find(p => p.id === confirmPlan)?.name}» وتطبيق الفرق على الفاتورة القادمة.`} confirmLabel="تأكيد ومتابعة الدفع"
        onConfirm={() => { const id = confirmPlan!; setConfirmPlan(null); setPaying(true); setTimeout(() => { setPaying(false); setPlan(id); toast('تم تغيير الباقة بنجاح', PLANS.find(p => p.id === id)?.name) }, 1300) }} onClose={() => setConfirmPlan(null)} />}
      {paying && <div className="scrim"><div className="modal" style={{ width: 380, textAlign: 'center' }}><div className="result"><div className="ok"><span className="spinner dark" style={{ width: 26, height: 26 }} /></div><h3>جارٍ تنفيذ عملية الدفع…</h3><p>لا تغلق الصفحة حتى تكتمل العملية.</p></div></div></div>}
      {addCard && (
        <div className="scrim" onMouseDown={e => { if (e.target === e.currentTarget) setAddCard(false) }}>
          <div className="modal" style={{ width: 480 }}>
            <div className="modal-header"><span className="tile"><I.Card size={20} /></span><div><div className="modal-title">إضافة بطاقة</div><div className="modal-sub">تُستخدم لتجديد الاشتراك تلقائيًا</div></div><button className="btn btn-ghost btn-icon close" onClick={() => setAddCard(false)}><I.Close size={18} /></button></div>
            <div className="divider" />
            <div className="form" style={{ marginTop: 0 }}>
              <div className="row"><label className="label">رقم البطاقة</label><div className="field"><input dir="ltr" style={{ textAlign: 'right' }} placeholder="0000 0000 0000 0000" /></div></div>
              <div className="grid g2">
                <div className="row"><label className="label">تاريخ الانتهاء</label><div className="field"><input dir="ltr" style={{ textAlign: 'right' }} placeholder="MM/YY" /></div></div>
                <div className="row"><label className="label">CVC</label><div className="field"><input dir="ltr" style={{ textAlign: 'right' }} placeholder="123" /></div></div>
              </div>
            </div>
            <div className="divider" />
            <div className="modal-footer"><button className="btn btn-primary" onClick={() => { setAddCard(false); toast('تمت إضافة البطاقة') }}>حفظ البطاقة</button><button className="btn btn-secondary" onClick={() => setAddCard(false)}>إلغاء</button></div>
          </div>
        </div>
      )}
      {invoice && (
        <div className="scrim" onMouseDown={e => { if (e.target === e.currentTarget) setInvoice(null) }}>
          <div className="modal" style={{ width: 520 }}>
            <div className="modal-header"><span className="tile"><I.Card size={20} /></span><div><div className="modal-title" dir="ltr" style={{ textAlign: 'right' }}>{invoice.id}</div><div className="modal-sub">{invoice.date}</div></div><button className="btn btn-ghost btn-icon close" onClick={() => setInvoice(null)}><I.Close size={18} /></button></div>
            <div className="divider" />
            <div className="card" style={{ padding: '0 14px' }}>
              <div className="detail-row"><span>الباقة</span><b>الفريق · شهري</b></div>
              <div className="detail-row"><span>عدد الأعضاء</span><b>12 عضو</b></div>
              <div className="detail-row"><span>الضريبة (15%)</span><b>70.4 ر.س</b></div>
              <div className="detail-row"><span>الإجمالي</span><b>{invoice.amount}</b></div>
              <div className="detail-row"><span>الحالة</span><b className={`pill ${invoice.state === 'مدفوعة' ? 'green' : 'red'}`}>{invoice.state}</b></div>
            </div>
            <div className="divider" />
            <div className="modal-footer"><button className="btn btn-primary" onClick={() => { toast('تم تحميل الفاتورة', invoice.id); setInvoice(null) }}>تحميل PDF</button><button className="btn btn-secondary" onClick={() => setInvoice(null)}>إغلاق</button></div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

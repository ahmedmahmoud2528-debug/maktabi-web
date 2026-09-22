import { useState } from 'react'
import { AdminLayout, Confirm, Filter, PageHead, Panel, RowMenu, Stat, Tabs } from '../components/Admin'
import { I } from '../components/Icons'
import { useStore } from '../store'

const TABS = ['نظرة عامة', 'دورة الحضور', 'الموافقات', 'سجل الدورات']
const RANGES = ['اليوم', 'هذا الأسبوع', 'هذا الشهر', 'آخر 3 أشهر', 'فترة مخصصة']

const HOURS = [7.4, 8.1, 8.6, 6.2, 3.4, 8.2, 7.9, 8.4, 5.1, 8.8, 8.3, 4.6, 7.7, 8.5, 8.9, 6.8, 8.1, 7.2, 8.6, 9.1]
const DAYS = ['٣ أغسطس', '٥ أغسطس', '٨ أغسطس', '١٠ أغسطس', '١٢ أغسطس', '١٦ أغسطس', '١٨ أغسطس', '٢٠ أغسطس', '٢٣ أغسطس', '٢٦ أغسطس']

const TEAMS = [{ n: 'فريق المنتج', m: 1, p: 98, d: 'محتسب 171.7 س · منفى 6 س 20 د · 0 بدون تسجيل' }, { n: 'فريق التصميم', m: 2, p: 93, d: 'محتسب 251.8 س · منفى 18 س 15 د · 0 إجازات' }, { n: 'الإدارة', m: 3, p: 88, d: 'محتسب 136.7 س · منفى 7 س 20 د' }]

type Row = { d: string; day: string; in: string; out: string; net: string; late: string; state: 'مكتمل' | 'تأخير' | 'إجازة' | 'بانتظار الموافقة' | 'نصف يوم' }
const ROWS: Row[] = [
  { d: '٢٦ أغسطس', day: 'الثلاثاء', in: '08:59', out: '17:04', net: '8 س 5 د', late: '—', state: 'مكتمل' },
  { d: '٢٥ أغسطس', day: 'الاثنين', in: '09:19', out: '17:06', net: '7 س 47 د', late: '19 د', state: 'تأخير' },
  { d: '٢٤ أغسطس', day: 'الأحد', in: '08:55', out: '13:10', net: '4 س 15 د', late: '—', state: 'نصف يوم' },
  { d: '٢١ أغسطس', day: 'الخميس', in: '—', out: '—', net: '—', late: '—', state: 'إجازة' },
  { d: '٢٠ أغسطس', day: 'الأربعاء', in: '09:02', out: '17:40', net: '8 س 38 د', late: '2 د', state: 'بانتظار الموافقة' },
]

const APPROVALS = [
  { who: 'محمد أمين', type: 'إذن تأخير', when: '٢٦ أغسطس · 30 دقيقة', reason: 'موعد طبي', state: 'معلّق' },
  { who: 'داليا سمير', type: 'إجازة يوم', when: '٢٨ أغسطس', reason: 'ظرف عائلي', state: 'معلّق' },
  { who: 'نور الشامي', type: 'انصراف مبكر', when: '٢٥ أغسطس · ساعة', reason: 'مشوار رسمي', state: 'مقبول' },
]

export default function Attendance() {
  const [tab, setTab] = useState(TABS[0])
  const [range, setRange] = useState('هذا الشهر')
  const [emp, setEmp] = useState('كل الموظفين')
  const [team, setTeam] = useState('كل الفرق')
  const { toast } = useStore()
  const [day, setDay] = useState<Row | null>(null)
  const [close, setClose] = useState(false)

  return (
    <AdminLayout>
      <PageHead title="الحضور والانصراف" sub="تابع حضور الموظفين وساعات العمل والتقارير حسب الفريق والفترة الزمنية"
        actions={<>
          <button className="btn btn-secondary btn-sm" onClick={() => toast('تصدير التقرير', 'سيُنزَّل ملف CSV بالبيانات الحالية.')}><I.Card size={15} />تصدير التقرير</button>
          <button className="btn btn-primary btn-sm" onClick={() => toast('سجل الحضور', 'تم فتح سجل الحضور اليومي.')}><I.People size={15} />سجل الحضور</button>
        </>} />
      <Tabs items={TABS} value={tab} onChange={setTab} />

      {tab === TABS[0] && <>
        <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
          <div className="tabbar" style={{ margin: 0, flex: '0 0 auto' }}>{RANGES.map(r => <button key={r} className={range === r ? 'on' : ''} onClick={() => setRange(r)}>{r}</button>)}</div>
          <div style={{ flex: 1 }} />
          <Filter label="الفريق" items={['كل الفرق', 'فريق المنتج', 'فريق التصميم', 'الإدارة']} value={team} onPick={setTeam} />
          <Filter label="الموظف" items={['كل الموظفين', 'أحمد هشيمة', 'محمد أمين', 'داليا سمير']} value={emp} onPick={setEmp} width={170} />
        </div>
        <div className="grid g4" style={{ marginBottom: 14 }}>
          <Stat icon={<I.Calendar size={18} />} n="686" unit="ساعة" t={`الساعات المطلوبة · ${range}`} />
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
          {TEAMS.map(t => <Panel key={t.n} title={t.n} sub={`${t.m} أعضاء`} icon={<I.Group size={16} />}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}><span className="muted">إكمال الساعات</span><b>{t.p}%</b></div>
            <div className={`meter ${t.p < 95 ? 'amber' : ''}`}><i style={{ width: `${t.p}%` }} /></div>
            <p className="caption" style={{ marginTop: 8 }}>{t.d}</p>
          </Panel>)}
        </div>
      </>}

      {tab === TABS[1] && <>
        <Panel title="دورة الحضور الحالية" sub="١ أغسطس — ٢٦ أغسطس 2026 · دورة شهرية" icon={<I.Clock size={16} />}
          actions={<div style={{ display: 'flex', gap: 8 }}><button className="btn btn-secondary btn-sm" onClick={() => toast('إعدادات الدورة', 'ضبط بداية الدورة وسياسة الاحتساب.')}>إعدادات الدورة</button><button className="btn btn-primary btn-sm" onClick={() => setClose(true)}>إغلاق الدورة</button></div>}>
          <div className="grid g4" style={{ marginBottom: 14 }}>
            <Stat icon={<I.Calendar size={18} />} n="26" unit="يوم" t="أيام الدورة" />
            <Stat icon={<I.Check size={18} />} n="21" unit="يوم" t="أيام مكتملة" />
            <Stat icon={<I.Info size={18} />} n="3" unit="أيام" t="تحتاج مراجعة" />
            <Stat icon={<I.Clock size={18} />} n="2" unit="طلبات" t="بانتظار الموافقة" />
          </div>
          <table className="tbl">
            <thead><tr><th>اليوم</th><th>الحضور</th><th>الانصراف</th><th>الصافي</th><th>التأخير</th><th>الحالة</th><th /></tr></thead>
            <tbody>
              {ROWS.map((r, i) => <tr key={r.d} className="row-in" style={{ animationDelay: `${i * 30}ms`, cursor: 'pointer' }} onClick={() => setDay(r)}>
                <td><b>{r.d}</b> <span className="muted">· {r.day}</span></td>
                <td dir="ltr" style={{ textAlign: 'right' }}>{r.in}</td>
                <td dir="ltr" style={{ textAlign: 'right' }}>{r.out}</td>
                <td>{r.net}</td>
                <td className={r.late !== '—' ? 'pill amber' : 'muted'}>{r.late}</td>
                <td><span className={`pill ${r.state === 'مكتمل' ? 'green' : r.state === 'إجازة' ? 'purple' : r.state === 'بانتظار الموافقة' ? 'amber' : r.state === 'نصف يوم' ? 'teal' : 'amber'}`}>{r.state}</span></td>
                <td onClick={e => e.stopPropagation()}><RowMenu items={[
                  { label: 'تفاصيل اليوم', onClick: () => setDay(r) },
                  { label: 'إضافة إذن تأخير', onClick: () => toast('إذن تأخير', `${r.d} — بانتظار موافقة المدير.`) },
                  { label: 'تعديل يدوي', onClick: () => toast('تعديل يدوي', 'يُسجَّل التعديل باسمك في سجل التغييرات.') },
                ]} /></td>
              </tr>)}
            </tbody>
          </table>
        </Panel>
      </>}

      {tab === TABS[2] && <Panel title="الموافقات" sub="طلبات الأذونات والإجازات بانتظار قرارك" icon={<I.Check size={16} />}>
        <table className="tbl">
          <thead><tr><th>الموظف</th><th>النوع</th><th>التاريخ</th><th>السبب</th><th>الحالة</th><th /></tr></thead>
          <tbody>{APPROVALS.map((a, i) => <tr key={a.who + a.type} className="row-in" style={{ animationDelay: `${i * 30}ms` }}>
            <td><div className="cell-user"><span className="avatar sm dark">{a.who[0]}</span><b>{a.who}</b></div></td>
            <td>{a.type}</td><td className="muted">{a.when}</td><td className="muted">{a.reason}</td>
            <td><span className={`pill ${a.state === 'مقبول' ? 'green' : 'amber'}`}>{a.state}</span></td>
            <td>{a.state === 'معلّق' ? <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn btn-primary btn-sm" onClick={() => toast('تمت الموافقة', `${a.type} — ${a.who}`)}>موافقة</button>
              <button className="btn btn-secondary btn-sm" onClick={() => toast('تم الرفض', `${a.type} — ${a.who}`)}>رفض</button>
            </div> : <span className="muted">—</span>}</td>
          </tr>)}</tbody>
        </table>
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
            <div className="divider" />
            <div className="modal-footer"><button className="btn btn-primary" onClick={() => { toast('تم حفظ التعديل', day.d); setDay(null) }}>تعديل يدوي</button><button className="btn btn-secondary" onClick={() => setDay(null)}>إغلاق</button></div>
          </div>
        </div>
      )}
      {close && <Confirm title="إغلاق دورة الحضور؟" body="بعد الإغلاق لن يمكن تعديل سجلات الدورة، وسيُنشأ تقرير نهائي لها." confirmLabel="نعم، إغلاق الدورة" onConfirm={() => { setClose(false); toast('تم إغلاق الدورة', 'تم إنشاء تقرير أغسطس 2026.') }} onClose={() => setClose(false)} />}
    </AdminLayout>
  )
}

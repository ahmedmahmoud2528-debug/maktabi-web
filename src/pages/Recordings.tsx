import { useState } from 'react'
import { AdminLayout, Confirm, Empty, PageHead, Panel, RowMenu, Tabs } from '../components/Admin'
import { I } from '../components/Icons'
import { useStore } from '../store'

const TABS = ['الكل', 'تسجيلاتي', 'عرضي']
type R = { id: string; title: string; by: string; date: string; dur: string; people: number; privacy: 'خاص بأشخاص محددين' | 'متاح لكل المساحة' }
const RECS: R[] = [
  { id: 'r1', title: 'مراجعة تصميم الطابق', by: 'أحمد هشيمة', date: '١٧ أغسطس · ٣:٢٧ م', dur: 'أقل من دقيقة', people: 5, privacy: 'خاص بأشخاص محددين' },
  { id: 'r2', title: 'اجتماع فريق المنتج', by: 'أحمد هشيمة', date: '١١ أغسطس · ٣:٣١ م', dur: 'أقل من دقيقة', people: 5, privacy: 'خاص بأشخاص محددين' },
  { id: 'r3', title: 'مراجعة الأسبوع', by: 'أحمد هشيمة', date: '٣ أغسطس · ٩:٣١ ص', dur: '41 دقيقة', people: 1, privacy: 'خاص بأشخاص محددين' },
  { id: 'r4', title: 'إحاطة عامة للمساحة', by: 'أحمد هشيمة', date: '٢ أغسطس · ١:٥٠ م', dur: 'أقل من دقيقة', people: 5, privacy: 'متاح لكل المساحة' },
  { id: 'r5', title: 'ورشة الأدوار والصلاحيات', by: 'أحمد هشيمة', date: '٣٠ يونيو · ٤:٤٣ م', dur: '19 دقيقة', people: 2, privacy: 'خاص بأشخاص محددين' },
]

export default function Recordings() {
  const { toast } = useStore()
  const [tab, setTab] = useState(TABS[0])
  const [q, setQ] = useState('')
  const [access, setAccess] = useState<R | null>(null)
  const [del, setDel] = useState<R | null>(null)
  const [people, setPeople] = useState<string[]>(['محمد أمين', 'داليا سمير'])

  const rows = RECS.filter(r => r.title.includes(q) && (tab === 'الكل' || (tab === 'تسجيلاتي' ? r.by === 'أحمد هشيمة' : r.privacy === 'متاح لكل المساحة')))

  return (
    <AdminLayout>
      <PageHead title="التسجيلات" sub="التسجيلات التي لديك صلاحية الوصول إليها" actions={<button className="btn btn-secondary btn-sm" onClick={() => toast('مساحة التسجيلات', 'استُخدم 48 GB من أصل 100 GB.')}>مساحة التخزين</button>} />
      <Panel>
        <div style={{ display: 'flex', gap: 8, marginBottom: 14, alignItems: 'center' }}>
          <div className="field" style={{ flex: 1, height: 36 }}><I.Search size={16} style={{ color: 'var(--text-3)' }} /><input placeholder="ابحث في التسجيلات" value={q} onChange={e => setQ(e.target.value)} /></div>
          <div className="tabbar" style={{ margin: 0 }}>{TABS.map(t => <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t}</button>)}</div>
        </div>
        {rows.length === 0 ? <Empty icon={<I.Cam size={24} />} title="لا توجد تسجيلات" sub="ابدأ تسجيلًا من شريط الاجتماع داخل المكتب." /> : rows.map((r, i) => (
          <div key={r.id} className="card row-in" style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, animationDelay: `${i * 35}ms` }}>
            <span className="avatar" style={{ borderRadius: 12 }}><I.Cam size={18} /></span>
            <div style={{ flex: 1 }}>
              <b style={{ fontSize: 13.5 }}>{r.title}</b>
              <div className="caption" style={{ marginTop: 2 }}>بدأ التسجيل: {r.by} · {r.date} · {r.dur} · {r.people} مشاركين
                <span className={`pill ${r.privacy === 'متاح لكل المساحة' ? 'green' : ''}`} style={{ marginInlineStart: 8 }}>{r.privacy}</span></div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => toast('فتح التسجيل', r.title)}><I.Play size={14} />فتح التسجيل</button>
            <RowMenu items={[
              { label: 'إدارة الوصول', onClick: () => setAccess(r) },
              { label: 'تنزيل التسجيل', onClick: () => toast('جارٍ التنزيل', r.title) },
              { label: 'حذف التسجيل', danger: true, onClick: () => setDel(r) },
            ]} />
          </div>
        ))}
      </Panel>

      {access && (
        <div className="scrim" onMouseDown={e => { if (e.target === e.currentTarget) setAccess(null) }}>
          <div className="modal" style={{ width: 420 }}>
            <div className="modal-header"><span className="tile"><I.People size={20} /></span><div><div className="modal-title">إدارة الوصول</div><div className="modal-sub">{access.title}</div></div><button className="btn btn-ghost btn-icon close" onClick={() => setAccess(null)}><I.Close size={18} /></button></div>
            <div className="divider" />
            <div className="label" style={{ marginBottom: 8 }}>من يمكنه المشاهدة</div>
            <div className="opt-list">
              {['محمد أمين', 'داليا سمير', 'نور الشامي', 'خالد عبد الله'].map(p => {
                const on = people.includes(p)
                return <button key={p} className={`opt ${on ? 'on' : ''}`} onClick={() => setPeople(v => on ? v.filter(x => x !== p) : [...v, p])}>{p}{on && <I.Check size={16} />}</button>
              })}
            </div>
            <div className="divider" />
            <div className="modal-footer"><button className="btn btn-primary" onClick={() => { setAccess(null); toast('تم تحديث صلاحيات الوصول', `${people.length} أشخاص`) }}>حفظ</button><button className="btn btn-secondary" onClick={() => setAccess(null)}>إلغاء</button></div>
          </div>
        </div>
      )}
      {del && <Confirm danger title="حذف التسجيل؟" body={`سيُحذف «${del.title}» نهائيًا ولن يمكن استرجاعه.`} confirmLabel="نعم، حذف" onConfirm={() => { toast('تم حذف التسجيل', del.title); setDel(null) }} onClose={() => setDel(null)} />}
    </AdminLayout>
  )
}

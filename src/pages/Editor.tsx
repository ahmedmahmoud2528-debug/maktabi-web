import { useLayoutEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DESKS, PLAN, type Desk } from '../data'
import { useStore } from '../store'
import { Confirm } from '../components/Admin'
import { I } from '../components/Icons'

type Item = { id: string; x: number; y: number; w: number; h: number; rot: number; label: string; locked?: boolean; added?: boolean }
const CATS = ['الكل', 'مكاتب', 'كراسي', 'طاولات', 'أرائك', 'ديكور', 'نباتات', 'تخزين', 'أجهزة', 'استقبال', 'إضاءة', 'سجاد', 'فواصل']
const STORE = [
  { t: 'مكتب عمل', c: 'مكاتب', d: '1.6 × 0.8 م', w: 75, h: 96 },
  { t: 'مكتب زاوية', c: 'مكاتب', d: '1.8 × 1.6 م', w: 96, h: 96 },
  { t: 'مكتب استقبال', c: 'استقبال', d: '2.2 × 0.9 م', w: 120, h: 53 },
  { t: 'كرسي مكتب', c: 'كراسي', d: '0.6 × 0.6 م', w: 32, h: 36 },
  { t: 'كرسي بذراعين', c: 'كراسي', d: '0.8 × 0.8 م', w: 44, h: 44 },
  { t: 'كرسي مرتفع', c: 'كراسي', d: '0.5 × 0.5 م', w: 27, h: 27 },
  { t: 'طاولة اجتماعات', c: 'طاولات', d: '3.2 × 1.1 م', w: 170, h: 56 },
  { t: 'طاولة مستديرة', c: 'طاولات', d: '1.6 م', w: 111, h: 106 },
  { t: 'أريكة ثلاثية', c: 'أرائك', d: '2.1 × 0.9 م', w: 106, h: 39 },
  { t: 'نبات طويل', c: 'نباتات', d: '0.5 م', w: 30, h: 30 },
  { t: 'خزانة ملفات', c: 'تخزين', d: '0.9 × 0.4 م', w: 23, h: 87 },
  { t: 'سجادة', c: 'سجاد', d: '3 × 2 م', w: 215, h: 127 },
]
const TABS = ['عناصر', 'مجموعات', 'أرضيات']

export default function Editor() {
  const nav = useNavigate()
  const { toast } = useStore()
  const wrap = useRef<HTMLDivElement>(null)
  const [fit, setFit] = useState(1)
  const [items, setItems] = useState<Item[]>(() => DESKS.map(d => ({ id: d.id, x: d.x, y: d.y, w: d.w, h: d.h, rot: 0, label: d.room ? 'مكتب خاص' : 'مكتب' })))
  const [sel, setSel] = useState<string | null>(null)
  const [dirty, setDirty] = useState(false)
  const [tab, setTab] = useState('عناصر')
  const [cat, setCat] = useState('الكل')
  const [q, setQ] = useState('')
  const [dialog, setDialog] = useState<null | 'exit' | 'publish' | 'drafts'>(null)
  const [publishing, setPublishing] = useState<'idle' | 'run' | 'done'>('idle')
  const [drafts, setDrafts] = useState(1)

  useLayoutEffect(() => {
    const el = wrap.current; if (!el) return
    const ro = new ResizeObserver(() => { const r = el.getBoundingClientRect(); setFit(Math.max(.25, Math.min((r.width - 150) / PLAN.w, (r.height - 200) / PLAN.h, 1.2))) })
    ro.observe(el); return () => ro.disconnect()
  }, [])
  const px = (v: number) => v * fit
  const item = items.find(i => i.id === sel)

  const update = (id: string, patch: Partial<Item>) => { setItems(list => list.map(i => i.id === id ? { ...i, ...patch } : i)); setDirty(true) }
  const add = (s: typeof STORE[0]) => {
    const id = 'n' + Date.now()
    setItems(list => [...list, { id, x: 300, y: 430, w: s.w, h: s.h, rot: 0, label: s.t, added: true }])
    setSel(id); setDirty(true); toast('تمت إضافة عنصر', `${s.t} — اسحبه إلى مكانه ثم انشر التعديلات.`)
  }
  const remove = (id: string) => { setItems(list => list.filter(i => i.id !== id)); setSel(null); setDirty(true) }

  const results = STORE.filter(s => (cat === 'الكل' || s.c === cat) && (q === '' || s.t.includes(q) || s.c.includes(q)))

  return (
    <div className="floor-page">
      <aside className="sidebar">
        <div className="sb-head"><img src="./assets/logo.svg" alt="مكتبي" style={{ width: 118 }} /><div className="sb-ws"><span className="tile"><I.Building size={14} /></span>قمرة السعادة</div><div className="sb-floor"><I.Layers size={13} /> الطابق الأول · وضع التعديل</div></div>
        <div className="sb-invite"><button className="btn btn-primary btn-fill" onClick={() => toast('متجر الأثاث', 'اختر عنصرًا لإضافته إلى الطابق.')}>متجر الأثاث</button><button className="apps"><I.Apps size={20} /></button></div>
        <div style={{ padding: '10px 16px 0' }}>
          <p className="caption">كل عنصر مستقل وقابل للتعديل بعد الإضافة.</p>
          <div className="tabbar" style={{ margin: '10px 0' }}>{TABS.map(t => <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t}</button>)}</div>
          <div className="field" style={{ height: 36 }}><I.Search size={15} style={{ color: 'var(--text-3)' }} /><input placeholder="ابحث بالاسم أو التصنيف…" value={q} onChange={e => setQ(e.target.value)} /></div>
        </div>
        <div className="sb-body">
          {tab === 'عناصر' && <>
            {q === '' && <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, margin: '10px 0 14px' }}>
              {CATS.map(c => <button key={c} className={`chip ${cat === c ? 'on' : ''}`} style={{ height: 30, fontSize: 12 }} onClick={() => setCat(c)}>{c}</button>)}
            </div>}
            {q !== '' && <p className="caption" style={{ margin: '8px 0 12px' }}>{results.length === 1 ? 'نتيجة واحدة' : `${results.length} نتائج`} لـ «{q}»</p>}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {results.map(s => (
                <button key={s.t} className="card card-in" style={{ padding: 10, textAlign: 'start' }} onClick={() => add(s)}>
                  <div style={{ height: 64, borderRadius: 10, background: 'var(--slate-100)', display: 'grid', placeItems: 'center', marginBottom: 8, color: 'var(--text-3)' }}><I.Rooms size={22} /></div>
                  <b style={{ fontSize: 12 }}>{s.t}</b>
                  <div className="caption" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}><span className="pill" style={{ height: 20, fontSize: 10 }}>{s.c}</span><span dir="ltr">{s.d}</span></div>
                </button>
              ))}
            </div>
          </>}
          {tab === 'مجموعات' && <div style={{ display: 'grid', gap: 10, marginTop: 10 }}>
            {['مجموعة مكتب مشترك (4 مكاتب)', 'ركن استراحة (أريكة + طاولة)', 'قاعة اجتماعات صغيرة'].map(g =>
              <button key={g} className="card card-in" style={{ padding: 12, textAlign: 'start' }} onClick={() => { add(STORE[0]); toast('تمت إضافة المجموعة', g) }}><b style={{ fontSize: 12.5 }}>{g}</b><div className="caption" style={{ marginTop: 4 }}>تُضاف كمجموعة قابلة للفك</div></button>)}
          </div>}
          {tab === 'أرضيات' && <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
            {['خشب فاتح', 'خشب داكن', 'سجاد رمادي', 'بلاط أبيض'].map(f =>
              <button key={f} className="card card-in" style={{ padding: 10 }} onClick={() => { setDirty(true); toast('تم تغيير الأرضية', f) }}><div style={{ height: 52, borderRadius: 10, background: f.includes('خشب') ? '#d8b58a' : f.includes('سجاد') ? '#cbd5e1' : '#f1f5f9', marginBottom: 8 }} /><b style={{ fontSize: 12 }}>{f}</b></button>)}
          </div>}
        </div>
      </aside>

      <div className="floor-main" ref={wrap} onClick={() => setSel(null)}>
        {/* شريط المحرر */}
        <div className="card" style={{ position: 'absolute', top: 16, insetInline: 16, padding: 12, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', zIndex: 6 }}>
          <span className="avatar sm" style={{ borderRadius: 10 }}><I.Magic size={16} /></span>
          <div style={{ flex: 1, minWidth: 220 }}>
            <b style={{ fontSize: 13.5 }}>تعديل الطابق الحالي · الطابق الأول</b>
            <div className="caption">يمكنك تعديل المساحات والأثاث دون تغيير الطابق المنشور حتى تعتمد التعديلات.</div>
          </div>
          <span className={`pill ${dirty ? 'amber' : ''}`}>{dirty ? 'لديك تعديلات غير محفوظة' : 'لا توجد تعديلات بعد'}</span>
          <div className="tabbar" style={{ margin: 0 }}>{['الأثاث', 'المساحات', 'الأبواب', 'حجم الطابق'].map((t, i) => <button key={t} className={i === 0 ? 'on' : ''} onClick={() => i && toast(t, 'هذا التبويب سيُضاف قريبًا.')}>{t}</button>)}</div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setDialog('drafts')}>المسودات المحفوظة ({drafts})</button>
            <button className="btn btn-secondary btn-icon btn-sm" title="حفظ كمسودة" disabled={!dirty} onClick={() => { setDrafts(d => d + 1); setDirty(false); toast('تم حفظ المسودة') }}><I.Copy size={16} /></button>
            <button className="btn btn-secondary btn-icon btn-sm" title="معاينة" onClick={() => nav('/floor')}><I.Eye size={16} /></button>
            <button className="btn btn-primary btn-sm" disabled={!dirty} onClick={() => setDialog('publish')}>نشر التعديلات</button>
            <button className="btn btn-secondary btn-icon btn-sm" title="خروج" onClick={() => dirty ? setDialog('exit') : nav('/floor')}><I.Logout size={16} /></button>
          </div>
        </div>

        <div className="floor-canvas" style={{ paddingTop: 110 }}>
          <div className="plan" style={{ width: px(PLAN.w), height: px(PLAN.h) }} onClick={e => e.stopPropagation()}>
            <img src="./assets/floor@2x.jpg" alt="مخطط الطابق" draggable={false} />
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(20,184,166,.10) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,.10) 1px, transparent 1px)', backgroundSize: `${px(38)}px ${px(38)}px` }} />
            {items.map(it => (
              <div key={it.id} className={`hot ${sel === it.id ? 'selected' : ''}`} title={it.label}
                style={{ left: px(it.x), top: px(it.y), width: px(it.w), height: px(it.h), transform: `rotate(${it.rot}deg)`, transition: 'transform 180ms var(--ease), left 180ms var(--ease), top 180ms var(--ease), width 180ms var(--ease), height 180ms var(--ease)', background: it.added ? 'rgba(20,184,166,.22)' : undefined, border: it.added ? '1px dashed var(--teal)' : undefined, borderRadius: 8 }}
                onClick={() => setSel(it.id)} />
            ))}
            {item && (
              <div className="popover" style={{ left: Math.max(0, Math.min(px(item.x + item.w / 2) - 160, px(PLAN.w) - 320)), top: px(item.y + item.h) + 10, padding: 6, display: 'flex', alignItems: 'center', gap: 4 }} onClick={e => e.stopPropagation()}>
                <span style={{ fontSize: 12, padding: '0 8px' }}>{item.label}</span>
                <span style={{ width: 1, height: 20, background: 'var(--border)' }} />
                <button className="btn btn-ghost btn-icon btn-sm" title="تدوير" onClick={() => update(item.id, { rot: (item.rot + 90) % 360 })}><I.Magic size={16} /></button>
                <button className="btn btn-ghost btn-icon btn-sm" title="تكبير" onClick={() => update(item.id, { w: Math.round(item.w * 1.15), h: Math.round(item.h * 1.15) })}><I.Plus size={16} /></button>
                <button className="btn btn-ghost btn-icon btn-sm" title="تصغير" onClick={() => update(item.id, { w: Math.round(item.w * .87), h: Math.round(item.h * .87) })}><I.Minus size={16} /></button>
                <button className="btn btn-ghost btn-icon btn-sm" title="تكرار" onClick={() => { const id = 'n' + Date.now(); setItems(l => [...l, { ...item, id, x: item.x + 16, y: item.y + 16, added: true }]); setSel(id); setDirty(true) }}><I.Copy size={16} /></button>
                <span style={{ width: 1, height: 20, background: 'var(--border)' }} />
                <button className="btn btn-ghost btn-icon btn-sm" title={item.locked ? 'فك القفل' : 'قفل'} style={item.locked ? { color: 'var(--teal)' } : undefined} onClick={() => update(item.id, { locked: !item.locked })}><I.Status size={16} /></button>
                <button className="btn btn-ghost btn-icon btn-sm" title="حذف" style={{ color: 'var(--red)' }} onClick={() => remove(item.id)}><I.Close size={16} /></button>
              </div>
            )}
          </div>
        </div>

        <div className="rail" onClick={e => e.stopPropagation()}>
          <button title="أدوات" className="on"><I.Magic /></button>
          <button title="الطبقات" onClick={() => toast('الطبقات', 'إدارة طبقات الطابق قريبًا.')}><I.Layers /></button>
          <button title="قياس" onClick={() => toast('القياس', 'أداة القياس قريبًا.')}><I.Edit /></button>
          <button title="توسيط" onClick={() => toast('تم التوسيط')}><I.Gps /></button>
          <hr /><span className="zoom">{Math.round(fit * 100)}%</span>
          <button title="تكبير" onClick={() => setFit(f => Math.min(1.4, +(f + .1).toFixed(2)))}><I.Plus /></button>
          <button title="تصغير" onClick={() => setFit(f => Math.max(.3, +(f - .1).toFixed(2)))}><I.Minus /></button>
        </div>
      </div>

      {dialog === 'exit' && <Confirm danger title="تجاهل التعديلات؟" body="لديك تعديلات غير محفوظة. سيتم فقدانها عند الخروج." confirmLabel="تجاهل التعديلات والخروج" onConfirm={() => nav('/floor')} onClose={() => setDialog(null)} />}
      {dialog === 'publish' && publishing === 'idle' && <Confirm title="نشر تعديلات الطابق؟" body="سيتم اعتماد ترتيب الطابق الحالي وإنهاء وضع التعديل." confirmLabel="نشر التعديلات"
        onConfirm={() => { setPublishing('run'); setTimeout(() => setPublishing('done'), 1300) }} onClose={() => setDialog(null)} />}
      {publishing === 'run' && <div className="scrim"><div className="modal" style={{ width: 380 }}><div className="result"><div className="ok"><span className="spinner dark" style={{ width: 26, height: 26 }} /></div><h3>جارٍ نشر التعديلات…</h3><p>لا تغلق الصفحة حتى تكتمل العملية.</p></div></div></div>}
      {publishing === 'done' && <div className="scrim"><div className="modal" style={{ width: 400 }}><div className="result"><div className="ok"><I.Check size={26} /></div><h3>تم نشر التعديلات</h3><p>تم تحديث تصميم الطابق بنجاح.</p></div><div className="modal-footer" style={{ justifyContent: 'center' }}><button className="btn btn-primary" onClick={() => nav('/floor')}>العودة إلى المكتب</button></div></div></div>}
      {dialog === 'drafts' && (
        <div className="scrim" onMouseDown={e => { if (e.target === e.currentTarget) setDialog(null) }}>
          <div className="modal" style={{ width: 500 }}>
            <div className="modal-header"><span className="tile"><I.Copy size={20} /></span><div><div className="modal-title">المسودات المحفوظة · الطابق الأول</div><div className="modal-sub">يمكنك تطبيق أي نسخة على وضع التعديل الحالي دون التأثير على الطابق المنشور.</div></div><button className="btn btn-ghost btn-icon close" onClick={() => setDialog(null)}><I.Close size={18} /></button></div>
            <div className="divider" />
            {Array.from({ length: drafts }).map((_, i) => (
              <div className="card" key={i} style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ flex: 1 }}><b style={{ fontSize: 13 }}>مسودة {i + 1}</b><div className="caption">{5 + i} تغييرات · 9 مساحات · 127 عنصر</div></div>
                <button className="btn btn-secondary btn-sm" onClick={() => { setDialog(null); setDirty(true); toast('تم تطبيق المسودة', `مسودة ${i + 1}`) }}>تطبيق</button>
                <button className="btn btn-ghost btn-icon btn-sm" style={{ color: 'var(--red)' }} onClick={() => { setDrafts(d => Math.max(0, d - 1)); toast('تم حذف المسودة') }}><I.Close size={16} /></button>
              </div>
            ))}
            {drafts === 0 && <p className="caption" style={{ textAlign: 'center', padding: 20 }}>لا توجد مسودات محفوظة لهذا الطابق بعد.</p>}
          </div>
        </div>
      )}
    </div>
  )
}

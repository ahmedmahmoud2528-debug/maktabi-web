import { useState } from 'react'
import { PEOPLE, type Desk, type Person } from '../data'
import { useStore } from '../store'
import { I } from './Icons'

const CANDIDATES: Person[] = PEOPLE.filter(p => ['ahmed', 'mostafa', 'mohamed', 'yassin'].includes(p.id))

export function AssignOwnerDialog({ desk, onClose }: { desk: Desk; onClose: () => void }) {
  const { owners, setOwner, toast, user } = useStore()
  const current = owners[desk.id] ?? null
  const hasOwner = !!current
  const [q, setQ] = useState('')
  const [picked, setPicked] = useState<string | null>(null)
  const [unmarked, setUnmarked] = useState(false)
  const [confirm, setConfirm] = useState<'assign' | 'remove' | null>(null)
  const place = desk.room ?? 'مكتب خاص'
  const list = CANDIDATES.filter(p => p.name.includes(q) || p.role.includes(q))
  const currentPerson = PEOPLE.find(p => p.id === current)

  const save = () => {
    if (hasOwner) setConfirm('remove'); else setConfirm('assign')
  }
  const doAssign = () => { setOwner(desk.id, picked); toast('تم تعيين مالك المكتب', `${PEOPLE.find(p => p.id === picked)?.name} هو الآن مالك «${place}».`); onClose() }
  const doRemove = () => { setOwner(desk.id, null); toast('تمت إزالة مالك المكتب', 'المكتب متاح الآن ويمكن تعيين مالك جديد له.'); onClose() }

  return (
    <div className="scrim" onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}>
      {confirm ? (
        <div className="modal" style={{ width: 320 }}>
          <div className="modal-title">{confirm === 'assign' ? 'تأكيد تعيين المالك' : 'تأكيد إزالة المالك'}</div>
          <div className="modal-sub">{place}</div>
          <div className="banner info" style={{ margin: '12px 0' }}>
            {confirm === 'assign' ? <span>هل أنت متأكد من تعيين <b style={{ color: 'var(--text)' }}>{PEOPLE.find(p => p.id === picked)?.name}</b> كمالك لـ <b style={{ color: 'var(--text)' }}>{place}</b>؟</span>
              : <span>هل أنت متأكد من إزالة <b style={{ color: 'var(--text)' }}>{currentPerson?.name}</b> من <b style={{ color: 'var(--text)' }}>{place}</b>؟</span>}
          </div>
          <div className="modal-footer">
            <button className={`btn btn-fill ${confirm === 'assign' ? 'btn-primary' : 'btn-danger'}`} onClick={confirm === 'assign' ? doAssign : doRemove}>{confirm === 'assign' ? 'نعم، تعيين المالك' : 'نعم، إزالة المالك'}</button>
            <button className="btn btn-secondary" onClick={() => setConfirm(null)}>رجوع</button>
          </div>
        </div>
      ) : (
        <div className="modal" style={{ width: 320, padding: 16 }}>
          <div className="modal-header" style={{ alignItems: 'center' }}>
            <div><div className="modal-title">{hasOwner ? 'مالك المكتب' : 'تعيين مالك المكتب'}</div><div className="modal-sub">{place}</div></div>
            <button className="btn btn-ghost btn-icon close" onClick={onClose} aria-label="إغلاق"><I.Close size={18} /></button>
          </div>
          {hasOwner && <div className="banner info" style={{ margin: '12px 0 0' }}>المكتب له مالك حالي — أزل العلامة عنه أولًا ثم احفظ التغييرات لتحرير المكتب.</div>}
          <div className="field field-pill" style={{ margin: '12px 0', height: 40 }}><I.Search size={16} style={{ color: 'var(--text-3)' }} /><input placeholder="ابحث باسم الموظف أو المسمى..." value={q} onChange={e => setQ(e.target.value)} /></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {(hasOwner ? CANDIDATES : list).map(p => {
              const isCurrent = hasOwner && p.id === current
              const on = hasOwner ? isCurrent && !unmarked : picked === p.id
              const removal = hasOwner && isCurrent && unmarked
              const dim = hasOwner && !isCurrent
              return (
                <button key={p.id} className={`ao-row ${on ? 'on' : ''} ${removal ? 'removal' : ''} ${dim ? 'dim' : ''}`} disabled={dim} onClick={() => hasOwner ? setUnmarked(v => !v) : setPicked(p.id)}>
                  <span className="avatar">{p.initial}</span>
                  <span className="txt"><b>{p.name}</b><small>{p.id === user.id ? 'أنت' : p.role}</small></span>
                  {removal && <span className="tag">سيُزال</span>}
                  {on && <span className="chk"><I.Check size={14} /></span>}
                </button>
              )
            })}
            {!hasOwner && list.length === 0 && <p className="caption" style={{ padding: 12 }}>لا نتائج مطابقة.</p>}
          </div>
          <div className="modal-footer" style={{ marginTop: 16 }}>
            <button className="btn btn-primary btn-fill" disabled={hasOwner ? !unmarked : !picked} onClick={save}>{hasOwner && unmarked ? 'حفظ التغييرات' : 'حفظ'}</button>
            <button className="btn btn-secondary" onClick={onClose}>إلغاء</button>
          </div>
        </div>
      )}
    </div>
  )
}

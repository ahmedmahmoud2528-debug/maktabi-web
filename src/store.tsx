import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { DESKS, PEOPLE, type Person } from './data'

export type Toast = { id: number; title: string; body?: string; tone?: 'success' | 'info' }

type Store = {
  user: Person
  mic: boolean; cam: boolean; sharing: boolean; recording: boolean
  toggle: (k: 'mic' | 'cam' | 'sharing' | 'recording') => void
  floor: string; setFloor: (id: string) => void
  owners: Record<string, string | null>; setOwner: (deskId: string, personId: string | null) => void
  startPoint: string | null; setStartPoint: (id: string | null) => void
  toasts: Toast[]; toast: (title: string, body?: string) => void; dismissToast: (id: number) => void
  dm: string | null; openDM: (personId: string | null) => void
  invite: boolean; setInvite: (v: boolean) => void
}

const Ctx = createContext<Store | null>(null)
let seq = 1

export function StoreProvider({ children }: { children: ReactNode }) {
  const [mic, setMic] = useState(true)
  const [cam, setCam] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [recording, setRecording] = useState(false)
  const [floor, setFloor] = useState('f1')
  const [owners, setOwners] = useState<Record<string, string | null>>(() => Object.fromEntries(DESKS.map(d => [d.id, d.room ? (d.id === 'dalia' ? 'mostafa' : d.id === 'hossam' ? 'hossam' : d.id === 'nour' ? 'lubna' : 'mohamed') : (d.clock === 'running' ? 'ahmed' : null)])))
  const [startPoint, setStartPoint] = useState<string | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [dm, setDm] = useState<string | null>(null)
  const [invite, setInvite] = useState(false)

  const toast = useCallback((title: string, body?: string) => {
    const id = seq++
    setToasts(t => [...t, { id, title, body }])
    window.setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2400)
  }, [])
  const dismissToast = useCallback((id: number) => setToasts(t => t.filter(x => x.id !== id)), [])
  const toggle = useCallback((k: 'mic' | 'cam' | 'sharing' | 'recording') => {
    if (k === 'mic') setMic(v => !v)
    if (k === 'cam') setCam(v => !v)
    if (k === 'sharing') setSharing(v => !v)
    if (k === 'recording') setRecording(v => !v)
  }, [])
  const setOwner = useCallback((deskId: string, personId: string | null) => setOwners(o => ({ ...o, [deskId]: personId })), [])

  const value = useMemo<Store>(() => ({
    user: PEOPLE[0], mic, cam, sharing, recording, toggle, floor, setFloor, owners, setOwner, startPoint, setStartPoint, toasts, toast, dismissToast, dm, openDM: setDm, invite, setInvite,
  }), [mic, cam, sharing, recording, toggle, floor, owners, setOwner, startPoint, toasts, toast, dismissToast, dm, invite])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore() {
  const s = useContext(Ctx)
  if (!s) throw new Error('StoreProvider missing')
  return s
}

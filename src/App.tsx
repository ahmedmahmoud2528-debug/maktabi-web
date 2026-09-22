import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { StoreProvider } from './store'
import Login from './pages/Login'
import Workspaces from './pages/Workspaces'
import Floor, { Toasts } from './pages/Floor'
import Editor from './pages/Editor'
import Team from './pages/Team'
import Attendance from './pages/Attendance'
import Billing from './pages/Billing'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import Recordings from './pages/Recordings'
import { InviteModal } from './components/InviteModal'
import { useStore } from './store'

/* طبقة عامة: مودال الدعوة + التوستات على كل الصفحات */
function Shell() {
  const { invite } = useStore()
  return <>{invite && <InviteModal />}<Toasts /></>
}

function Pages() {
  const loc = useLocation()
  return (
    <div key={loc.pathname} className="page-fade" style={{ height: '100%' }}>
      <Routes location={loc}>
        <Route path="/" element={<Login />} />
        <Route path="/workspaces" element={<Workspaces />} />
        <Route path="/floor" element={<Floor />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/admin/members" element={<Team />} />
        <Route path="/admin/employee/:id" element={<Team />} />
        <Route path="/admin/attendance" element={<Attendance />} />
        <Route path="/admin/billing" element={<Billing />} />
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/admin/workspace" element={<Settings initial="إعدادات مساحة العمل" />} />
        <Route path="/admin/profile" element={<Profile />} />
        <Route path="/admin/recordings" element={<Recordings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <Pages />
        <Shell />
      </HashRouter>
    </StoreProvider>
  )
}

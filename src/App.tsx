import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { StoreProvider } from './store'
import Login from './pages/Login'
import Workspaces from './pages/Workspaces'
import Floor, { Toasts } from './pages/Floor'

export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/workspaces" element={<><Workspaces /><Toasts /></>} />
          <Route path="/floor" element={<Floor />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </StoreProvider>
  )
}

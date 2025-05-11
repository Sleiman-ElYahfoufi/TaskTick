import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing/Landing'
import './App.css'
import Auth from './pages/Auth/Auth'
import Onboarding from './pages/Onboarding/Onboarding'
import Dashboard from './pages/Dashboard/Dashboard'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/onboarding" element={<Onboarding />} />
 <Route path="/dashboard" element={<Dashboard />}>
    {/* <Route index element={<DashboardHome />} />
    <Route path="projects" element={<Projects />} />
    <Route path="tasks" element={<Tasks />} />
    <Route path="settings" element={<Settings />} /> */}
  </Route>
      </Routes>
    </Router>
  )
}

export default App
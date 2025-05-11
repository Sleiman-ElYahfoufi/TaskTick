import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing/Landing'
import './App.css'
import Auth from './pages/Auth/Auth'
import Onboarding from './pages/Onboarding/Onboarding'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/onboarding" element={<Onboarding />} />

      </Routes>
    </Router>
  )
}

export default App
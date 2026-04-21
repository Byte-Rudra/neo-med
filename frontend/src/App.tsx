import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import NeuralBackground from './components/NeuralBackground'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import PatientPortal from './pages/PatientPortal'
import Contact from './pages/Contact'

function App() {
  const location = useLocation()
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.style.opacity = '0'
      mainRef.current.style.transform = 'translateY(20px)'
      requestAnimationFrame(() => {
        if (mainRef.current) {
          mainRef.current.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
          mainRef.current.style.opacity = '1'
          mainRef.current.style.transform = 'translateY(0)'
        }
      })
    }
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <>
      <NeuralBackground />
      <div ref={mainRef} style={{ position: 'relative', zIndex: 1 }}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/portal" element={<PatientPortal />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </>
  )
}

export default App

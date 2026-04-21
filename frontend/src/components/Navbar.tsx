import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Portal', path: '/portal' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Contact', path: '/contact' },
]

export default function Navbar() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      id="main-nav"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled ? 'rgba(247, 249, 251, 0.85)' : 'rgba(247, 249, 251, 0.6)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid rgba(192, 199, 212, 0.15)' : 'none',
        transition: 'all 0.3s ease',
        boxShadow: scrolled ? '0 4px 24px rgba(25,28,30,0.04)' : 'none',
      }}
    >
      <div style={{
        maxWidth: 1400,
        margin: '0 auto',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 72,
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: 32, fontVariationSettings: "'FILL' 1" }}>
            health_and_safety
          </span>
          <span style={{
            fontFamily: 'var(--font-headline)',
            fontWeight: 800,
            fontSize: 22,
            color: 'var(--on-surface)',
            letterSpacing: '-0.03em',
          }}>
            Neo-Med
          </span>
        </Link>

        {/* Desktop Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="desktop-nav">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                padding: '8px 18px',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: location.pathname === link.path ? 600 : 500,
                color: location.pathname === link.path ? 'var(--primary)' : 'var(--on-surface-variant)',
                background: location.pathname === link.path ? 'var(--primary-fixed)' : 'transparent',
                transition: 'all 0.25s ease',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== link.path) {
                  e.currentTarget.style.background = 'var(--surface-container-low)'
                  e.currentTarget.style.color = 'var(--primary)'
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== link.path) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'var(--on-surface-variant)'
                }
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link
            to="/dashboard"
            id="emergency-login-btn"
            style={{
              padding: '10px 24px',
              borderRadius: 12,
              background: 'linear-gradient(135deg, var(--primary), var(--primary-container))',
              color: 'var(--on-primary)',
              fontWeight: 700,
              fontSize: 14,
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 16px rgba(0, 94, 164, 0.2)',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 6px 24px rgba(0, 94, 164, 0.35)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 94, 164, 0.2)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            Emergency Login
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="mobile-menu-btn"
            style={{
              display: 'none',
              padding: 8,
              borderRadius: 8,
              background: 'transparent',
              color: 'var(--on-surface)',
            }}
          >
            <span className="material-symbols-outlined">{menuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          padding: '16px 32px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          background: 'rgba(247, 249, 251, 0.95)',
          backdropFilter: 'blur(20px)',
        }}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              style={{
                padding: '12px 18px',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: location.pathname === link.path ? 600 : 500,
                color: location.pathname === link.path ? 'var(--primary)' : 'var(--on-surface-variant)',
                background: location.pathname === link.path ? 'var(--primary-fixed)' : 'transparent',
                textDecoration: 'none',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  )
}

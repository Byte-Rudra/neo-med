import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import Navbar from '../components/Navbar'

const features = [
  {
    icon: 'neurology',
    title: 'Patient Intelligence',
    desc: 'AI-driven diagnostic assistance that synthesizes multi-modal patient history into actionable recovery pathways.',
    color: 'var(--primary)',
    bg: 'rgba(211,228,255,0.3)',
  },
  {
    icon: 'hub',
    title: 'Live Neural Network',
    desc: 'Real-time connectivity across departments ensuring surgical precision and instantaneous data synchronization.',
    color: 'var(--tertiary)',
    bg: 'rgba(204,229,255,0.3)',
  },
  {
    icon: 'query_stats',
    title: 'Integrated Analytics',
    desc: 'Comprehensive operational metrics displayed in an editorial layout for high-stakes decision making.',
    color: 'var(--secondary)',
    bg: 'rgba(213,227,253,0.3)',
  },
]

const stats = [
  { value: '99.9%', label: 'System Uptime' },
  { value: '2.4M+', label: 'Patients Managed' },
  { value: '150+', label: 'Partner Hospitals' },
  { value: '<12ms', label: 'Network Latency' },
]

export default function Landing() {
  const heroRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.15 }
    )

    document.querySelectorAll('.reveal, .stagger').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 72 }}>
        {/* Hero Section */}
        <section
          ref={heroRef}
          style={{
            position: 'relative',
            padding: '100px 32px 80px',
            maxWidth: 1400,
            margin: '0 auto',
            textAlign: 'center',
            overflow: 'visible',
          }}
        >
          {/* Decorative blur */}
          <div style={{
            position: 'absolute',
            top: -100,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 800,
            height: 400,
            background: 'radial-gradient(ellipse, rgba(211,228,255,0.3), transparent 70%)',
            filter: 'blur(80px)',
            zIndex: -1,
            pointerEvents: 'none',
          }} />

          <div className="animate-fade-in-up" style={{ maxWidth: 900, margin: '0 auto' }}>
            <h1 style={{
              fontFamily: 'var(--font-headline)',
              fontWeight: 800,
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              color: 'var(--on-surface)',
              marginBottom: 24,
            }}>
              Next-Generation{' '}
              <span className="text-gradient">Healthcare</span>{' '}
              Management
            </h1>

            <p className="animate-fade-in-up delay-200" style={{
              fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
              color: 'var(--on-surface-variant)',
              maxWidth: 640,
              margin: '0 auto 40px',
              lineHeight: 1.7,
              opacity: 0,
            }}>
              Seamless patient care, integrated 3D neuro-analytics, and advanced
              system metrics in one unified platform.
            </p>

            <div className="animate-fade-in-up delay-300" style={{
              display: 'flex',
              gap: 16,
              justifyContent: 'center',
              flexWrap: 'wrap',
              opacity: 0,
            }}>
              <Link
                to="/portal"
                id="explore-portal-btn"
                style={{
                  padding: '16px 36px',
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, var(--primary), var(--primary-container))',
                  color: 'var(--on-primary)',
                  fontWeight: 700,
                  fontSize: 17,
                  boxShadow: '0 8px 32px rgba(0,94,164,0.2)',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,94,164,0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,94,164,0.2)'
                }}
              >
                Explore Portal
              </Link>
              <Link
                to="/dashboard"
                id="virtual-tour-btn"
                style={{
                  padding: '16px 36px',
                  borderRadius: 14,
                  background: 'rgba(255,255,255,0.5)',
                  backdropFilter: 'blur(12px)',
                  color: 'var(--primary)',
                  fontWeight: 700,
                  fontSize: 17,
                  border: '1px solid rgba(192,199,212,0.2)',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.75)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.5)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                Virtual Tour
              </Link>
            </div>
          </div>

        </section>

        {/* Stats bar */}
        <section style={{ background: 'var(--surface-container-low)', padding: '48px 32px' }}>
          <div
            ref={statsRef}
            className="stagger reveal"
            style={{
              maxWidth: 1400,
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 32,
              textAlign: 'center',
            }}
          >
            {stats.map((s) => (
              <div key={s.label}>
                <div style={{
                  fontFamily: 'var(--font-headline)',
                  fontWeight: 800,
                  fontSize: 36,
                  color: 'var(--primary)',
                  letterSpacing: '-0.02em',
                }}>
                  {s.value}
                </div>
                <div style={{
                  fontFamily: 'var(--font-label)',
                  fontSize: 13,
                  color: 'var(--on-surface-variant)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginTop: 6,
                  fontWeight: 600,
                }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Feature Cards */}
        <section style={{ padding: '80px 32px' }}>
          <div
            ref={cardsRef}
            className="stagger reveal"
            style={{
              maxWidth: 1400,
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 28,
            }}
          >
            {features.map((f) => (
              <div
                key={f.title}
                style={{
                  padding: 36,
                  borderRadius: 16,
                  background: 'var(--surface-container-lowest)',
                  transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 20,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)'
                  e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,94,164,0.08)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  background: f.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 28, color: f.color, fontVariationSettings: "'FILL' 1" }}
                  >
                    {f.icon}
                  </span>
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-headline)',
                  fontWeight: 700,
                  fontSize: 22,
                  color: 'var(--on-surface)',
                }}>
                  {f.title}
                </h3>
                <p style={{
                  color: 'var(--on-surface-variant)',
                  lineHeight: 1.7,
                  fontSize: 15,
                }}>
                  {f.desc}
                </p>
                <div style={{
                  marginTop: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  color: 'var(--primary)',
                  fontWeight: 600,
                  fontSize: 14,
                }}>
                  Learn more
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bento Visual Section */}
        <section className="reveal" style={{ padding: '0 32px 80px' }}>
          <div style={{
            maxWidth: 1400,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: 24,
          }}>
            <div style={{
              borderRadius: 16,
              position: 'relative',
              height: 400,
              border: '1px solid rgba(192,199,212,0.15)',
              background: 'linear-gradient(135deg, rgba(0,94,164,0.12), rgba(211,228,255,0.9))',
              padding: 48,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute',
                top: -40,
                right: -20,
                width: 240,
                height: 240,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.75), transparent 70%)',
                pointerEvents: 'none',
              }} />
              <div style={{
                position: 'absolute',
                bottom: -70,
                left: -20,
                width: 280,
                height: 180,
                borderRadius: 32,
                background: 'linear-gradient(135deg, rgba(0,94,164,0.08), rgba(255,255,255,0.35))',
                transform: 'rotate(-10deg)',
                pointerEvents: 'none',
              }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <p style={{
                  fontFamily: 'var(--font-label)',
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--primary)',
                  marginBottom: 16,
                }}>
                  Clinical Operations
                </p>
                <h4 style={{
                  fontFamily: 'var(--font-headline)',
                  fontWeight: 700,
                  fontSize: 28,
                  color: 'var(--on-surface)',
                  marginBottom: 10,
                  maxWidth: 460,
                }}>
                  Human-free visual layer with the same clinical focus
                </h4>
                <p style={{ color: 'var(--on-surface-variant)', maxWidth: 460, lineHeight: 1.7 }}>
                  The experience now highlights system activity, patient flow, and operational confidence without doctor or patient imagery.
                </p>
              </div>
              <div style={{
                position: 'relative',
                zIndex: 1,
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: 16,
              }}>
                {[
                  ['Recovery precision', '40% faster'],
                  ['Live monitoring', '24/7 synced'],
                  ['Clinical readiness', '99.9% uptime'],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    style={{
                      padding: 18,
                      borderRadius: 14,
                      background: 'rgba(255,255,255,0.68)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.55)',
                    }}
                  >
                    <p style={{ fontSize: 12, color: 'var(--on-surface-variant)', marginBottom: 6 }}>{label}</p>
                    <p style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: 20, color: 'var(--primary)' }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              borderRadius: 16,
              background: 'linear-gradient(135deg, var(--tertiary), var(--tertiary-container))',
              padding: 48,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              color: 'var(--on-tertiary)',
              height: 400,
            }}>
              <div>
                <span className="material-symbols-outlined" style={{ fontSize: 48, marginBottom: 24, display: 'block' }}>
                  verified_user
                </span>
                <h4 style={{
                  fontFamily: 'var(--font-headline)',
                  fontWeight: 700,
                  fontSize: 26,
                  marginBottom: 12,
                  lineHeight: 1.2,
                }}>
                  Sanctuary of Security
                </h4>
                <p style={{ opacity: 0.9, lineHeight: 1.6 }}>
                  Your data is protected by quantum-encrypted neural gateways, ensuring absolute privacy.
                </p>
              </div>
              <a href="#" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontWeight: 700,
                color: 'var(--on-tertiary)',
              }}>
                View Compliance
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>launch</span>
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          background: 'var(--surface-container-low)',
          borderRadius: '24px 24px 0 0',
          padding: '64px 32px',
        }}>
          <div style={{
            maxWidth: 1400,
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 40,
          }}>
            <div style={{ maxWidth: 320 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontVariationSettings: "'FILL' 1" }}>
                  health_and_safety
                </span>
                <span style={{
                  fontFamily: 'var(--font-headline)',
                  fontWeight: 800,
                  fontSize: 18,
                  color: 'var(--on-surface)',
                }}>
                  Neo-Med
                </span>
              </div>
              <p style={{
                fontSize: 14,
                color: 'var(--on-surface-variant)',
                lineHeight: 1.7,
                marginBottom: 16,
              }}>
                Advancing the boundaries of clinical precision through sanctuary-grade design and neural intelligence.
              </p>
              <p style={{
                fontFamily: 'var(--font-label)',
                fontSize: 12,
                color: 'var(--outline)',
              }}>
                © 2024 Neo-Med Clinical Sanctuary. All rights reserved.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 64, flexWrap: 'wrap' }}>
              <div>
                <h5 style={{
                  fontFamily: 'var(--font-label)',
                  fontWeight: 700,
                  fontSize: 12,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--on-surface)',
                  marginBottom: 16,
                }}>
                  Platform
                </h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <Link to="/" style={{ fontSize: 14, color: 'var(--on-surface-variant)' }}>Home</Link>
                  <Link to="/portal" style={{ fontSize: 14, color: 'var(--on-surface-variant)' }}>Portal</Link>
                  <Link to="/dashboard" style={{ fontSize: 14, color: 'var(--on-surface-variant)' }}>Dashboard</Link>
                </div>
              </div>
              <div>
                <h5 style={{
                  fontFamily: 'var(--font-label)',
                  fontWeight: 700,
                  fontSize: 12,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--on-surface)',
                  marginBottom: 16,
                }}>
                  Connect
                </h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <Link to="/contact" style={{ fontSize: 14, color: 'var(--on-surface-variant)' }}>Contact</Link>
                  <a href="#" style={{ fontSize: 14, color: 'var(--on-surface-variant)' }}>LinkedIn</a>
                  <a href="#" style={{ fontSize: 14, color: 'var(--on-surface-variant)' }}>Twitter</a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}

import { useState } from 'react'
import Navbar from '../components/Navbar'

const contactInfo = [
  { icon: 'location_on', label: 'Address', value: '42 Neural Drive, Med-City, CA 90210' },
  { icon: 'call', label: 'Phone', value: '+1 (800) NEO-CARE' },
  { icon: 'mail', label: 'Email', value: 'connect@neo-med.health' },
  { icon: 'schedule', label: 'Hours', value: '24/7 — Clinical Sanctuary Never Sleeps' },
]

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 72 }}>
        {/* Hero */}
        <section style={{
          position: 'relative', padding: '80px 32px 60px',
          textAlign: 'center', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)',
            width: 600, height: 300,
            background: 'radial-gradient(ellipse, rgba(204,229,255,0.4), transparent 70%)',
            filter: 'blur(80px)', zIndex: -1, pointerEvents: 'none',
          }} />
          <div className="animate-fade-in-up">
            <h1 style={{
              fontFamily: 'var(--font-headline)', fontWeight: 800,
              fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.03em',
              marginBottom: 16,
            }}>
              Get in <span className="text-gradient">Touch</span>
            </h1>
            <p style={{ fontSize: 17, color: 'var(--on-surface-variant)', maxWidth: 540, margin: '0 auto' }}>
              Connect with our clinical team for inquiries, partnerships, or emergency support.
            </p>
          </div>
        </section>

        {/* Content */}
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px 80px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 32 }}>
            {/* Contact Info Cards */}
            <div className="animate-slide-left" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {contactInfo.map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 20,
                    padding: 24, borderRadius: 16,
                    background: 'var(--surface-container-lowest)',
                    transition: 'all 0.3s ease', cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(6px)'
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,94,164,0.06)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: 'rgba(211,228,255,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontVariationSettings: "'FILL' 1" }}>
                      {item.icon}
                    </span>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'var(--font-label)', fontSize: 11, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{item.label}</p>
                    <p style={{ fontWeight: 600, fontSize: 15, marginTop: 4 }}>{item.value}</p>
                  </div>
                </div>
              ))}

              {/* Map placeholder */}
              <div style={{
                borderRadius: 16, height: 200, overflow: 'hidden',
                background: 'linear-gradient(135deg, var(--primary), var(--primary-container))',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8,
                color: 'var(--on-primary)',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 48, opacity: 0.8 }}>map</span>
                <p style={{ fontWeight: 600, fontSize: 14, opacity: 0.9 }}>Interactive Map Coming Soon</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="animate-slide-right" style={{
              background: 'var(--surface-container-lowest)', borderRadius: 20, padding: 40,
              opacity: 0,
            }}>
              <h3 style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: 22, marginBottom: 28 }}>
                Send a Message
              </h3>

              {submitted ? (
                <div style={{
                  textAlign: 'center', padding: '60px 20px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
                }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: 99,
                    background: 'rgba(0,199,120,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 36, color: '#059669', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  </div>
                  <h4 style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: 20 }}>Message Sent!</h4>
                  <p style={{ color: 'var(--on-surface-variant)', fontSize: 15 }}>Our team will respond within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ fontFamily: 'var(--font-label)', fontSize: 12, fontWeight: 600, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>Name</label>
                      <input
                        type="text" placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        style={{
                          width: '100%', padding: '14px 18px', borderRadius: 12, border: 'none',
                          background: 'var(--surface-container-low)', fontSize: 15, outline: 'none',
                          fontFamily: 'var(--font-body)',
                          transition: 'box-shadow 0.25s ease',
                        }}
                        onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 2px rgba(0,94,164,0.2)' }}
                        onBlur={(e) => { e.currentTarget.style.boxShadow = 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontFamily: 'var(--font-label)', fontSize: 12, fontWeight: 600, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>Email</label>
                      <input
                        type="email" placeholder="Your email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        style={{
                          width: '100%', padding: '14px 18px', borderRadius: 12, border: 'none',
                          background: 'var(--surface-container-low)', fontSize: 15, outline: 'none',
                          fontFamily: 'var(--font-body)', transition: 'box-shadow 0.25s ease',
                        }}
                        onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 2px rgba(0,94,164,0.2)' }}
                        onBlur={(e) => { e.currentTarget.style.boxShadow = 'none' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontFamily: 'var(--font-label)', fontSize: 12, fontWeight: 600, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>Subject</label>
                    <input
                      type="text" placeholder="How can we help?"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      style={{
                        width: '100%', padding: '14px 18px', borderRadius: 12, border: 'none',
                        background: 'var(--surface-container-low)', fontSize: 15, outline: 'none',
                        fontFamily: 'var(--font-body)', transition: 'box-shadow 0.25s ease',
                      }}
                      onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 2px rgba(0,94,164,0.2)' }}
                      onBlur={(e) => { e.currentTarget.style.boxShadow = 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontFamily: 'var(--font-label)', fontSize: 12, fontWeight: 600, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>Message</label>
                    <textarea
                      placeholder="Tell us more..."
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      style={{
                        width: '100%', padding: '14px 18px', borderRadius: 12, border: 'none',
                        background: 'var(--surface-container-low)', fontSize: 15, outline: 'none',
                        fontFamily: 'var(--font-body)', resize: 'vertical', minHeight: 120,
                        transition: 'box-shadow 0.25s ease',
                      }}
                      onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 2px rgba(0,94,164,0.2)' }}
                      onBlur={(e) => { e.currentTarget.style.boxShadow = 'none' }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      padding: '16px 32px', borderRadius: 14,
                      background: 'linear-gradient(135deg, var(--primary), var(--primary-container))',
                      color: 'var(--on-primary)', fontWeight: 700, fontSize: 16,
                      boxShadow: '0 6px 24px rgba(0,94,164,0.2)',
                      transition: 'all 0.3s ease', marginTop: 4,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,94,164,0.3)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,94,164,0.2)'
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18, verticalAlign: 'middle', marginRight: 8 }}>send</span>
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

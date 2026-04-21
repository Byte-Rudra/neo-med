import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useApiData } from '../hooks/useApiData'
import { getPatients, getDoctors, getRooms, getAppointments, getDashboardStats, createPatient, createDoctor, createRoom, createAppointment } from '../lib/api'
import type { Patient, Doctor, Room, Appointment, DashboardStats } from '../lib/api'

const sideLinks = [
  { icon: 'dashboard', label: 'Overview', active: true },
  { icon: 'group', label: 'Patients', active: false },
  { icon: 'calendar_today', label: 'Schedules', active: false },
  { icon: 'settings', label: 'Settings', active: false },
]

// Add-record modal types
type ModalType = 'patient' | 'doctor' | 'room' | 'appointment' | null

function InputField({
  label,
  field,
  type = 'text',
  placeholder = '',
  value,
  onChange,
}: {
  label: string
  field: string
  type?: string
  placeholder?: string
  value: string
  onChange: (field: string, value: string) => void
}) {
  return (
    <div>
      <label style={{ fontFamily: 'var(--font-label)', fontSize: 11, fontWeight: 600, color: 'var(--on-surface-variant)', textTransform: 'uppercase' as const, letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(field, e.target.value)}
        style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: 'none', background: 'var(--surface-container-low)', fontSize: 14, outline: 'none', fontFamily: 'var(--font-body)' }}
        onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 2px rgba(0,94,164,0.2)' }}
        onBlur={(e) => { e.currentTarget.style.boxShadow = 'none' }}
      />
    </div>
  )
}

export default function Dashboard() {
  const { data: patients, loading: pLoading, error: pError, refetch: refetchPatients } = useApiData<Patient[]>(getPatients)
  const { data: doctors, error: dError, refetch: refetchDoctors } = useApiData<Doctor[]>(getDoctors)
  const { data: rooms, error: rError, refetch: refetchRooms } = useApiData<Room[]>(getRooms)
  const { data: appointments, error: aError, refetch: refetchAppointments } = useApiData<Appointment[]>(getAppointments)
  const { data: stats, error: sError, refetch: refetchStats } = useApiData<DashboardStats>(getDashboardStats)

  const [modal, setModal] = useState<ModalType>(null)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [activeSection, setActiveSection] = useState('Overview')
  const readError = pError || dError || rError || aError || sError

  const refetchAll = () => { refetchPatients(); refetchDoctors(); refetchRooms(); refetchAppointments(); refetchStats() }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (modal === 'patient') {
        await createPatient({ name: formData.name || '', email: formData.email || null, phone: formData.phone || null, dob: formData.dob || null })
      } else if (modal === 'doctor') {
        await createDoctor({ name: formData.name || '', specialty: formData.specialty || null, email: formData.email || null, phone: formData.phone || null, available: true })
      } else if (modal === 'room') {
        await createRoom({ roomNumber: formData.roomNumber || '', type: formData.type || null, status: 'AVAILABLE' })
      } else if (modal === 'appointment') {
        await createAppointment({
          patient: { id: parseInt(formData.patientId) },
          doctor: { id: parseInt(formData.doctorId) },
          appointmentDate: formData.date || new Date().toISOString(),
          status: 'SCHEDULED',
          notes: formData.notes || '',
        })
      }
      refetchAll()
      setModal(null)
      setFormData({})
    } catch (err) {
      alert('Error saving: ' + (err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal, .stagger').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [patients, appointments])

  const statCards = [
    { icon: 'group', label: 'Active Patients', value: stats?.activePatients?.toString() || '—', change: `${patients?.length || 0} total`, changeColor: 'var(--secondary)', bg: 'rgba(204,229,255,0.3)' },
    { icon: 'bed', label: 'Available Beds', value: stats?.availableBeds?.toString() || '—', change: `${rooms?.length || 0} rooms`, changeColor: 'var(--tertiary)', bg: 'rgba(213,227,253,0.3)' },
    { icon: 'medical_services', label: 'Staff on Duty', value: stats?.staffOnDuty?.toString() || '—', change: `${doctors?.length || 0} doctors`, changeColor: 'var(--primary)', bg: 'rgba(211,228,255,0.3)' },
    { icon: 'warning', label: 'Pending Appts', value: stats?.criticalAlerts?.toString() || '—', change: 'Scheduled', changeColor: '#fff', changeBg: 'var(--error)', bg: 'rgba(255,218,214,0.5)' },
  ]

  const updateFormField = (field: string, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }))
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: 280, position: 'fixed', top: 0, left: 0, height: '100vh', padding: 24,
        display: 'flex', flexDirection: 'column',
        background: 'rgba(242,244,246,0.8)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        borderRadius: '0 20px 20px 0', boxShadow: '4px 0 32px rgba(25,28,30,0.04)', zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 36 }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: 18, color: 'var(--primary)', letterSpacing: '-0.02em' }}>Dr. Smith</h3>
            <p style={{ fontSize: 13, color: 'var(--on-surface-variant)' }}>Admin Panel</p>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
          {sideLinks.map((link) => (
            <button key={link.label} onClick={() => setActiveSection(link.label)}
              style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 14,
                background: activeSection === link.label ? 'rgba(255,255,255,0.6)' : 'transparent',
                color: activeSection === link.label ? 'var(--primary)' : 'var(--on-surface-variant)',
                fontWeight: activeSection === link.label ? 600 : 500, fontSize: 15,
                transition: 'all 0.25s ease', textDecoration: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
                boxShadow: activeSection === link.label ? '0 2px 8px rgba(0,94,164,0.06)' : 'none',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 22 }}>{link.icon}</span>
              {link.label}
            </button>
          ))}
        </nav>

        <div style={{ paddingTop: 20, borderTop: '1px solid rgba(192,199,212,0.15)' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontVariationSettings: "'FILL' 1" }}>health_and_safety</span>
            <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: 18, color: 'var(--primary)', letterSpacing: '-0.02em' }}>NEO-MED</span>
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: 280, flex: 1, minHeight: '100vh' }}>
        <header style={{
          position: 'sticky', top: 0, zIndex: 40,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px',
          background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)', boxShadow: '0 2px 12px rgba(25,28,30,0.03)',
        }}>
          <h1 style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: 22 }}>
            {activeSection === 'Overview' ? 'Dashboard Overview' : activeSection}
            <span style={{ fontSize: 13, color: 'var(--on-surface-variant)', fontWeight: 400, marginLeft: 12 }}>
              {pLoading ? 'Loading...' : 'Live from Supabase'}
            </span>
          </h1>
          <div style={{ display: 'flex', gap: 10 }}>
            {['patient', 'doctor', 'room', 'appointment'].map((type) => (
              <button key={type} onClick={() => { setModal(type as ModalType); setFormData({}) }}
                style={{
                  padding: '8px 16px', borderRadius: 10,
                  background: 'var(--surface-container-low)', color: 'var(--primary)',
                  fontSize: 13, fontWeight: 600, transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary-fixed)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--surface-container-low)' }}
              >
                + {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </header>

        <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 28 }}>
          {readError && (
            <section className="reveal" style={{
              background: 'rgba(255, 218, 214, 0.45)',
              border: '1px solid rgba(186, 26, 26, 0.15)',
              color: 'var(--on-surface)',
              padding: 20,
              borderRadius: 18,
            }}>
              <h3 style={{ fontFamily: 'var(--font-headline)', fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
                Live data is currently unavailable
              </h3>
              <p style={{ fontSize: 14, color: 'var(--on-surface-variant)', lineHeight: 1.6 }}>
                {readError}
              </p>
            </section>
          )}

          {/* Stats */}
          {(activeSection === 'Overview' || activeSection === 'Settings') && (
            <section className="stagger reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
              {statCards.map((card) => (
                <div key={card.label} style={{
                  background: 'var(--surface-container-lowest)', padding: 24, borderRadius: 16,
                  display: 'flex', flexDirection: 'column', gap: 16, transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)', cursor: 'pointer',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ padding: 10, borderRadius: 12, background: card.bg }}>
                      <span className="material-symbols-outlined" style={{ color: card.changeBg ? 'var(--error)' : (card.changeColor as string), fontVariationSettings: card.label === 'Pending Appts' ? "'FILL' 1" : "'FILL' 0" }}>{card.icon}</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: card.changeBg ? card.changeColor : card.changeColor, background: card.changeBg || 'transparent', padding: card.changeBg ? '3px 10px' : 0, borderRadius: 99 }}>{card.change}</span>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'var(--font-label)', fontSize: 12, color: 'var(--on-surface-variant)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</p>
                    <h4 style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: 30, color: 'var(--on-surface)', marginTop: 4, letterSpacing: '-0.02em' }}>{card.value}</h4>
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Patients Table (Overview or Patients) */}
          {(activeSection === 'Overview' || activeSection === 'Patients') && (
            <section className="reveal" style={{ display: 'grid', gridTemplateColumns: activeSection === 'Patients' ? '1fr' : '2fr 1fr', gap: 24 }}>
              <div style={{ background: 'var(--surface-container-lowest)', padding: 32, borderRadius: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                  <h3 style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: 20 }}>
                    {activeSection === 'Patients' ? 'All Patients' : 'Recent Patients'}
                    <span style={{ fontSize: 13, color: 'var(--on-surface-variant)', fontWeight: 400, marginLeft: 8 }}>({patients?.length || 0})</span>
                  </h3>
                  <button onClick={() => { setModal('patient'); setFormData({}) }} style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 14, background: 'none', border: 'none', cursor: 'pointer' }}>+ Add Patient</button>
                </div>
                {pError ? (
                  <div style={{ textAlign: 'center', padding: 40, color: 'var(--error)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--error)' }}>error</span>
                    <p style={{ marginTop: 12, fontSize: 15 }}>Unable to load patients.</p>
                    <p style={{ marginTop: 8, fontSize: 13, color: 'var(--on-surface-variant)' }}>{pError}</p>
                  </div>
                ) : pLoading ? (
                  <div style={{ textAlign: 'center', padding: 40, color: 'var(--on-surface-variant)' }}>
                    <span className="material-symbols-outlined animate-float" style={{ fontSize: 40, color: 'var(--primary)' }}>hourglass_empty</span>
                    <p style={{ marginTop: 12 }}>Loading from Supabase...</p>
                  </div>
                ) : patients && patients.length > 0 ? (
                  <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(192,199,212,0.15)' }}>
                        {['ID', 'Name', 'Email', 'Phone', 'DOB'].map((h) => (
                          <th key={h} style={{ paddingBottom: 14, fontFamily: 'var(--font-label)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--on-surface-variant)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(activeSection === 'Overview' ? patients.slice(-5).reverse() : patients).map((p) => (
                        <tr key={p.id} style={{ borderBottom: '1px solid rgba(192,199,212,0.08)', transition: 'background 0.2s', cursor: 'pointer' }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(242,244,246,0.5)' }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                        >
                          <td style={{ padding: '16px 0', fontSize: 13, color: 'var(--on-surface-variant)' }}>#{p.id}</td>
                          <td style={{ padding: '16px 0', fontWeight: 600, fontSize: 14 }}>{p.name}</td>
                          <td style={{ padding: '16px 0', fontSize: 13, color: 'var(--on-surface-variant)' }}>{p.email || '—'}</td>
                          <td style={{ padding: '16px 0', fontSize: 13, color: 'var(--on-surface-variant)' }}>{p.phone || '—'}</td>
                          <td style={{ padding: '16px 0', fontSize: 13, color: 'var(--on-surface-variant)' }}>{p.dob || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div style={{ textAlign: 'center', padding: 40, color: 'var(--on-surface-variant)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--outline)' }}>person_off</span>
                    <p style={{ marginTop: 12, fontSize: 15 }}>No patients found in database.</p>
                    <button onClick={() => { setModal('patient'); setFormData({}) }} style={{
                      marginTop: 16, padding: '10px 24px', borderRadius: 12,
                      background: 'linear-gradient(135deg, var(--primary), var(--primary-container))',
                      color: '#fff', fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer',
                    }}>Add First Patient</button>
                  </div>
                )}
              </div>

              {activeSection === 'Overview' && (
                <div style={{ background: 'var(--surface-container-low)', padding: 32, borderRadius: 18, display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <h3 style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: 20 }}>Rooms ({rooms?.length || 0})</h3>
                  {rError ? (
                    <p style={{ fontSize: 14, color: 'var(--error)', textAlign: 'center', padding: 20 }}>
                      Unable to load rooms. {rError}
                    </p>
                  ) : rooms && rooms.length > 0 ? rooms.slice(0, 6).map((r) => (
                    <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: 12, background: 'var(--surface-container-lowest)' }}>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: 14 }}>Room {r.roomNumber}</p>
                        <p style={{ fontFamily: 'var(--font-label)', fontSize: 12, color: 'var(--on-surface-variant)' }}>{r.type || 'General'}</p>
                      </div>
                      <span style={{
                        padding: '4px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700,
                        background: r.status === 'AVAILABLE' ? 'rgba(0,199,120,0.1)' : r.status === 'OCCUPIED' ? 'rgba(255,218,214,0.4)' : 'rgba(224,227,229,0.5)',
                        color: r.status === 'AVAILABLE' ? '#059669' : r.status === 'OCCUPIED' ? 'var(--error)' : 'var(--on-surface-variant)',
                      }}>{r.status}</span>
                    </div>
                  )) : (
                    <p style={{ fontSize: 14, color: 'var(--on-surface-variant)', textAlign: 'center', padding: 20 }}>No rooms configured yet.</p>
                  )}
                </div>
              )}
            </section>
          )}

          {/* Schedules section */}
          {activeSection === 'Schedules' && (
            <section className="reveal" style={{ background: 'var(--surface-container-lowest)', padding: 32, borderRadius: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                <h3 style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: 20 }}>
                  Appointments
                  <span style={{ fontSize: 13, color: 'var(--on-surface-variant)', fontWeight: 400, marginLeft: 8 }}>({appointments?.length || 0})</span>
                </h3>
                <button onClick={() => { setModal('appointment'); setFormData({}) }} style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 14, background: 'none', border: 'none', cursor: 'pointer' }}>+ Schedule</button>
              </div>
              {aError ? (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--error)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--error)' }}>error</span>
                  <p style={{ marginTop: 12 }}>Unable to load appointments.</p>
                  <p style={{ marginTop: 8, fontSize: 13, color: 'var(--on-surface-variant)' }}>{aError}</p>
                </div>
              ) : appointments && appointments.length > 0 ? (
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(192,199,212,0.15)' }}>
                      {['ID', 'Patient', 'Doctor', 'Date', 'Status', 'Notes'].map((h) => (
                        <th key={h} style={{ paddingBottom: 14, fontFamily: 'var(--font-label)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--on-surface-variant)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((a) => (
                      <tr key={a.id} style={{ borderBottom: '1px solid rgba(192,199,212,0.08)' }}>
                        <td style={{ padding: '16px 0', fontSize: 13, color: 'var(--on-surface-variant)' }}>#{a.id}</td>
                        <td style={{ padding: '16px 0', fontWeight: 600, fontSize: 14 }}>{a.patient?.name || '—'}</td>
                        <td style={{ padding: '16px 0', fontSize: 13 }}>{a.doctor?.name || '—'}</td>
                        <td style={{ padding: '16px 0', fontSize: 13, color: 'var(--on-surface-variant)' }}>{a.appointmentDate ? new Date(a.appointmentDate).toLocaleDateString() : '—'}</td>
                        <td style={{ padding: '16px 0' }}>
                          <span style={{
                            padding: '4px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700,
                            background: a.status === 'COMPLETED' ? 'rgba(0,199,120,0.1)' : a.status === 'CANCELLED' ? 'rgba(255,218,214,0.4)' : 'rgba(204,229,255,0.4)',
                            color: a.status === 'COMPLETED' ? '#059669' : a.status === 'CANCELLED' ? 'var(--error)' : 'var(--primary)',
                          }}>{a.status}</span>
                        </td>
                        <td style={{ padding: '16px 0', fontSize: 13, color: 'var(--on-surface-variant)' }}>{a.notes || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--on-surface-variant)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--outline)' }}>calendar_month</span>
                  <p style={{ marginTop: 12 }}>No appointments scheduled.</p>
                </div>
              )}
            </section>
          )}

          {/* Settings section — show doctors */}
          {activeSection === 'Settings' && (
            <section className="reveal" style={{ background: 'var(--surface-container-lowest)', padding: 32, borderRadius: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                <h3 style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: 20 }}>
                  Doctors
                  <span style={{ fontSize: 13, color: 'var(--on-surface-variant)', fontWeight: 400, marginLeft: 8 }}>({doctors?.length || 0})</span>
                </h3>
                <button onClick={() => { setModal('doctor'); setFormData({}) }} style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 14, background: 'none', border: 'none', cursor: 'pointer' }}>+ Add Doctor</button>
              </div>
              {dError ? (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--error)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--error)' }}>error</span>
                  <p style={{ marginTop: 12 }}>Unable to load doctors.</p>
                  <p style={{ marginTop: 8, fontSize: 13, color: 'var(--on-surface-variant)' }}>{dError}</p>
                </div>
              ) : doctors && doctors.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                  {doctors.map((d) => (
                    <div key={d.id} style={{ padding: 24, borderRadius: 16, background: 'var(--surface-container-low)', display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: 15 }}>{d.name}</p>
                        <p style={{ fontFamily: 'var(--font-label)', fontSize: 12, color: 'var(--on-surface-variant)' }}>{d.specialty || 'General'} · {d.available ? 'Available' : 'Busy'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--on-surface-variant)' }}>
                  <p>No doctors registered yet.</p>
                </div>
              )}
            </section>
          )}
        </div>
      </main>

      {/* Modal overlay */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}
          onClick={() => setModal(null)}
        >
          <div style={{
            background: 'var(--surface-container-lowest)', borderRadius: 20, padding: 36, width: 480, maxHeight: '80vh', overflowY: 'auto',
            boxShadow: '0 24px 80px rgba(0,0,0,0.15)', animation: 'fade-in-up 0.3s ease forwards',
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: 22, marginBottom: 24 }}>
              Add {modal.charAt(0).toUpperCase() + modal.slice(1)}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {modal === 'patient' && (<>
                <InputField label="Name" field="name" placeholder="Patient full name" value={formData.name || ''} onChange={updateFormField} />
                <InputField label="Email" field="email" type="email" placeholder="email@example.com" value={formData.email || ''} onChange={updateFormField} />
                <InputField label="Phone" field="phone" placeholder="+1 234 567 8900" value={formData.phone || ''} onChange={updateFormField} />
                <InputField label="Date of Birth" field="dob" placeholder="1990-01-15" value={formData.dob || ''} onChange={updateFormField} />
              </>)}
              {modal === 'doctor' && (<>
                <InputField label="Name" field="name" placeholder="Doctor full name" value={formData.name || ''} onChange={updateFormField} />
                <InputField label="Specialty" field="specialty" placeholder="e.g. Neurology" value={formData.specialty || ''} onChange={updateFormField} />
                <InputField label="Email" field="email" type="email" placeholder="doctor@hospital.com" value={formData.email || ''} onChange={updateFormField} />
                <InputField label="Phone" field="phone" placeholder="+1 234 567 8900" value={formData.phone || ''} onChange={updateFormField} />
              </>)}
              {modal === 'room' && (<>
                <InputField label="Room Number" field="roomNumber" placeholder="e.g. R-101" value={formData.roomNumber || ''} onChange={updateFormField} />
                <InputField label="Type" field="type" placeholder="e.g. ICU, General, VIP" value={formData.type || ''} onChange={updateFormField} />
              </>)}
              {modal === 'appointment' && (<>
                <InputField label="Patient ID" field="patientId" type="number" placeholder="e.g. 1" value={formData.patientId || ''} onChange={updateFormField} />
                <InputField label="Doctor ID" field="doctorId" type="number" placeholder="e.g. 1" value={formData.doctorId || ''} onChange={updateFormField} />
                <InputField label="Date" field="date" type="datetime-local" value={formData.date || ''} onChange={updateFormField} />
                <InputField label="Notes" field="notes" placeholder="Appointment notes..." value={formData.notes || ''} onChange={updateFormField} />
              </>)}
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
              <button onClick={() => setModal(null)} style={{
                flex: 1, padding: '14px', borderRadius: 12, background: 'var(--surface-container-low)',
                color: 'var(--on-surface-variant)', fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer',
              }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={{
                flex: 1, padding: '14px', borderRadius: 12,
                background: 'linear-gradient(135deg, var(--primary), var(--primary-container))',
                color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer',
                opacity: saving ? 0.6 : 1,
              }}>
                {saving ? 'Saving...' : 'Save to Database'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

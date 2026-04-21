import { Link } from 'react-router-dom'
import { useState } from 'react'
import Navbar from '../components/Navbar'
import { useApiData } from '../hooks/useApiData'
import { getPatients, getAppointments } from '../lib/api'
import type { Patient, Appointment } from '../lib/api'

const tabs = ['All Patients', 'Appointments']

export default function PatientPortal() {
  const [activeTab, setActiveTab] = useState(0)
  const { data: patients, loading: pLoading, error: pError } = useApiData<Patient[]>(getPatients)
  const { data: appointments, loading: aLoading, error: aError } = useApiData<Appointment[]>(getAppointments)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  const loading = pLoading || aLoading
  const dataError = pError || aError

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 90, maxWidth: 1400, margin: '0 auto', padding: '90px 32px 64px' }}>
        {/* Breadcrumb */}
        <div className="animate-fade-in-up" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
          <Link to="/dashboard" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', borderRadius: 10,
            background: 'var(--surface-container-low)', color: 'var(--primary)',
            fontSize: 14, fontWeight: 600, textDecoration: 'none', transition: 'all 0.25s ease',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>
            Dashboard
          </Link>
          <span style={{ color: 'var(--outline)', fontSize: 14 }}>/</span>
          <span style={{ color: 'var(--on-surface-variant)', fontSize: 14, fontWeight: 500 }}>Patient Portal</span>
          <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--on-surface-variant)' }}>
            {loading ? 'Loading...' : `${patients?.length || 0} patients · ${appointments?.length || 0} appointments`}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selectedPatient ? '340px 1fr' : '1fr', gap: 28, alignItems: 'flex-start' }}>
          {/* Patient Detail Card (shown when selected) */}
          {selectedPatient && (
            <div className="animate-slide-left" style={{
              background: 'var(--surface-container-lowest)', borderRadius: 20, padding: 36,
              display: 'flex', flexDirection: 'column', textAlign: 'center',
              position: 'sticky', top: 100,
            }}>
              <button onClick={() => setSelectedPatient(null)} style={{
                alignSelf: 'flex-start', padding: '6px 14px', borderRadius: 8, background: 'var(--surface-container-low)',
                color: 'var(--on-surface-variant)', fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer', marginBottom: 20,
              }}>← Back to list</button>

              <h2 style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: 22, marginBottom: 4 }}>{selectedPatient.name}</h2>
              <p style={{ fontFamily: 'var(--font-label)', fontSize: 13, color: 'var(--on-surface-variant)', marginBottom: 24 }}>ID: #{selectedPatient.id}</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, width: '100%', marginBottom: 28 }}>
                {[
                  { label: 'DOB', value: selectedPatient.dob || 'N/A' },
                  { label: 'Phone', value: selectedPatient.phone || 'N/A' },
                  { label: 'Email', value: selectedPatient.email || 'N/A' },
                  { label: 'Registered', value: selectedPatient.registeredAt ? new Date(selectedPatient.registeredAt).toLocaleDateString() : 'N/A' },
                ].map((item) => (
                  <div key={item.label} style={{ padding: '14px 12px', borderRadius: 12, background: 'var(--surface-container-low)', textAlign: 'center' }}>
                    <p style={{ fontFamily: 'var(--font-label)', fontSize: 10, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{item.label}</p>
                    <p style={{ fontWeight: 600, fontSize: 13, color: 'var(--on-surface)', marginTop: 4, wordBreak: 'break-all' }}>{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Patient's appointments */}
              <div style={{ width: '100%', textAlign: 'left' }}>
                <p style={{ fontFamily: 'var(--font-label)', fontSize: 11, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: 12 }}>
                  Appointments
                </p>
                {appointments?.filter((a) => a.patient?.id === selectedPatient.id).length ? (
                  appointments.filter((a) => a.patient?.id === selectedPatient.id).map((a) => (
                    <div key={a.id} style={{ padding: '12px 16px', borderRadius: 12, background: 'var(--surface-container-low)', marginBottom: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ fontWeight: 600, fontSize: 13 }}>Dr. {a.doctor?.name || 'Unknown'}</p>
                        <span style={{
                          padding: '3px 10px', borderRadius: 6, fontSize: 10, fontWeight: 700,
                          background: a.status === 'COMPLETED' ? 'rgba(0,199,120,0.1)' : 'rgba(204,229,255,0.4)',
                          color: a.status === 'COMPLETED' ? '#059669' : 'var(--primary)',
                        }}>{a.status}</span>
                      </div>
                      <p style={{ fontSize: 12, color: 'var(--on-surface-variant)', marginTop: 4 }}>
                        {a.appointmentDate ? new Date(a.appointmentDate).toLocaleString() : 'No date'} {a.notes ? `· ${a.notes}` : ''}
                      </p>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: 13, color: 'var(--outline)', textAlign: 'center', padding: 16 }}>No appointments found.</p>
                )}
              </div>
            </div>
          )}

          {/* Main content - Tabbed */}
          <div className="animate-slide-right" style={{ opacity: 0 }}>
            {dataError && (
              <div style={{
                marginBottom: 20,
                background: 'rgba(255, 218, 214, 0.45)',
                border: '1px solid rgba(186, 26, 26, 0.15)',
                borderRadius: 16,
                padding: 18,
              }}>
                <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--on-surface)' }}>Unable to load live records</p>
                <p style={{ marginTop: 8, fontSize: 13, color: 'var(--on-surface-variant)', lineHeight: 1.6 }}>{dataError}</p>
              </div>
            )}

            <div style={{
              display: 'flex', gap: 4, marginBottom: 28,
              background: 'var(--surface-container-low)', padding: 6, borderRadius: 16,
            }}>
              {tabs.map((tab, i) => (
                <button key={tab} onClick={() => setActiveTab(i)}
                  style={{
                    flex: 1, padding: '12px 20px', borderRadius: 12,
                    background: activeTab === i ? 'var(--surface-container-lowest)' : 'transparent',
                    color: activeTab === i ? 'var(--primary)' : 'var(--on-surface-variant)',
                    fontWeight: activeTab === i ? 700 : 500, fontSize: 14, transition: 'all 0.25s ease',
                    boxShadow: activeTab === i ? '0 2px 8px rgba(0,0,0,0.04)' : 'none',
                    border: 'none', cursor: 'pointer',
                  }}
                >{tab}</button>
              ))}
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: 60, color: 'var(--on-surface-variant)' }}>
                <span className="material-symbols-outlined animate-float" style={{ fontSize: 48, color: 'var(--primary)' }}>hourglass_empty</span>
                <p style={{ marginTop: 16, fontSize: 16 }}>Fetching data from Supabase...</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {activeTab === 0 && pError ? (
                  <div style={{ textAlign: 'center', padding: 60, color: 'var(--error)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--error)' }}>error</span>
                    <p style={{ marginTop: 12 }}>Unable to load patients.</p>
                    <p style={{ marginTop: 8, fontSize: 13, color: 'var(--on-surface-variant)' }}>{pError}</p>
                  </div>
                ) : activeTab === 0 && patients && patients.length > 0 ? patients.map((p) => (
                  <div key={p.id} onClick={() => setSelectedPatient(p)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 20,
                      padding: 24, borderRadius: 16, background: 'var(--surface-container-lowest)',
                      transition: 'all 0.3s ease', cursor: 'pointer',
                      border: selectedPatient?.id === p.id ? '2px solid var(--primary)' : '2px solid transparent',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.04)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.boxShadow = 'none' }}
                  >
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{p.name}</p>
                      <p style={{ fontFamily: 'var(--font-label)', fontSize: 12, color: 'var(--on-surface-variant)' }}>
                        {p.email || 'No email'} · {p.phone || 'No phone'} · DOB: {p.dob || 'N/A'}
                      </p>
                    </div>
                    <span style={{ fontFamily: 'var(--font-label)', fontSize: 12, color: 'var(--outline)' }}>#{p.id}</span>
                  </div>
                )) : activeTab === 0 && (
                  <div style={{ textAlign: 'center', padding: 60, color: 'var(--on-surface-variant)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--outline)' }}>person_off</span>
                    <p style={{ marginTop: 12 }}>No patients in database. Add patients from the Dashboard.</p>
                  </div>
                )}

                {activeTab === 1 && aError ? (
                  <div style={{ textAlign: 'center', padding: 60, color: 'var(--error)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--error)' }}>error</span>
                    <p style={{ marginTop: 12 }}>Unable to load appointments.</p>
                    <p style={{ marginTop: 8, fontSize: 13, color: 'var(--on-surface-variant)' }}>{aError}</p>
                  </div>
                ) : activeTab === 1 && appointments && appointments.length > 0 ? appointments.map((a) => (
                  <div key={a.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 20,
                      padding: 24, borderRadius: 16, background: 'var(--surface-container-lowest)',
                      transition: 'all 0.3s ease', cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateX(4px)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateX(0)' }}
                  >
                    <div style={{ padding: 12, borderRadius: 14, background: a.status === 'COMPLETED' ? 'rgba(0,199,120,0.1)' : 'rgba(204,229,255,0.3)' }}>
                      <span className="material-symbols-outlined" style={{
                        color: a.status === 'COMPLETED' ? '#059669' : 'var(--primary)',
                        fontVariationSettings: "'FILL' 1",
                      }}>calendar_month</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>
                        {a.patient?.name || 'Unknown Patient'} → Dr. {a.doctor?.name || 'Unknown'}
                      </p>
                      <p style={{ fontFamily: 'var(--font-label)', fontSize: 12, color: 'var(--on-surface-variant)' }}>
                        {a.appointmentDate ? new Date(a.appointmentDate).toLocaleString() : 'No date'} {a.notes ? `· ${a.notes}` : ''}
                      </p>
                    </div>
                    <span style={{
                      padding: '4px 14px', borderRadius: 8, fontSize: 11, fontWeight: 700,
                      background: a.status === 'COMPLETED' ? 'rgba(0,199,120,0.1)' : a.status === 'CANCELLED' ? 'rgba(255,218,214,0.4)' : 'rgba(204,229,255,0.4)',
                      color: a.status === 'COMPLETED' ? '#059669' : a.status === 'CANCELLED' ? 'var(--error)' : 'var(--primary)',
                    }}>{a.status}</span>
                  </div>
                )) : activeTab === 1 && (
                  <div style={{ textAlign: 'center', padding: 60, color: 'var(--on-surface-variant)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--outline)' }}>event_busy</span>
                    <p style={{ marginTop: 12 }}>No appointments found. Schedule one from the Dashboard.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}

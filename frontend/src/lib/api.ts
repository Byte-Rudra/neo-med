// API service layer — connects to the Spring Boot backend backed by Supabase Postgres.
const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api').replace(/\/$/, '')

// ============ Types ============

export interface Patient {
  id: number
  name: string
  email: string | null
  phone: string | null
  dob: string | null
  registeredAt: string | null
}

export interface Doctor {
  id: number
  name: string
  specialty: string | null
  email: string | null
  phone: string | null
  available: boolean
}

export interface Appointment {
  id: number
  patient: Patient
  doctor: Doctor
  appointmentDate: string | null
  status: string
  notes: string | null
}

export interface Room {
  id: number
  roomNumber: string
  type: string | null
  status: string
  currentPatient: Patient | null
}

// Dashboard stats derived from real data
export interface DashboardStats {
  activePatients: number
  availableBeds: number
  staffOnDuty: number
  criticalAlerts: number
}

// ============ API Functions ============

function buildNetworkErrorMessage(error: unknown) {
  const details = error instanceof Error && error.message ? ` ${error.message}` : ''
  return `Could not reach backend at ${API_BASE}. Make sure the Spring Boot server is running and that it can connect to Supabase.${details}`
}

async function requestJSON<T>(url: string, init?: RequestInit): Promise<T> {
  let res: Response

  try {
    res = await fetch(url, init)
  } catch (error) {
    throw new Error(buildNetworkErrorMessage(error))
  }

  if (!res.ok) {
    const responseText = (await res.text()).trim()
    const details = responseText ? ` - ${responseText}` : ''
    throw new Error(`API error: ${res.status} ${res.statusText}${details}`)
  }

  return res.json()
}

async function fetchJSON<T>(url: string): Promise<T> {
  return requestJSON<T>(url)
}

async function postJSON<T>(url: string, body: unknown): Promise<T> {
  return requestJSON<T>(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

// --- Patients ---
export const getPatients = () => fetchJSON<Patient[]>(`${API_BASE}/patients`)

export const createPatient = (patient: Omit<Patient, 'id' | 'registeredAt'>) =>
  postJSON<Patient>(`${API_BASE}/patients`, patient)

// --- Doctors ---
export const getDoctors = () => fetchJSON<Doctor[]>(`${API_BASE}/doctors`)

export const createDoctor = (doctor: Omit<Doctor, 'id'>) =>
  postJSON<Doctor>(`${API_BASE}/doctors`, doctor)

// --- Appointments ---
export const getAppointments = () => fetchJSON<Appointment[]>(`${API_BASE}/appointments`)

export const createAppointment = (appointment: {
  patient: { id: number }
  doctor: { id: number }
  appointmentDate: string
  status: string
  notes?: string
}) => postJSON<Appointment>(`${API_BASE}/appointments`, appointment)

// --- Rooms ---
export const getRooms = () => fetchJSON<Room[]>(`${API_BASE}/rooms`)

export const createRoom = (room: Omit<Room, 'id' | 'currentPatient'>) =>
  postJSON<Room>(`${API_BASE}/rooms`, room)

// --- Dashboard Stats (computed from real data) ---
export async function getDashboardStats(): Promise<DashboardStats> {
  const [patients, rooms, doctors, appointments] = await Promise.all([
    getPatients(),
    getRooms(),
    getDoctors(),
    getAppointments(),
  ])

  const availableBeds = rooms.filter((r) => r.status === 'AVAILABLE').length
  const criticalAlerts = appointments.filter((a) => a.status === 'SCHEDULED').length

  return {
    activePatients: patients.length,
    availableBeds,
    staffOnDuty: doctors.filter((d) => d.available).length,
    criticalAlerts,
  }
}

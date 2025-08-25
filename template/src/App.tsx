import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import './App.css'
import UserLayout from './layouts/UserLayout'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import About from './pages/About'
import Contact from './pages/Contact'
import AppointmentPatient from './pages/AppointmentPatient'
import AdminLayout from './layouts/AdminLayout'
import DashboardAdmin from './pages/Admin/DashboardAdmin'
import DoctorAdmin from './pages/Admin/DoctorAdmin'
import UserAdmin from './pages/Admin/UserAdmin'
import AppointmentAdmin from './pages/Admin/AppointmentAdmin'
import PatientAdmin from './pages/Admin/PatientAdmin'
import { AuthProvider } from './contexts/AuthContext'
import Chatbot from './pages/Chatbot'
import UserProfile from './pages/UserProfile'
import DoctorLayout from './layouts/DoctorLayout'
import AppointmentDoctor from './pages/Doctor/AppointmentDoctor'
import MedicalRecord from './pages/Doctor/MedicalRecord'
import DoctorProfile from './pages/Doctor/DoctorProfile'

function App() {

  return (
    <AuthProvider>
      <Routes>
        <Route path='/' element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        <Route path="appointment" element={<AppointmentPatient />} />
        <Route path="chat-ai" element={<Chatbot />} />
        <Route path="user-profile" element={<UserProfile />} />

        <Route path='doctor' element={<DoctorLayout />}>
          <Route index element={<AppointmentDoctor />} />
          <Route path="appointments" element={<AppointmentDoctor />} />
          <Route path="medical-records" element={<MedicalRecord />} />
          <Route path="profile" element={<DoctorProfile />} />
        </Route>

        <Route path='admin' element={<AdminLayout />}>
          <Route index element={<DashboardAdmin />} />
          <Route path="doctors" element={<DoctorAdmin />} />
          <Route path="users" element={<UserAdmin />} />
          <Route path="appointments" element={<AppointmentAdmin />} />
          <Route path="patients" element={<PatientAdmin />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App

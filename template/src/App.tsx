import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import './App.css'
import UserLayout from './layouts/UserLayout'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import About from './pages/About'
import Contact from './pages/Contact'
import Appointment from './pages/Appointment'
import AdminLayout from './layouts/AdminLayout'
import DashboardAdmin from './pages/Admin/DashboardAdmin'
import DoctorAdmin from './pages/Admin/DoctorAdmin'
import UserAdmin from './pages/Admin/UserAdmin'
import AppointmentAdmin from './pages/Admin/AppointmentAdmin'
import PatientAdmin from './pages/Admin/PatientAdmin'
import { AuthProvider } from './contexts/AuthContext'
import Chatbot from './pages/Chatbot'


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

        <Route path="appointment" element={<Appointment />} />
        <Route path="chat-ai" element={<Chatbot />} />

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

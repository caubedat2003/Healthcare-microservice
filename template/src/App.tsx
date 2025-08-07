import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import './App.css'
import UserLayout from './layouts/UserLayout'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import About from './pages/About'
import Contact from './pages/Contact'
import Appointment from './pages/Appointment'

function App() {

  return (
    <Routes>
      <Route path='/' element={<UserLayout />}>
        <Route index element={<Home />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="appointment" element={<Appointment />} />
      </Route>
    </Routes>
  )
}

export default App

import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Meeting from './pages/Meeting'
import Summary from './pages/Summary'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/meeting/:roomName" element={<Meeting />} />
        <Route path="/summary/:meetingId" element={<Summary />} />
      </Routes>
    </BrowserRouter>
  )
}

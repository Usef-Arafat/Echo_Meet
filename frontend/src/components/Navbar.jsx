import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar({ onStartMeeting }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-em-dark/80 backdrop-blur-xl border-b border-white/10">
      {/* Logo + Brand */}
      <Link to="/" className="flex items-center gap-3 group">
        <img src="/logo.svg" alt="Echo Meet Logo" className="w-10 h-10 group-hover:scale-110 transition-transform duration-300" />
        <span className="text-xl font-bold tracking-tight">
          Echo <span className="text-gradient">Meet</span>
        </span>
      </Link>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
        <a href="#features" className="hover:text-white transition-colors duration-200">Features</a>
        <a href="#how-it-works" className="hover:text-white transition-colors duration-200">How It Works</a>
      </div>

      {/* CTA */}
      <button
        id="navbar-start-meeting"
        onClick={onStartMeeting}
        className="btn-cta text-sm px-6 py-3"
      >
        Start Free Meeting
      </button>
    </nav>
  )
}

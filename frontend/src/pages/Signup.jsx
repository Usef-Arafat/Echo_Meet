import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function Signup() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0F111A] font-sans transition-colors duration-300">
      <Navbar onStartMeeting={() => navigate('/')} />

      <div className="pt-32 pb-20 px-6 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md bg-white dark:bg-[#0b0f19] rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-[#2563EB] dark:text-blue-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#1E1A3C] dark:text-white mb-2">Create Account</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Join Echo Meet for a distraction-free experience.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent bg-white dark:bg-[#1e293b] text-[#1E1A3C] dark:text-white transition-colors duration-200"
                    placeholder="John"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  className="block w-full px-3 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent bg-white dark:bg-[#1e293b] text-[#1E1A3C] dark:text-white transition-colors duration-200"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent bg-white dark:bg-[#1e293b] text-[#1E1A3C] dark:text-white transition-colors duration-200"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent bg-white dark:bg-[#1e293b] text-[#1E1A3C] dark:text-white transition-colors duration-200"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 text-[#2563EB] border-gray-300 rounded focus:ring-[#2563EB] dark:border-white/10 dark:bg-[#1e293b]"
              />
              <label htmlFor="terms" className="text-sm text-gray-500 dark:text-gray-400">
                I agree to the <a href="#" className="font-semibold text-[#2563EB] dark:text-blue-400 hover:underline">Terms & Privacy</a>.
              </label>
            </div>

            <button type="submit" className="w-full btn-cta flex items-center justify-center gap-2 py-3 mt-4">
              Get Started
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            Already a member?{' '}
            <Link to="/login" className="font-semibold text-[#2563EB] dark:text-blue-400 hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

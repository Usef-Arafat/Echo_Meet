import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import RoomModal from '../components/RoomModal'

const features = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    color: 'em-pink',
    colorHex: '#E91E8C',
    title: 'AI Transcription',
    desc: 'Every word captured in real time. Fully searchable, speaker-labeled, and accurate — so you never miss a detail.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    color: 'em-teal',
    colorHex: '#2DBFB8',
    title: 'Smart Summary',
    desc: 'AI distills your entire meeting into a crisp executive summary — ready to share the moment you hang up.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    color: 'em-blue',
    colorHex: '#2D7DD2',
    title: 'Ask Your Meeting',
    desc: 'Chat with your meeting after it ends. Ask questions, get answers, and extract exactly what you need.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    color: 'em-orange',
    colorHex: '#F47C2B',
    title: 'Action Items',
    desc: 'Automatically extracted tasks, owners, and deadlines from your conversation — no manual follow-up needed.',
  },
]

const steps = [
  {
    n: '01',
    title: 'Create a Room',
    desc: 'Click "Start Free Meeting." Echo Meet instantly generates a secure video room — no downloads, no setup.',
  },
  {
    n: '02',
    title: 'Meet & Discuss',
    desc: 'Invite your team with a single link. Our AI joins silently in the background, capturing everything.',
  },
  {
    n: '03',
    title: 'Get Your Summary',
    desc: 'The moment the call ends, you receive a full transcript, a concise summary, and prioritized action items.',
  },
]

export default function Home() {
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  function handleConfirm({ meeting_id, room_name, room_url }) {
    setShowModal(false)
    navigate(`/meeting/${room_name}?url=${encodeURIComponent(room_url)}&meetingId=${meeting_id}`)
  }

  return (
    <div className="min-h-screen bg-em-dark font-sans overflow-x-hidden">
      <Navbar onStartMeeting={() => setShowModal(true)} />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-em-pink/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-em-teal/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-em-blue/10 rounded-full blur-[160px] pointer-events-none" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/15 rounded-full px-4 py-2 mb-8 text-sm font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-em-pink opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-em-pink" />
          </span>
          AI-Powered Video Conferencing — Now Live
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 max-w-5xl">
          Meetings that{' '}
          <span className="text-gradient">think for you</span>
        </h1>
        <p className="text-lg md:text-xl text-white/60 max-w-2xl mb-12 leading-relaxed">
          Echo Meet combines crystal-clear video conferencing with real-time AI transcription,
          instant smart summaries, and auto-extracted action items.
          <strong className="text-white/90"> Stop taking notes. Start making decisions.</strong>
        </p>

        {/* CTA group */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <button
            id="hero-start-meeting"
            onClick={() => setShowModal(true)}
            className="btn-cta text-lg px-10 py-5 glow-pink"
          >
            Start Free Meeting →
          </button>
          <a
            href="#how-it-works"
            className="btn-outline text-base"
          >
            See How It Works
          </a>
        </div>

        {/* Social proof */}
        <div className="mt-16 flex items-center gap-6 text-sm text-white/40">
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-em-teal" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
            No downloads
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-em-teal" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
            No credit card
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-em-teal" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
            End-to-end encrypted
          </span>
        </div>

        {/* Hero mockup card */}
        <div className="mt-20 w-full max-w-4xl mx-auto glass-card overflow-hidden">
          <div className="bg-em-dark/60 px-4 py-3 border-b border-white/10 flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
            <div className="flex-1 flex items-center gap-2 bg-white/5 rounded-lg px-3 py-1 text-xs text-white/40">
              🔒 echomeet.daily.co/SwiftFalcon3472
            </div>
            <div className="flex items-center gap-1.5 text-xs text-em-teal">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-em-teal opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-em-teal" />
              </span>
              Live
            </div>
          </div>
          <div className="relative aspect-video bg-gradient-to-br from-[#1a1640] to-[#0f0c28] flex items-center justify-center">
            {/* Simulated video tiles */}
            <div className="grid grid-cols-2 gap-4 w-full h-full p-6">
              {[
                { name: 'Alex M.', color: '#E91E8C', initials: 'AM' },
                { name: 'Sara K.', color: '#2DBFB8', initials: 'SK' },
                { name: 'James R.', color: '#2D7DD2', initials: 'JR' },
                { name: 'Maya L.', color: '#F47C2B', initials: 'ML' },
              ].map((p, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden bg-[#12102a] border border-white/10 flex items-center justify-center">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold"
                    style={{ background: p.color + '30', border: `2px solid ${p.color}` }}
                  >
                    {p.initials}
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black/60 rounded px-2 py-0.5 text-xs">{p.name}</div>
                  {i === 0 && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-em-pink/20 border border-em-pink/30 rounded-full px-2 py-0.5 text-xs text-em-pink">
                      <span className="w-1.5 h-1.5 rounded-full bg-em-pink animate-pulse" />
                      Speaking
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* AI badge overlay */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-em-dark/90 border border-em-teal/30 rounded-full px-3 py-1.5 text-xs text-em-teal font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-em-teal opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-em-teal" />
              </span>
              AI is listening…
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section id="features" className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-em-pink font-semibold text-sm uppercase tracking-widest mb-3">Powered by AI</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#1E1A3C] mb-4">
              Everything your meeting needs
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              From the first hello to the final action item — Echo Meet handles it all, automatically.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="group p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-default"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: f.colorHex + '15', color: f.colorHex }}
                >
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-[#1E1A3C] mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-32 px-6 bg-em-dark relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-em-pink/10 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-em-blue/10 rounded-full blur-[140px]" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="text-em-orange font-semibold text-sm uppercase tracking-widest mb-3">Simple by design</p>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              Three steps to <span className="text-gradient">smarter meetings</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="relative group">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(100%_-_1rem)] w-8 h-px bg-gradient-to-r from-em-pink to-em-orange z-10" />
                )}
                <div className="glass-card p-8 group-hover:border-em-pink/30 transition-colors duration-300">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-cta-gradient text-white text-xl font-black mb-6 shadow-lg">
                    {s.n}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                  <p className="text-white/60 leading-relaxed text-sm">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Final CTA */}
          <div className="text-center mt-16">
            <button
              id="section-start-meeting"
              onClick={() => setShowModal(true)}
              className="btn-cta text-lg px-12 py-5 glow-pink"
            >
              Start Your First Meeting — It's Free
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="bg-[#130f2a] border-t border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="Echo Meet" className="w-8 h-8" />
            <span className="font-bold text-white/90">Echo <span className="text-gradient">Meet</span></span>
          </div>
          <p className="text-sm text-white/30">© {new Date().getFullYear()} Echo Meet. Built with AI. All rights reserved.</p>
          <div className="flex items-center gap-2 text-xs text-white/30">
            <svg className="w-4 h-4 text-em-teal" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            End-to-end encrypted
          </div>
        </div>
      </footer>

      {/* Modal */}
      {showModal && (
        <RoomModal
          onConfirm={handleConfirm}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}

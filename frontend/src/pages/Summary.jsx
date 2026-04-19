import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'

const STATUS_CARDS = [
  {
    id: 'transcription',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    color: '#E91E8C',
    title: 'Transcription',
    desc: 'Converting audio to text…',
  },
  {
    id: 'summary',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    color: '#2DBFB8',
    title: 'Smart Summary',
    desc: 'Generating executive summary…',
  },
  {
    id: 'actions',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    color: '#F47C2B',
    title: 'Action Items',
    desc: 'Extracting tasks and owners…',
  },
]

export default function Summary() {
  const { meetingId } = useParams()
  const navigate = useNavigate()
  const [meeting, setMeeting] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!meetingId || meetingId === 'unknown') {
      setLoading(false)
      return
    }
    fetch(`http://localhost:8002/meetings/${meetingId}`)
      .then(r => r.json())
      .then(data => setMeeting(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [meetingId])

  function formatDuration(secs) {
    if (!secs) return '—'
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}m ${s}s`
  }

  return (
    <div className="min-h-screen bg-em-dark font-sans overflow-x-hidden">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="bg-gradient-to-r from-[#1E1A3C] via-[#2a2060] to-[#1E1A3C] border-b border-white/10 py-6 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img src="/logo.svg" alt="Echo Meet" className="w-9 h-9 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-white">Echo <span className="text-gradient">Meet</span></span>
          </Link>
          {meeting?.room_name && (
            <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm text-white/60 font-mono">
              {meeting.room_name}
            </div>
          )}
        </div>
      </header>

      {/* ── Main ───────────────────────────────────────────────────────── */}
      <main className="max-w-3xl mx-auto px-6 py-16">
        {/* Success heading */}
        <div className="text-center mb-12">
          {/* Checkmark */}
          <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-green-500/15 border border-green-500/30
                          flex items-center justify-center">
            <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Meeting Complete</h1>
          <p className="text-white/50 text-lg">
            Great session! Echo Meet's AI is now processing your recording.
          </p>
        </div>

        {/* Meeting meta */}
        {meeting && (
          <div className="glass-card p-6 mb-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Room</p>
              <p className="font-mono font-semibold text-em-teal text-sm">{meeting.room_name}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Duration</p>
              <p className="font-semibold text-sm">{formatDuration(meeting.duration_seconds)}</p>
            </div>
            <div className="text-center col-span-2 sm:col-span-1">
              <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Status</p>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-em-orange bg-em-orange/10 border border-em-orange/20 rounded-full px-3 py-1">
                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processing
              </span>
            </div>
          </div>
        )}

        {/* Status cards */}
        <div className="space-y-4 mb-10">
          {STATUS_CARDS.map((card, i) => (
            <div
              key={card.id}
              className="glass-card p-6 flex items-center gap-5"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              {/* Spinner icon */}
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: card.color + '18', color: card.color }}
              >
                {card.icon}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white mb-0.5">{card.title}</h3>
                <p className="text-sm text-white/50">{card.desc}</p>
              </div>

              {/* Processing indicator */}
              <div className="flex-shrink-0 flex items-center gap-2 text-xs font-medium"
                   style={{ color: card.color }}>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processing…
              </div>
            </div>
          ))}
        </div>

        {/* Info note */}
        <div className="flex items-start gap-3 bg-em-blue/10 border border-em-blue/20 rounded-2xl p-5 mb-10">
          <svg className="w-5 h-5 text-em-blue flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd" />
          </svg>
          <p className="text-sm text-white/60 leading-relaxed">
            Your transcript, summary, and action items will be ready shortly.
            You can close this page — your meeting data is safely saved in Echo Meet.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/"
            id="back-to-home"
            className="btn-outline flex-1 text-center py-4"
          >
            ← Back to Home
          </Link>
          <button
            id="start-new-meeting"
            onClick={() => navigate('/')}
            className="btn-cta flex-1 py-4"
          >
            Start New Meeting
          </button>
        </div>
      </main>

      {/* Decorative background orbs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-em-pink/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-em-teal/10 rounded-full blur-[100px]" />
      </div>
    </div>
  )
}

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
    bgColor: '#fdf2f8',
    darkBgColor: 'rgba(233,30,140,0.1)',
    borderColor: '#fbcfe8',
    darkBorderColor: 'rgba(233,30,140,0.2)',
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
    color: '#2563EB',
    bgColor: '#eff6ff',
    darkBgColor: 'rgba(37,99,235,0.1)',
    borderColor: '#bfdbfe',
    darkBorderColor: 'rgba(37,99,235,0.2)',
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
    bgColor: '#fff7ed',
    darkBgColor: 'rgba(244,124,43,0.1)',
    borderColor: '#fed7aa',
    darkBorderColor: 'rgba(244,124,43,0.2)',
    title: 'Action Items',
    desc: 'Extracting tasks and owners…',
  },
]

export default function Summary() {
  const { meetingId } = useParams()
  const navigate = useNavigate()
  const [meeting, setMeeting] = useState(null)
  const [loading, setLoading] = useState(true)

  // Use document.documentElement for checking theme easily in functional component, 
  // but let's just apply Tailwind classes without managing logic since index.css handles body color
  const [isDark] = useState(() => document.documentElement.classList.contains('dark'))

  useEffect(() => {
    if (!meetingId || meetingId === 'unknown') { setLoading(false); return }
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
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0F111A] font-sans overflow-x-hidden transition-colors duration-300">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="bg-white dark:bg-[#0b0f19] border-b border-gray-100 dark:border-white/10 py-5 px-6 shadow-sm dark:shadow-none transition-colors duration-300">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img src="/logo.png" alt="Echo Meet"
              className="w-16 h-16 scale-125 object-contain group-hover:scale-150 transition-transform" />
            <span className="font-bold text-[#1E1A3C] dark:text-white">
              Echo <span className="text-[#2563EB] dark:text-blue-400">Meet</span>
            </span>
          </Link>
          {meeting?.room_name && (
            <div className="hidden sm:flex items-center gap-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10
                            rounded-full px-4 py-1.5 text-sm text-gray-500 dark:text-gray-400 font-mono transition-colors">
              {meeting.room_name}
            </div>
          )}
        </div>
      </header>

      {/* ── Main ───────────────────────────────────────────────────────── */}
      <main className="max-w-3xl mx-auto px-6 py-16">

        {/* Success heading */}
        <div className="text-center mb-12">
          <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-green-50 dark:bg-green-500/10 border-2 border-green-200 dark:border-green-500/20
                          flex items-center justify-center">
            <svg className="w-10 h-10 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1E1A3C] dark:text-white mb-3">
            Meeting Complete
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Great session! Echo Meet's AI is now processing your recording.
          </p>
        </div>

        {/* Meeting meta */}
        {meeting && (
          <div className="bg-white dark:bg-[#1E1A3C] border border-gray-100 dark:border-white/10 rounded-2xl shadow-sm dark:shadow-none p-6 mb-8
                          grid grid-cols-2 sm:grid-cols-3 gap-4 transition-colors">
            <div className="text-center">
              <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Room</p>
              <p className="font-mono font-semibold text-[#2563EB] dark:text-blue-400 text-sm">{meeting.room_name}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Duration</p>
              <p className="font-semibold text-[#1E1A3C] dark:text-white text-sm">{formatDuration(meeting.duration_seconds)}</p>
            </div>
            <div className="text-center col-span-2 sm:col-span-1">
              <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Status</p>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-orange-600 dark:text-orange-400
                               bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-full px-3 py-1">
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
          {STATUS_CARDS.map((card, i) => {
             // For inline styles we need to figure out dark mode dynamically, but we can also use CSS variables or classes.
             // Here we just use a helper if we know we are in dark mode. Wait, since `isDark` is state, it might not update properly without an event listener.
             // Instead, let's just use CSS classes in Tailwind 3 for arbitrary values.
             return (
              <div
                key={card.id}
                className="bg-white dark:bg-[#1E1A3C] border border-gray-100 dark:border-white/10 rounded-2xl shadow-sm dark:shadow-none p-6 flex items-center gap-5 transition-colors"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border"
                  style={{ 
                    color: card.color,
                    // Use a trick: we'll apply both through class and let Tailwind's dark mode override.
                    // But we already have the colors. Let's just use Tailwind arbitrary values where possible.
                  }}
                  // Fallback for styling
                >
                  <div className="absolute inset-0 rounded-2xl bg-current opacity-10 dark:opacity-20" />
                  <div className="relative z-10">{card.icon}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[#1E1A3C] dark:text-white mb-0.5">{card.title}</h3>
                  <p className="text-sm text-gray-400 dark:text-gray-500">{card.desc}</p>
                </div>
                <div className="flex-shrink-0 flex items-center gap-2 text-xs font-medium"
                     style={{ color: card.color }}>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing…
                </div>
              </div>
            )
          })}
        </div>

        {/* Info note */}
        <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-2xl p-5 mb-10 transition-colors">
          <svg className="w-5 h-5 text-[#2563EB] dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd" />
          </svg>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
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
    </div>
  )
}

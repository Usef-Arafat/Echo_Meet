import React, { useState } from 'react'

const ADJECTIVES = ['Swift', 'Bright', 'Bold', 'Vivid', 'Clear', 'Sharp', 'Keen', 'Calm', 'Agile', 'Solid']
const NOUNS = ['Falcon', 'Eagle', 'Summit', 'Harbor', 'Nexus', 'Vertex', 'Prism', 'Pulse', 'Orbit', 'Crest']

function generateRoomName() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)]
  const digits = Math.floor(1000 + Math.random() * 9000)
  return `${adj}${noun}${digits}`
}

export default function RoomModal({ onConfirm, onClose }) {
  const [roomName, setRoomName] = useState(generateRoomName)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleStart() {
    if (!roomName.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('http://localhost:8002/meetings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room_name: roomName.trim() }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Failed to create meeting')
      }
      const data = await res.json()
      onConfirm(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleStart()
    if (e.key === 'Escape') onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(15, 12, 40, 0.85)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="glass-card w-full max-w-md p-8 animate-[fadeInScale_0.25s_ease-out]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="Echo Meet" className="w-9 h-9" />
            <h2 className="text-xl font-bold">New Meeting</h2>
          </div>
          <button
            id="modal-close"
            onClick={onClose}
            className="text-white/40 hover:text-white/80 text-2xl leading-none transition-colors"
          >
            ×
          </button>
        </div>

        {/* Room name */}
        <label className="block text-sm font-medium text-white/60 mb-2">
          Room Name
        </label>
        <input
          id="room-name-input"
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white
                     placeholder:text-white/30 focus:outline-none focus:border-em-pink/60
                     focus:ring-2 focus:ring-em-pink/20 transition-all duration-200 mb-2 font-mono"
          autoFocus
        />
        <button
          onClick={() => setRoomName(generateRoomName())}
          className="text-xs text-em-teal hover:text-em-teal/70 transition-colors mb-6"
        >
          ↺ Generate new name
        </button>

        {/* Error */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl px-4 py-3 text-red-300 text-sm mb-4">
            {error}
          </div>
        )}

        {/* Info row */}
        <div className="flex items-center gap-3 bg-em-teal/10 border border-em-teal/20 rounded-xl px-4 py-3 mb-6">
          <svg className="w-4 h-4 text-em-teal flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-xs text-em-teal/80">AI will automatically transcribe and summarize your meeting.</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button id="modal-cancel" onClick={onClose} className="btn-outline flex-1">
            Cancel
          </button>
          <button
            id="modal-confirm"
            onClick={handleStart}
            disabled={loading || !roomName.trim()}
            className="btn-cta flex-1 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Launch Meeting
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.92) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  )
}

import React, { useEffect, useRef, useState } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import AIBadge from '../components/AIBadge'

const API = 'http://localhost:8002'

export default function Meeting() {
  const { roomName } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const meetingId = searchParams.get('mid') || searchParams.get('meetingId')
  const shareLink = `${window.location.origin}/meeting/${roomName}${meetingId ? `?mid=${meetingId}` : ''}`

  // ── Refs ──────────────────────────────────────────────────────────────────
  const localVideoRef  = useRef(null)
  const remoteVideoRef = useRef(null)
  const localStreamRef = useRef(null)
  const peerRef        = useRef(null)
  const startRef       = useRef(null)

  // ── State ─────────────────────────────────────────────────────────────────
  const [phase, setPhase]     = useState('init')   // init|waiting|connected|error
  const [elapsed, setElapsed] = useState(0)
  const [micOn, setMicOn]     = useState(true)
  const [camOn, setCamOn]     = useState(true)
  const [copied, setCopied]   = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // ── Elapsed timer ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'waiting' && phase !== 'connected') return
    if (!startRef.current) startRef.current = Date.now()
    const id = setInterval(
      () => setElapsed(Math.floor((Date.now() - startRef.current) / 1000)),
      1000,
    )
    return () => clearInterval(id)
  }, [phase])

  // ── PeerJS setup ──────────────────────────────────────────────────────────
  useEffect(() => {
    let destroyed = false

    async function init() {
      // 1. Get camera + mic
      let stream
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      } catch (err) {
        if (!destroyed) {
          setPhase('error')
          setErrorMsg(
            err.name === 'NotAllowedError'
              ? 'Camera or microphone access was denied. Please allow access in your browser and refresh.'
              : `Could not access camera/mic: ${err.message}`,
          )
        }
        return
      }
      if (destroyed) { stream.getTracks().forEach(t => t.stop()); return }

      localStreamRef.current = stream
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }

      // 2. Create Peer (uses window.Peer from CDN)
      let peer
      try {
        peer = new window.Peer(undefined, {
          host: '0.peerjs.com',
          port: 443,
          path: '/',
          secure: true,
          debug: 0,
        })
      } catch (err) {
        if (!destroyed) {
          setPhase('error')
          setErrorMsg('PeerJS failed to load. Check your internet connection.')
        }
        return
      }
      peerRef.current = peer

      peer.on('error', err => {
        console.warn('[Peer] error:', err.type, err.message)
        if (!destroyed && phase !== 'connected') {
          setPhase('error')
          setErrorMsg(`Connection error: ${err.message}`)
        }
      })

      // 3. Wait for Peer ID
      const myPeerId = await new Promise((resolve, reject) => {
        peer.on('open', resolve)
        peer.on('error', reject)
      }).catch(err => { throw err })
      if (destroyed) return

      // 4. Handle incoming calls (we're the host / first in room)
      peer.on('call', call => {
        call.answer(stream)
        call.on('stream', remoteStream => {
          if (destroyed) return
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream
          setPhase('connected')
        })
        call.on('close', () => { if (!destroyed) setPhase('waiting') })
        call.on('error', err => console.warn('[call] error:', err))
      })

      // 5. Check if someone else is already in the room
      let existingPeerId = null
      try {
        const res = await fetch(`${API}/meetings/peers/${encodeURIComponent(roomName)}`)
        const data = await res.json()
        existingPeerId = data.peer_id
      } catch { /* backend might not be up yet, treat as empty room */ }
      if (destroyed) return

      // 6. If someone's there, call them
      if (existingPeerId && existingPeerId !== myPeerId) {
        const call = peer.call(existingPeerId, stream)
        if (call) {
          call.on('stream', remoteStream => {
            if (destroyed) return
            if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream
            setPhase('connected')
          })
          call.on('close', () => { if (!destroyed) setPhase('waiting') })
          call.on('error', err => console.warn('[call] error:', err))
        }
      }

      // 7. Register our peer ID (overwrites any stale entry)
      try {
        await fetch(`${API}/meetings/peers/${encodeURIComponent(roomName)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ peer_id: myPeerId }),
        })
      } catch { /* non-fatal */ }

      if (!destroyed && !existingPeerId) setPhase('waiting')
      if (!destroyed && existingPeerId && existingPeerId !== myPeerId) {
        // phase will be set by 'stream' event, but set waiting as fallback
        setTimeout(() => {
          if (!destroyed && phase === 'init') setPhase('waiting')
        }, 3000)
      }
    }

    init().catch(err => {
      if (!destroyed) {
        setPhase('error')
        setErrorMsg(err.message || 'Failed to start video call')
      }
    })

    // Cleanup
    return () => {
      destroyed = true
      localStreamRef.current?.getTracks().forEach(t => t.stop())
      try { peerRef.current?.destroy() } catch {}
      fetch(`${API}/meetings/peers/${encodeURIComponent(roomName)}`, { method: 'DELETE' })
        .catch(() => {})
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomName])

  // ── Actions ───────────────────────────────────────────────────────────────
  async function handleLeave() {
    const duration = Math.floor((Date.now() - (startRef.current || Date.now())) / 1000)
    localStreamRef.current?.getTracks().forEach(t => t.stop())
    try { peerRef.current?.destroy() } catch {}
    try {
      await fetch(`${API}/meetings/peers/${encodeURIComponent(roomName)}`, { method: 'DELETE' })
    } catch {}
    if (meetingId) {
      try {
        await fetch(`${API}/meetings/${meetingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ended_at: new Date().toISOString(), duration_seconds: duration }),
        })
      } catch {}
    }
    navigate(`/summary/${meetingId || 'unknown'}`)
  }

  function toggleMic() {
    localStreamRef.current?.getAudioTracks().forEach(t => { t.enabled = !t.enabled })
    setMicOn(v => !v)
  }

  function toggleCam() {
    localStreamRef.current?.getVideoTracks().forEach(t => { t.enabled = !t.enabled })
    setCamOn(v => !v)
  }

  function handleCopy() {
    navigator.clipboard.writeText(shareLink).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {})
  }

  function formatTime(s) {
    return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="h-screen w-screen flex flex-col bg-[#1E1A3C] overflow-hidden">

      {/* ── Topbar ──────────────────────────────────────────────────────── */}
      <header className="flex-shrink-0 flex items-center justify-between px-5 py-3
                         bg-[#1E1A3C]/95 border-b border-white/10 z-30 backdrop-blur-sm">
        {/* Logo */}
        <div className="flex items-center gap-2.5 min-w-[180px]">
          <img src="/logo.png" alt="Echo Meet" className="w-16 h-16 scale-125 object-contain" />
          <span className="font-bold text-sm">
            Echo <span className="text-[#E91E8C]">Meet</span>
          </span>
        </div>

        {/* Room + status */}
        <div className="flex items-center gap-3">
          <div className="bg-white/5 border border-white/15 rounded-full px-4 py-1.5
                          flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14
                   M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-mono font-medium text-white/90">{roomName}</span>
          </div>

          {/* Live badge */}
          {(phase === 'waiting' || phase === 'connected') && (
            <div className="flex items-center gap-1.5 bg-green-500/15 border border-green-500/30
                            rounded-full px-3 py-1 text-xs font-semibold text-green-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              Live · {formatTime(elapsed)}
            </div>
          )}
        </div>

        {/* AI Badge + Leave */}
        <div className="min-w-[180px] flex items-center justify-end gap-3">
          <AIBadge />
          <button
            id="leave-meeting-btn"
            onClick={handleLeave}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500
                       text-white text-sm font-semibold px-4 py-2 rounded-xl
                       transition-all duration-200 shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7
                   a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Leave
          </button>
        </div>
      </header>

      {/* ── Main video area ──────────────────────────────────────────────── */}
      <div className="flex-1 relative overflow-hidden bg-[#0f0c28]">

        {/* ── Error state ─────────────────────────────────────────────── */}
        {phase === 'error' && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-10 max-w-md text-center backdrop-blur-md">
              <div className="w-16 h-16 rounded-full bg-red-500/15 border border-red-500/30
                              flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3
                       L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Could Not Start Video</h2>
              <p className="text-white/50 text-sm leading-relaxed mb-7">{errorMsg}</p>
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 rounded-xl font-semibold text-white
                           bg-gradient-to-r from-[#E91E8C] to-[#F47C2B]"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* ── Init spinner ────────────────────────────────────────────── */}
        {phase === 'init' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <img src="/logo.png" alt="Echo Meet" className="w-28 h-28 scale-125 object-contain mb-5 animate-pulse" />
            <p className="text-white/60 text-sm">Starting camera…</p>
            <div className="flex gap-1.5 mt-4">
              {[0,1,2].map(i => (
                <div key={i} className="w-2 h-2 rounded-full bg-[#E91E8C] animate-bounce"
                     style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}

        {/* ── Waiting for others ──────────────────────────────────────── */}
        {phase === 'waiting' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 gap-6">
            {/* Pulsing ring */}
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-full border-2 border-[#2DBFB8]/30 animate-ping" />
              <div className="absolute inset-2 rounded-full border-2 border-[#2DBFB8]/50 animate-ping"
                   style={{ animationDelay: '0.3s' }} />
              <div className="absolute inset-0 rounded-full bg-[#2DBFB8]/10 flex items-center justify-center">
                <svg className="w-10 h-10 text-[#2DBFB8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857
                       M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857
                       m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>

            <div className="text-center">
              <p className="text-white font-semibold text-lg mb-1">Waiting for others to join…</p>
              <p className="text-white/40 text-sm">Share the link below to invite someone</p>
            </div>

            {/* Share link card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3 max-w-md w-full mx-4">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-white/40 uppercase font-semibold tracking-wider mb-0.5">Invite Link</p>
                <p className="text-sm text-white/70 font-mono truncate">{shareLink}</p>
              </div>
              <button
                onClick={handleCopy}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold
                           transition-all duration-200
                           bg-gradient-to-r from-[#E91E8C] to-[#F47C2B] text-white"
              >
                {copied ? (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2
                           m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── Remote video (full area) ────────────────────────────────── */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500
                      ${phase === 'connected' ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* ── Local video (PiP bottom-right) ──────────────────────────── */}
        <div className={`absolute bottom-20 right-4 z-20 transition-all duration-300
                         ${phase === 'init' ? 'opacity-0' : 'opacity-100'}`}>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20"
               style={{ width: 176, height: 132 }}>
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />
            {!camOn && (
              <div className="absolute inset-0 bg-[#1E1A3C] flex items-center justify-center">
                <svg className="w-8 h-8 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14
                       M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z
                       M3 3l18 18" />
                </svg>
              </div>
            )}
            <div className="absolute bottom-1.5 left-2 text-[10px] text-white/60 font-medium">You</div>
          </div>
        </div>

        {/* ── Bottom toolbar ──────────────────────────────────────────── */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
          <div className="flex items-center gap-3 bg-[#1E1A3C]/90 border border-white/15
                          backdrop-blur-md rounded-2xl px-5 py-3 shadow-2xl">

            {/* Mic */}
            <button
              onClick={toggleMic}
              title={micOn ? 'Mute microphone' : 'Unmute microphone'}
              className={`flex flex-col items-center gap-1 w-14 py-2 rounded-xl transition-all duration-200
                          ${micOn
                            ? 'bg-white/10 hover:bg-white/20 text-white'
                            : 'bg-red-500/20 hover:bg-red-500/30 text-red-400'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {micOn ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4M12 3a4 4 0 00-4 4v4a4 4 0 008 0V7a4 4 0 00-4-4z" />
                ) : (
                  <>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4M12 3a4 4 0 00-4 4v4a4 4 0 008 0V7a4 4 0 00-4-4z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                  </>
                )}
              </svg>
              <span className="text-[10px] font-medium">{micOn ? 'Mic' : 'Muted'}</span>
            </button>

            {/* Camera */}
            <button
              onClick={toggleCam}
              title={camOn ? 'Turn off camera' : 'Turn on camera'}
              className={`flex flex-col items-center gap-1 w-14 py-2 rounded-xl transition-all duration-200
                          ${camOn
                            ? 'bg-white/10 hover:bg-white/20 text-white'
                            : 'bg-red-500/20 hover:bg-red-500/30 text-red-400'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {camOn ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14
                       M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                ) : (
                  <>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                      d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14
                         M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                  </>
                )}
              </svg>
              <span className="text-[10px] font-medium">{camOn ? 'Camera' : 'Off'}</span>
            </button>

            {/* Divider */}
            <div className="w-px h-8 bg-white/10" />

            {/* Share */}
            <button
              onClick={handleCopy}
              className="flex flex-col items-center gap-1 w-14 py-2 rounded-xl
                         bg-white/10 hover:bg-white/20 text-white transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {copied
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342
                         m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316
                         m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684
                         3 3 0 00-5.368-2.684z" />
                }
              </svg>
              <span className="text-[10px] font-medium">{copied ? 'Copied!' : 'Share'}</span>
            </button>

            {/* Divider */}
            <div className="w-px h-8 bg-white/10" />

            {/* Leave */}
            <button
              onClick={handleLeave}
              className="flex flex-col items-center gap-1 w-14 py-2 rounded-xl
                         bg-red-600 hover:bg-red-500 text-white transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7
                     a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="text-[10px] font-medium">Leave</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

import React from 'react'

export default function AIBadge() {
  return (
    <div
      id="ai-badge"
      className="flex items-center gap-2 bg-em-dark/90 border border-em-teal/30
                 backdrop-blur-md rounded-full px-4 py-2 shadow-lg glow-teal"
    >
      {/* Pulsing dot */}
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-em-teal opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-em-teal" />
      </span>
      <span className="text-xs font-semibold text-em-teal tracking-wide whitespace-nowrap">
        AI is listening…
      </span>
    </div>
  )
}

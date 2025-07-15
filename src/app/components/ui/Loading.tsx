'use client'

import React from 'react'
import clsx from 'clsx'

export default function Loading({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={clsx('space-y-2 pt-2', className)}>
      {[...Array(lines)].map((_, idx) => (
        <div
          key={idx}
          className="relative overflow-hidden rounded w-full h-6 bg-gray-300"
          style={{ aspectRatio: '3 / 1' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
        </div>
      ))}
    </div>
  )
}

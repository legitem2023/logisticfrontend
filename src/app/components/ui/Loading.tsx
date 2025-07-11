'use client'

import React from 'react'
import clsx from 'clsx'

export default function Loading({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={clsx('space-y-2 animate-pulse pt-2', className)}>
      {[...Array(lines)].map((_, idx) => (
        <div
          key={idx}
          className="bg-gray-300 rounded w-full"
          style={{ width: `100%`,aspectRatio: '3/1' }}
        />
      ))}
    </div>
  )
}

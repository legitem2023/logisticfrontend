'use client'

import React from 'react'
import classNames from 'classnames'

interface SeparatorProps {
  className?: string
  vertical?: boolean
}

const Separator: React.FC<SeparatorProps> = ({ className = '', vertical = false }) => {
  return (
    <div
      className={classNames(
        vertical ? 'w-px h-full' : 'h-px w-full',
        'bg-gray-200 dark:bg-gray-700',
        className
      )}
    />
  )
}

export default Separator

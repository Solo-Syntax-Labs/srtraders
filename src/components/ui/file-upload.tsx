'use client'

import React, { useRef } from 'react'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  accept?: string
  className?: string
  children: React.ReactNode
}

export function FileUpload({ onFileSelect, accept, className, children }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelect(file)
      // Reset input so the same file can be selected again
      e.target.value = ''
    }
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      <div
        onClick={handleClick}
        className={cn(
          "cursor-pointer rounded-lg transition-colors hover:bg-gray-50",
          className
        )}
      >
        {children}
      </div>
    </>
  )
}

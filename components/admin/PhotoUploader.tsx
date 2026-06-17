'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useRouter } from 'next/navigation'

interface Props {
  portfolioId: string
  mode?: 'portfolio' | 'client'
  category?: string
}

export default function PhotoUploader({ portfolioId, mode = 'portfolio', category = 'ceremony' }: Props) {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [total, setTotal] = useState(0)
  const [done, setDone] = useState(0)

  const uploadFile = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('portfolioId', portfolioId)
    formData.append('category', category)
    formData.append('mode', mode)
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    if (!res.ok) throw new Error('Upload failed')
    return res.json()
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return
    setUploading(true)
    setTotal(acceptedFiles.length)
    setProgress(0)
    setDone(0)
    let uploaded = 0
    for (const file of acceptedFiles) {
      try {
        await uploadFile(file)
        uploaded++
        setProgress(uploaded)
      } catch (err) {
        console.error('Upload error:', err)
      }
    }
    setUploading(false)
    setDone(uploaded)
    router.refresh()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portfolioId, mode, category])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    multiple: true,
    disabled: uploading,
  })

  return (
    <div>
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all
          ${isDragActive ? 'border-[#C81010] bg-red-950/20' : 'border-gray-700 hover:border-gray-500 bg-gray-800/40'}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-600">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          {isDragActive ? (
            <p className="text-sm font-medium text-[#C81010]">Drop photos here…</p>
          ) : (
            <>
              <p className="text-sm font-medium text-gray-400">Drag & drop photos here</p>
              <p className="text-xs text-gray-600">or click to browse — JPG, PNG, WebP supported</p>
            </>
          )}
        </div>
      </div>

      {uploading && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>Uploading…</span>
            <span>{progress} / {total}</span>
          </div>
          <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#C81010] rounded-full transition-all duration-300"
              style={{ width: `${total ? (progress / total) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      {!uploading && done > 0 && (
        <p className="text-[0.75rem] text-green-500 mt-3">{done} photo{done !== 1 ? 's' : ''} uploaded successfully.</p>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { PropertyImport } from '@/domains/shared/types/propertyImport'

type ExtractionState =
  | { status: 'idle' }
  | { status: 'extracting' }
  | { status: 'calling' }
  | { status: 'error'; reason: 'pdf' | 'ai' }

const extractPdfText = async (file: File): Promise<string | null> => {
  try {
    const { getDocument, GlobalWorkerOptions } = await import('pdfjs-dist')
    GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString()

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await getDocument({ data: arrayBuffer }).promise

    const pages: string[] = []
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber)
      const textContent = await page.getTextContent()
      const pageText = textContent.items
        .map((item) => ('str' in item ? item.str : ''))
        .join(' ')
      pages.push(pageText)
    }

    return pages.join('\n').trim() || null
  } catch {
    return null
  }
}

export const usePropertyExtraction = () => {
  const [state, setState] = useState<ExtractionState>({ status: 'idle' })
  const router = useRouter()

  const extract = async (file: File) => {
    setState({ status: 'extracting' })

    const text = await extractPdfText(file)
    if (!text) {
      setState({ status: 'error', reason: 'pdf' })
      return
    }

    setState({ status: 'calling' })

    const response = await fetch('/api/extract-property', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })

    if (!response.ok) {
      setState({ status: 'error', reason: 'ai' })
      return
    }

    const propertyImport: PropertyImport = await response.json()
    const key = crypto.randomUUID()
    sessionStorage.setItem(`property-import-${key}`, JSON.stringify(propertyImport))
    router.push(`/properties/new?import=${key}`)
  }

  const reset = () => setState({ status: 'idle' })

  return { state, extract, reset }
}

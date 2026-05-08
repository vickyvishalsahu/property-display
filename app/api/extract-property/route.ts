import { NextResponse } from 'next/server'
import type { PropertyImport } from '@/domains/shared/types/propertyImport'
import { buildMessages, groq, validateExtraction } from '@/domains/extraction/utils'
import { MAX_RETRIES } from '@/domains/extraction/constants'

const extractWithRetry = async (text: string): Promise<PropertyImport> => {
  let lastError = ''
  let lastResponse = ''

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const messages = buildMessages(text, attempt, lastError, lastResponse)

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
      messages,
    })

    const raw = completion.choices[0]?.message?.content ?? ''
    lastResponse = raw

    try {
      const parsed = JSON.parse(raw)
      const validated = validateExtraction(parsed)
      if (validated) return validated
      lastError = 'Response did not match the required schema structure.'
    } catch {
      lastError = 'Response was not valid JSON.'
    }
  }

  throw new Error('EXTRACTION_FAILED')
}

export const POST = async (request: Request) => {
  const body = await request.json().catch(() => null)
  const text = body?.text

  if (!text || typeof text !== 'string' || text.trim().length < 50) {
    return NextResponse.json({ error: 'INVALID_INPUT' }, { status: 400 })
  }

  try {
    const result = await extractWithRetry(text)
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'EXTRACTION_FAILED' }, { status: 422 })
  }
}

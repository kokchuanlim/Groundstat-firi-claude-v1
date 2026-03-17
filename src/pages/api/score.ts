import type { NextApiRequest, NextApiResponse } from 'next'

export const config = {
  api: { bodyParser: { sizeLimit: '1mb' } },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey || apiKey === 'your_anthropic_api_key_here') {
    return res.status(503).json({
      error: 'API key not configured',
      message: 'Add ANTHROPIC_API_KEY to your .env.local file or Vercel environment variables.',
    })
  }

  const { messages, system, stream = false, max_tokens = 1000 } = req.body

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array is required' })
  }

  const body = {
    model: 'claude-sonnet-4-20250514',
    max_tokens,
    messages,
    ...(system ? { system } : {}),
    ...(stream ? { stream: true } : {}),
  }

  const upstream = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
  })

  if (stream) {
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    const reader = upstream.body!.getReader()
    const decoder = new TextDecoder()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      res.write(decoder.decode(value))
    }
    res.end()
  } else {
    const data = await upstream.json()
    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: data.error?.message || 'Upstream error' })
    }
    res.status(200).json(data)
  }
}

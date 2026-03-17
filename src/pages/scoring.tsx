import Head from 'next/head'
import { useState, useRef } from 'react'
import Nav from '../components/Nav'
import styles from '../styles/Scoring.module.css'

const PRESETS: Record<string, { label: string; text: string }[]> = {
  conscientiousness: [
    { label: 'Strong', text: "We had six weeks to launch a new data pipeline before a client deadline. I broke it down into daily deliverables with explicit owners and kept a risk log updated every morning. When our key dependency slipped two weeks in, I rescheduled the full plan within 24 hours and flagged it to our investor proactively. We shipped on time. What I'd do differently: build a one-week buffer in earlier." },
    { label: 'Moderate', text: "I've run quite a few projects. I generally keep a task list and check in with the team regularly. For our last product launch I tried to stay organised but things got a bit chaotic towards the end. I think I'm pretty good at pushing through and getting things done even when it's stressful. I use Notion for most things." },
    { label: 'Weak', text: "I just figure things out as I go. Planning too much in advance doesn't work because things always change anyway. I'm more of an execution person — I just focus on getting stuff done and don't overthink the process side." },
  ],
  self_efficacy: [
    { label: 'Strong', text: "Everyone said we couldn't close an enterprise deal without a sales team. I believed we could because I'd spent three years building similar integrations and knew exactly what CTOs needed. I mapped every objection in advance, ran the calls myself, and closed our first six-figure contract in 90 days. I'm very confident in technical architecture. I'm less confident in marketing — which is why I hired for it before we had budget." },
    { label: 'Moderate', text: "I think I'm pretty confident overall. When investors push back on our numbers I usually explain why we think they're right. I feel like I know our market well enough to defend our assumptions." },
    { label: 'Weak', text: "I'm confident in most areas. Honestly I think the market is bigger than most people realise and once we get traction everything will fall into place. I've always been a fast learner so I'm not too worried about any specific gaps." },
  ],
  resilience: [
    { label: 'Strong', text: "We lost our lead investor three days before close. It hit me hard — I won't pretend otherwise. I took about a day to feel it properly, then called a board meeting and laid out exactly where we stood. I didn't spin it. Within a week we had two replacement conversations open. I learned I'd been concentrating too much trust in one relationship without building the network around it." },
    { label: 'Moderate', text: "It was really tough when our biggest customer churned. I was pretty down for a while. But eventually I got back on my feet and we found new customers. I think I handle stress OK — I try to exercise and stay positive." },
    { label: 'Weak', text: "I try not to dwell on failures. The market has been difficult and there have been factors outside our control. I think the key is just staying optimistic and not letting the negativity get to you." },
  ],
}

type ScoreResult = {
  nlp_summary: string
  features: { positive: string[]; negative: string[] }
  scores: { c: number; se: number; r: number }
  confidence: number
  signals: { type: string; dimension: string; text: string }[]
  dim_analysis: { c: string; se: string; r: string }
  recommendation: string
}

const SYSTEM = `You are the GroundStat FIRI AI scoring engine. Analyse a founder's written assessment response and return ONLY a JSON object with no markdown or extra text:
{
  "nlp_summary": "2-3 sentence plain-English summary of linguistic patterns",
  "features": { "positive": ["feature1","feature2","feature3"], "negative": ["feature1","feature2"] },
  "scores": { "c": <0-100>, "se": <0-100>, "r": <0-100> },
  "confidence": <50-95>,
  "signals": [
    {"type":"positive|warning|negative","dimension":"C|SE|R","text":"specific signal, max 14 words"},
    {"type":"positive|warning|negative","dimension":"C|SE|R","text":"specific signal"},
    {"type":"positive|warning|negative","dimension":"C|SE|R","text":"specific signal"},
    {"type":"positive|warning|negative","dimension":"C|SE|R","text":"specific signal"},
    {"type":"positive|warning|negative","dimension":"C|SE|R","text":"specific signal"}
  ],
  "dim_analysis": { "c": "2 sentence C analysis", "se": "2 sentence SE analysis", "r": "2 sentence R analysis" },
  "recommendation": "1 sentence investment-relevant recommendation"
}
Scores should be differentiated — weak responses score 25-45, moderate 50-65, strong 70-88. Reference specific phrases.`

export default function Scoring() {
  const [dim, setDim] = useState('conscientiousness')
  const [response, setResponse] = useState(PRESETS.conscientiousness[0].text)
  const [loading, setLoading] = useState(false)
  const [streamText, setStreamText] = useState('')
  const [result, setResult] = useState<ScoreResult | null>(null)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'c' | 'se' | 'r'>('c')
  const [pipeStep, setPipeStep] = useState(-1)

  function handleDimChange(d: string) {
    setDim(d)
    setResponse(PRESETS[d]?.[0]?.text || '')
    setResult(null)
    setStreamText('')
    setError('')
  }

  async function runScoring() {
    if (!response.trim()) return
    setLoading(true)
    setResult(null)
    setStreamText('')
    setError('')
    setPipeStep(0)

    const steps = [0, 1, 2, 3, 4]
    let si = 0
    const stepTimer = setInterval(() => {
      si = Math.min(si + 1, 4)
      setPipeStep(si)
    }, 700)

    try {
      const res = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stream: true,
          system: SYSTEM,
          messages: [{ role: 'user', content: `Dimension: ${dim.replace('_', ' ')}\n\nFounder response:\n"${response}"` }],
          max_tokens: 1000,
        }),
      })

      clearInterval(stepTimer)
      setPipeStep(5)

      if (!res.ok) {
        const err = await res.json()
        setError(err.message || err.error || 'API error')
        setLoading(false)
        return
      }

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let full = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        for (const line of chunk.split('\n')) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') continue
            try {
              const parsed = JSON.parse(data)
              if (parsed.delta?.text) {
                full += parsed.delta.text
                setStreamText(full)
              }
            } catch {}
          }
        }
      }

      const clean = full.replace(/```json|```/g, '').trim()
      const parsed: ScoreResult = JSON.parse(clean)
      setResult(parsed)
    } catch (e: any) {
      clearInterval(stepTimer)
      setError(e.message || 'Unknown error')
    }
    setLoading(false)
    setPipeStep(-1)
  }

  const firi = result ? Math.round(result.scores.c * 0.35 + result.scores.se * 0.35 + result.scores.r * 0.30) : null
  const band = firi == null ? '' : firi >= 75 ? 'Exceptional' : firi >= 60 ? 'Above average' : firi >= 45 ? 'Moderate' : firi >= 30 ? 'Below average' : 'High risk'

  const PIPES = ['NLP analysis', 'Trait inference', 'Signal extraction', 'Score calibration', 'FIRI output']

  return (
    <>
      <Head><title>AI Scoring Engine — GroundStat FIRI</title></Head>
      <Nav />
      <div className={styles.wrap}>
        <div className={styles.pageHeader}>
          <h1>AI scoring engine</h1>
          <p>Submit a founder response to run it through the live FIRI scoring pipeline.</p>
        </div>

        {/* Pipeline */}
        <div className={styles.pipeline}>
          {PIPES.map((p, i) => (
            <span key={p} className={`${styles.pipeNode} ${pipeStep === i ? styles.pipeActive : pipeStep > i ? styles.pipeDone : ''}`}>{p}</span>
          ))}
        </div>

        {/* Input */}
        <div className={styles.inputCard}>
          <div className={styles.inputRow}>
            <div className={styles.fieldGroup}>
              <label>Question dimension</label>
              <select value={dim} onChange={e => handleDimChange(e.target.value)}>
                <option value="conscientiousness">Conscientiousness</option>
                <option value="self_efficacy">Self-Efficacy</option>
                <option value="resilience">Resilience</option>
              </select>
            </div>
            <div className={styles.presetBtns}>
              {(PRESETS[dim] || []).map((p, i) => (
                <button key={i} className={styles.presetBtn} onClick={() => setResponse(p.text)}>{p.label}</button>
              ))}
            </div>
          </div>
          <textarea
            className={styles.textarea}
            value={response}
            onChange={e => setResponse(e.target.value)}
            placeholder="Enter or paste a founder response…"
            rows={5}
          />
          <button className={`btn-primary ${styles.runBtn}`} onClick={runScoring} disabled={loading || !response.trim()}>
            {loading ? 'Analysing…' : 'Analyse with AI'}
          </button>
        </div>

        {/* Stream */}
        {loading && streamText && (
          <div className={styles.streamBox}>
            <div className={styles.streamLabel}>Raw model output</div>
            <pre className={styles.streamPre}>{streamText}<span className={styles.cursor} /></pre>
          </div>
        )}

        {/* Error */}
        {error && <div className={styles.errorBox}>{error}</div>}

        {/* Results */}
        {result && firi != null && (
          <>
            <div className={styles.firiResult}>
              <div><div className={styles.firiLabel}>FIRI composite score</div><div className={styles.firiSub}>Weighted C 35% · SE 35% · R 30%</div></div>
              <div className={styles.firiRight}><div className={styles.firiNum}>{firi}</div><div className={styles.firiBand}>{band}</div></div>
            </div>

            <div className={styles.scoresGrid}>
              {([['Conscientiousness', result.scores.c, '#185FA5', 'tag-blue'], ['Self-Efficacy', result.scores.se, '#1D9E75', 'tag-teal'], ['Resilience', result.scores.r, '#BA7517', 'tag-amber']] as [string, number, string, string][]).map(([label, val, color, tagCls]) => (
                <div key={label} className={styles.scoreCard}>
                  <div className={styles.scLabel}>{label}</div>
                  <div className={styles.scVal} style={{ color }}>{val}</div>
                  <div className={styles.scBar}><div style={{ width: `${val}%`, background: color, height: '100%', borderRadius: 3 }} /></div>
                  <span className={`tag ${tagCls}`}>{val >= 70 ? 'Strong' : val >= 55 ? 'Solid' : 'Moderate'}</span>
                </div>
              ))}
            </div>

            <div className={styles.resultCard}>
              <div className={styles.cardLabel}>NLP summary</div>
              <p className={styles.nlpText}>{result.nlp_summary}</p>
              <div className={styles.chipsRow}>
                {(result.features?.positive || []).map(f => <span key={f} className={styles.chipPos}>{f}</span>)}
                {(result.features?.negative || []).map(f => <span key={f} className={styles.chipNeg}>{f}</span>)}
              </div>
              <div className={styles.confRow}>
                <span>Model confidence</span>
                <div className={styles.confTrack}><div className={styles.confFill} style={{ width: `${result.confidence}%` }} /></div>
                <span className={styles.confVal}>{result.confidence}%</span>
              </div>
            </div>

            <div className={styles.resultCard}>
              <div className={styles.cardLabel}>Behavioural signals</div>
              {(result.signals || []).map((s, i) => (
                <div key={i} className={styles.signalRow}>
                  <div className={`${styles.sigDot} ${s.type === 'positive' ? styles.sigPos : s.type === 'warning' ? styles.sigWarn : styles.sigNeg}`} />
                  <div className={styles.sigText}>{s.text}</div>
                  <span className={`tag ${s.dimension === 'C' ? 'tag-blue' : s.dimension === 'SE' ? 'tag-teal' : 'tag-amber'}`}>{s.dimension === 'C' ? 'C' : s.dimension === 'SE' ? 'SE' : 'R'}</span>
                </div>
              ))}
            </div>

            <div className={styles.resultCard}>
              <div className={styles.cardLabel}>Dimension analysis</div>
              <div className={styles.dimTabs}>
                {(['c', 'se', 'r'] as const).map(d => (
                  <button key={d} className={`${styles.dimTab} ${activeTab === d ? styles.dimTabActive : ''}`} onClick={() => setActiveTab(d)}>
                    {d === 'c' ? 'Conscientiousness' : d === 'se' ? 'Self-Efficacy' : 'Resilience'}
                  </button>
                ))}
              </div>
              <p className={styles.dimText}>{result.dim_analysis[activeTab]}</p>
            </div>

            <div className={styles.recCard}>
              <div className={styles.recInner}>
                <div className={styles.cardLabel}>Recommendation</div>
                <p className={styles.recText}>{result.recommendation}</p>
              </div>
              <button className="btn-outline" onClick={() => window.location.href = '/report'}>View full report</button>
            </div>
          </>
        )}
      </div>
    </>
  )
}

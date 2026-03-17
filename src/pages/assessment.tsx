import Head from 'next/head'
import { useState, useCallback } from 'react'
import Nav from '../components/Nav'
import styles from '../styles/Assessment.module.css'

const QUESTIONS = [
  { id: 'ctx1', dim: 'ctx', label: 'Context', qnum: 'Setup', text: 'Tell us about yourself and your venture', hint: 'This helps us contextualise your assessment responses.', type: 'fields' },
  { id: 'c1',   dim: 'c',   label: 'Conscientiousness', qnum: 'Question 1 of 22', text: 'Describe a complex project you led from conception to completion.', hint: 'Walk us through the full arc — what you committed to, how you broke it into phases, what systems you used to track progress, what obstacles emerged, and how you addressed them.', type: 'textarea', minWords: 80 },
  { id: 'c2',   dim: 'c',   label: 'Conscientiousness', qnum: 'Question 2 of 22', text: 'How consistently do you maintain structured planning routines — even when things are going well?', hint: 'Think about your actual day-to-day behaviour, not your ideal.', type: 'scale', low: 'Rarely — I plan as needed', high: 'Always — rigid routines regardless' },
  { id: 'c3',   dim: 'c',   label: 'Conscientiousness', qnum: 'Question 3 of 22', text: 'Describe your typical weekly planning process.', hint: 'What systems do you use for task management? How do you prioritise across competing demands? Be specific — name the tools, cadences, and decision rules you actually use.', type: 'textarea', minWords: 60 },
  { id: 'c4',   dim: 'c',   label: 'Conscientiousness', qnum: 'Question 4 of 22', text: 'Tell us about a time you maintained disciplined execution through an extended period without external validation.', hint: 'What kept you going? How did your routines hold up?', type: 'textarea', minWords: 70 },
  { id: 'c5',   dim: 'c',   label: 'Conscientiousness', qnum: 'Question 5 of 22', text: 'When a project is running behind schedule, what is your most common first response?', hint: 'Choose the option that most honestly reflects your behaviour.', type: 'choice', choices: ['I escalate immediately and replan with updated timelines communicated to all stakeholders', 'I work longer hours to close the gap before anyone else notices', 'I reassess priorities and drop lower-impact work to protect the deadline', 'I flag it early but wait to see if it self-corrects before replanning'] },
  { id: 'c6',   dim: 'c',   label: 'Conscientiousness', qnum: 'Question 6 of 22', text: 'You have six weeks to deliver a critical product launch with a three-person team, a tight budget, and one major uncertain technical dependency.', hint: 'Walk us through your full approach — structure, dependency management, stakeholder communication, and contingency planning.', type: 'textarea', minWords: 80 },
  { id: 'se1',  dim: 'se',  label: 'Self-Efficacy', qnum: 'Question 7 of 22', text: 'Tell us about a time you accomplished something that others thought was very unlikely.', hint: 'What made you believe you could succeed? What specific capabilities did you draw on?', type: 'textarea', minWords: 80 },
  { id: 'se2',  dim: 'se',  label: 'Self-Efficacy', qnum: 'Question 8 of 22', text: 'How confident are you in your ability to raise your next funding round within 12 months?', hint: 'Be honest — this is assessed for calibration, not ambition.', type: 'scale', low: 'Not confident at all', high: 'Extremely confident' },
  { id: 'se3',  dim: 'se',  label: 'Self-Efficacy', qnum: 'Question 9 of 22', text: 'What are the two or three functional areas where you have the highest confidence in your own capability?', hint: 'Be specific — name the skills, describe how they were developed, and give an example.', type: 'textarea', minWords: 70 },
  { id: 'se4',  dim: 'se',  label: 'Self-Efficacy', qnum: 'Question 10 of 22', text: 'Where are the critical capability gaps most important to your venture\'s success right now? What are you doing about them?', hint: 'Calibrated self-awareness is a strength — we are not looking for you to appear capable in all areas.', type: 'textarea', minWords: 60 },
  { id: 'se5',  dim: 'se',  label: 'Self-Efficacy', qnum: 'Question 11 of 22', text: 'An investor challenges your market size estimate, calling it "optimistic." How do you respond?', hint: 'Choose the option that most honestly reflects your behaviour.', type: 'choice', choices: ['I defend my estimate with the specific methodology and data I used to build it', 'I acknowledge the concern, ask what assumptions they\'re using, and offer to reconcile offline', 'I adjust the number down in the moment to reduce friction and move on', 'I explain my estimate is conservative and provide a scenario showing upside'] },
  { id: 'se6',  dim: 'se',  label: 'Self-Efficacy', qnum: 'Question 12 of 22', text: 'Describe a situation where you changed your mind significantly on something you had previously been confident about.', hint: 'What evidence prompted the revision? How quickly did you update?', type: 'textarea', minWords: 70 },
  { id: 'r1',   dim: 'r',   label: 'Resilience', qnum: 'Question 13 of 22', text: 'Describe the most significant professional setback or failure you\'ve experienced.', hint: 'What was your immediate reaction, how did you process it, and what did you do next? We are looking for emotional honesty and recovery pattern, not a triumph narrative.', type: 'textarea', minWords: 80 },
  { id: 'r2',   dim: 'r',   label: 'Resilience', qnum: 'Question 14 of 22', text: 'After a major professional setback, how quickly do you typically return to your normal level of productivity?', hint: 'Think about your actual pattern, not what you would like it to be.', type: 'scale', low: 'Weeks to months', high: 'Within a day or two' },
  { id: 'r3',   dim: 'r',   label: 'Resilience', qnum: 'Question 15 of 22', text: 'Your key technical co-founder resigns with two weeks\' notice. Critical investor meetings are next week. Describe your response.', hint: 'Walk through the first 24 hours and how you communicate with investors.', type: 'textarea', minWords: 80 },
  { id: 'r4',   dim: 'r',   label: 'Resilience', qnum: 'Question 16 of 22', text: 'Three months since your last meaningful milestone. The team is showing signs of disengagement. What do you do?', hint: 'Choose the option that most honestly reflects your approach.', type: 'choice', choices: ['I call a team reset — honest conversation about what\'s not working, then rebuild a short-term plan together', 'I focus on one quick win to rebuild momentum, even if it\'s not the highest-priority item', 'I increase my own output and visibility to lead by example', 'I bring in an external advisor or coach to get a fresh perspective'] },
  { id: 'r5',   dim: 'r',   label: 'Resilience', qnum: 'Question 17 of 22', text: 'How do you manage your own mental health and recovery during extended high-pressure periods?', hint: 'Describe your actual practices — what you do, how consistently, and whether they work.', type: 'textarea', minWords: 50 },
  { id: 'r6',   dim: 'r',   label: 'Resilience', qnum: 'Question 18 of 22', text: 'How well do you maintain decision quality under sustained time pressure and ambiguity?', hint: 'Think of situations where you had incomplete information and a hard deadline.', type: 'scale', low: 'My quality drops noticeably', high: 'Consistent regardless of pressure' },
  { id: 'ctx2', dim: 'ctx', label: 'Broader context', qnum: 'Question 19 of 22', text: 'What has been the hardest part of building this specific venture?', hint: 'Be specific and honest. We are looking for self-awareness.', type: 'textarea', minWords: 60 },
  { id: 'ctx3', dim: 'ctx', label: 'Broader context', qnum: 'Question 20 of 22', text: 'What are your primary objectives for the next 12 months? For each, include your confidence level and the specific actions you\'ll take.', hint: 'List 2–4 objectives with confidence (0–100) and concrete actions for each.', type: 'textarea', minWords: 80 },
  { id: 'ctx4', dim: 'ctx', label: 'Broader context', qnum: 'Question 21 of 22', text: 'Which statement best describes your relationship with failure?', hint: 'Choose the option that most honestly reflects your perspective.', type: 'choice', choices: ['Failure is information — I analyse it, extract the lesson, and move on quickly', 'Failure motivates me — I use it as fuel to prove doubters wrong', 'Failure is hard — I feel it deeply but I always come back', 'Failure is part of the process — I\'ve normalised it enough that it doesn\'t slow me down much'] },
  { id: 'ctx5', dim: 'ctx', label: 'Broader context', qnum: 'Question 22 of 22', text: 'Is there anything important about your background or context that hasn\'t been captured?', hint: 'This is an open space. Use it if you need to.', type: 'textarea', minWords: 0 },
]

const DIM_COLORS: Record<string, string> = { c: '#185FA5', se: '#1D9E75', r: '#BA7517', ctx: '#534AB7' }
const DIM_LABELS: Record<string, string> = { c: 'Conscientiousness', se: 'Self-Efficacy', r: 'Resilience', ctx: 'Context' }

function wc(str: string) {
  return str.trim().split(/\s+/).filter(w => w.length > 0).length
}

export default function Assessment() {
  const [current, setCurrent] = useState(-1)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [submitted, setSubmitted] = useState(false)

  const q = current >= 0 && current < QUESTIONS.length ? QUESTIONS[current] : null
  const pct = current < 0 ? 0 : Math.round((current / QUESTIONS.length) * 100)

  const isAnswered = useCallback((idx: number): boolean => {
    const question = QUESTIONS[idx]
    const a = answers[question.id]
    if (question.type === 'textarea') {
      const min = (question as any).minWords || 0
      return min === 0 || wc(a || '') >= Math.max(1, min * 0.4)
    }
    if (question.type === 'scale') return a !== undefined
    if (question.type === 'choice') return a !== undefined
    if (question.type === 'fields') {
      const d = a || {}
      return ['name', 'role', 'company', 'stage'].every(k => d[k]?.trim())
    }
    return false
  }, [answers])

  function setAnswer(id: string, val: any) {
    setAnswers(prev => ({ ...prev, [id]: val }))
  }

  function setField(id: string, key: string, val: string) {
    setAnswers(prev => ({ ...prev, [id]: { ...(prev[id] || {}), [key]: val } }))
  }

  if (submitted) {
    const name = (answers['ctx1'] || {}).name || 'Founder'
    const company = (answers['ctx1'] || {}).company || 'your venture'
    const stage = (answers['ctx1'] || {}).stage || '—'
    const ref = `GS-2026-${Math.floor(Math.random() * 90000 + 10000)}`
    return (
      <>
        <Head><title>Assessment submitted — GroundStat FIRI</title></Head>
        <Nav />
        <div className={styles.confirmWrap}>
          <div className={styles.confirmIcon}>
            <svg viewBox="0 0 26 26" fill="none" stroke="#1D9E75" strokeWidth="2">
              <polyline points="4,13 10,19 22,7" />
            </svg>
          </div>
          <h2>Assessment submitted</h2>
          <p>Thank you, {name}. Your responses for <strong>{company}</strong> have been received and are being processed by the GroundStat FIRI engine. Your investor will receive your scored report within 24 hours.</p>
          <div className={styles.confirmDetails}>
            {[
              ['Submitted by', name],
              ['Company', company],
              ['Stage', stage],
              ['Questions answered', `${QUESTIONS.length} of ${QUESTIONS.length}`],
              ['Report ref', ref],
              ['Expected report', 'Within 24 hours'],
            ].map(([k, v]) => (
              <div key={k} className={styles.confirmRow}>
                <span>{k}</span><span>{v}</span>
              </div>
            ))}
          </div>
          <p className={styles.confirmNote}>You may request a copy of your FIRI report by contacting the investor who sent this assessment.</p>
        </div>
      </>
    )
  }

  if (current === -1) {
    return (
      <>
        <Head><title>Founder Assessment — GroundStat FIRI</title></Head>
        <Nav />
        <div className={styles.introWrap}>
          <div className={styles.introCard}>
            <div className={styles.investorBadge}>Sent by <strong>Meridian Capital</strong> · Ref: MC-2026-0441</div>
            <h1>Founder Investment Readiness Assessment</h1>
            <p>Meridian Capital has invited you to complete this assessment as part of their due diligence process. Your responses are analysed by the GroundStat FIRI engine to produce a Founder Investment Readiness Index — a scored, evidence-based profile of your execution capacity, confidence, and resilience.</p>
            <p>There are no right or wrong answers. Specific, honest responses produce more accurate and useful results than polished ones.</p>
            <div className={styles.introMeta}>
              {[['22 questions', ''], ['40–55 min', 'Est. time'], ['Written responses', 'Format'], ['Auto-saved', 'Progress']].map(([val, lbl]) => (
                <div key={val} className={styles.introMetaItem}>
                  <div className={styles.imiLabel}>{lbl || 'Questions'}</div>
                  <div className={styles.imiVal}>{val}</div>
                </div>
              ))}
            </div>
            <p className={styles.privacyNote}>Your responses are confidential to Meridian Capital and GroundStat. They will not be shared with third parties without your consent.</p>
            <div className={styles.sectionPills}>
              {Object.entries(DIM_LABELS).map(([dim, label]) => (
                <span key={dim} className={styles.pill} style={{ background: `${DIM_COLORS[dim]}15`, color: DIM_COLORS[dim], border: `0.5px solid ${DIM_COLORS[dim]}40` }}>{label}</span>
              ))}
            </div>
          </div>
          <div className={styles.introNav}>
            <span className={styles.saveNote}><span className={styles.saveDot} />Responses auto-saved</span>
            <button className="btn-primary" onClick={() => setCurrent(0)}>Begin assessment</button>
          </div>
        </div>
      </>
    )
  }

  if (!q) return null
  const answered = isAnswered(current)
  const textVal = answers[q.id] || ''
  const words = q.type === 'textarea' ? wc(textVal) : 0
  const minWords = (q as any).minWords || 0

  return (
    <>
      <Head><title>Question {current + 1} of {QUESTIONS.length} — GroundStat FIRI</title></Head>
      <Nav />
      <div className={styles.assessWrap}>
        {/* Progress */}
        <div className={styles.progressWrap}>
          <div className={styles.progressMeta}>
            <span><strong>{current + 1}</strong> of {QUESTIONS.length}</span>
            <span>{pct}% complete</span>
          </div>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Dim badge */}
        <span className={styles.dimBadge} style={{ background: `${DIM_COLORS[q.dim]}15`, color: DIM_COLORS[q.dim], border: `0.5px solid ${DIM_COLORS[q.dim]}40` }}>
          <span className={styles.dimDot} style={{ background: DIM_COLORS[q.dim] }} />
          {DIM_LABELS[q.dim]}
        </span>

        {/* Question card */}
        <div className={styles.qCard}>
          <div className={styles.qNum}>{q.qnum}</div>
          <div className={styles.qText}>{q.text}</div>
          <div className={styles.qHint}>{q.hint}</div>

          {q.type === 'textarea' && (
            <>
              <textarea
                value={textVal}
                onChange={e => setAnswer(q.id, e.target.value)}
                placeholder="Write your response here…"
                className={styles.textarea}
                rows={5}
              />
              {(words > 0 || minWords > 0) && (
                <div className={`${styles.wordCount} ${words >= minWords && minWords > 0 ? styles.wcGood : words > 0 ? styles.wcLow : ''}`}>
                  {minWords === 0 ? `${words} words` : words >= minWords ? `${words} words — good depth` : `${words} / ${minWords} words minimum`}
                </div>
              )}
            </>
          )}

          {q.type === 'scale' && (
            <>
              <div className={styles.scaleRow}>
                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                  <button
                    key={n}
                    className={`${styles.scaleBtn} ${answers[q.id] === n ? styles.scaleBtnActive : ''}`}
                    onClick={() => setAnswer(q.id, n)}
                  >{n}</button>
                ))}
              </div>
              <div className={styles.scaleLabels}>
                <span>{(q as any).low}</span>
                <span>{(q as any).high}</span>
              </div>
            </>
          )}

          {q.type === 'choice' && (
            <div className={styles.choiceList}>
              {((q as any).choices as string[]).map((c, i) => (
                <button
                  key={i}
                  className={`${styles.choiceBtn} ${answers[q.id] === i ? styles.choiceBtnActive : ''}`}
                  onClick={() => setAnswer(q.id, i)}
                >{c}</button>
              ))}
            </div>
          )}

          {q.type === 'fields' && (
            <div className={styles.fieldsGrid}>
              {[
                { key: 'name',     label: 'Full name',      type: 'text',   placeholder: 'Your full name' },
                { key: 'role',     label: 'Role / title',   type: 'text',   placeholder: 'e.g. Founder & CEO' },
                { key: 'company',  label: 'Company name',   type: 'text',   placeholder: 'Your startup name' },
                { key: 'industry', label: 'Industry',       type: 'text',   placeholder: 'e.g. B2B SaaS, Fintech' },
                { key: 'stage',    label: 'Funding stage',  type: 'select', options: ['Pre-seed', 'Seed', 'Series A', 'Series B+'] },
                { key: 'teamsize', label: 'Team (founders)', type: 'select', options: ['Solo founder', '2 co-founders', '3 co-founders', '4+ co-founders'] },
              ].map(f => (
                <div key={f.key} className={styles.fieldGroup}>
                  <label>{f.label}</label>
                  {f.type === 'select' ? (
                    <select value={(answers[q.id] || {})[f.key] || ''} onChange={e => setField(q.id, f.key, e.target.value)}>
                      <option value="">Select…</option>
                      {f.options!.map(o => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type="text" value={(answers[q.id] || {})[f.key] || ''} placeholder={f.placeholder} onChange={e => setField(q.id, f.key, e.target.value)} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Nav */}
        <div className={styles.navRow}>
          <button className={styles.backBtn} onClick={() => setCurrent(c => c - 1)} disabled={current === 0}>Back</button>
          <span className={styles.saveNote}><span className={styles.saveDot} />Auto-saved</span>
          <button
            className="btn-primary"
            disabled={!answered}
            onClick={() => {
              if (current === QUESTIONS.length - 1) setSubmitted(true)
              else setCurrent(c => c + 1)
            }}
          >
            {current === QUESTIONS.length - 1 ? 'Submit assessment' : 'Next'}
          </button>
        </div>
      </div>
    </>
  )
}

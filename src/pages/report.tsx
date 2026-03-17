import Head from 'next/head'
import { useState } from 'react'
import Nav from '../components/Nav'
import styles from '../styles/Report.module.css'
import Link from 'next/link'

type Tab = 'exec' | 'factors' | 'team' | 'actions'

export default function Report() {
  const [tab, setTab] = useState<Tab>('exec')

  const tabs: { id: Tab; label: string }[] = [
    { id: 'exec',    label: 'Executive summary' },
    { id: 'factors', label: 'Factor deep-dive' },
    { id: 'team',    label: 'Team dynamics' },
    { id: 'actions', label: 'Recommended actions' },
  ]

  return (
    <>
      <Head><title>Sample FIRI Report — GroundStat</title></Head>
      <Nav />
      <div className={styles.wrap}>
        {/* Report header */}
        <div className={styles.reportHeader}>
          <div>
            <div className={styles.reportTitle}>Founder Assessment Report</div>
            <div className={styles.reportMeta}>Report ID: GS-2026-04471 · Issued 17 March 2026 · Series A · Tech SaaS</div>
          </div>
          <span className={styles.confidential}>CONFIDENTIAL — INVESTOR USE ONLY</span>
        </div>

        {/* Profile band */}
        <div className={styles.profileBand}>
          <div className={styles.avatar}>AL</div>
          <div className={styles.profileInfo}>
            <h2>Alex Lim</h2>
            <p>Founder &amp; CEO · Meridian Analytics Pte. Ltd.</p>
            <div className={styles.profileTags}>
              {['3-person founding team', 'B2B SaaS · Data infrastructure', 'Singapore · Seed-funded', 'Seeking SGD 4M Series A'].map(t => (
                <span key={t} className={styles.ptag}>{t}</span>
              ))}
            </div>
          </div>
          <div className={styles.firiBlock}>
            <div className={styles.firiScore}>72</div>
            <div className={styles.firiLabel}>FIRI SCORE</div>
            <div className={styles.firiBand}>Above average</div>
            <div className={styles.firiPct}>71st percentile</div>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabBar}>
          {tabs.map(t => (
            <button key={t.id} className={`${styles.tab} ${tab === t.id ? styles.tabActive : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </div>

        {/* Executive summary */}
        {tab === 'exec' && (
          <div>
            <div className={styles.execBox}>
              <p>Alex Lim presents a strong and well-rounded founder profile with a FIRI score of 72 (71st percentile vs. high-performing founder population). Conscientiousness is the standout dimension — systematic planning, disciplined execution, and transparent stakeholder communication are consistently evidenced. Self-efficacy is calibrated and grounded in verifiable mastery experiences, with no overconfidence flags. The primary development area is resilience: moderate scores in stress recovery indicate an elevated burnout risk as the venture scales post-Series A.</p>
            </div>
            <div className={styles.threeCol}>
              {[
                { label: 'Conscientiousness', val: 78, color: '#185FA5', ci: '95% CI: 72–84', tag: 'Strong · 80th pct', tagCls: 'tag-blue' },
                { label: 'Self-Efficacy',     val: 68, color: '#1D9E75', ci: '95% CI: 60–76', tag: 'Calibrated · 65th pct', tagCls: 'tag-teal' },
                { label: 'Resilience',        val: 65, color: '#BA7517', ci: '95% CI: 56–74', tag: 'Moderate · 58th pct', tagCls: 'tag-amber' },
              ].map(s => (
                <div key={s.label} className={styles.subCard}>
                  <div className={styles.subLabel}>{s.label}</div>
                  <div className={styles.subVal} style={{ color: s.color }}>{s.val}</div>
                  <div className={styles.subCi}>{s.ci}</div>
                  <div className={styles.subBar}><div style={{ width: `${s.val}%`, background: s.color, height: '100%', borderRadius: 3 }} /></div>
                  <span className={`tag ${s.tagCls}`}>{s.tag}</span>
                </div>
              ))}
            </div>
            <div className={styles.resultCard}>
              <div className={styles.cardLabel}>Key strengths</div>
              {[
                ['C', 'Exceptional milestone decomposition with demonstrated systematic follow-through. Planning narratives show explicit risk anticipation and proactive investor communication — directly reducing monitoring burden.'],
                ['SE', 'Self-efficacy is domain-differentiated, not uniformly inflated. Alex acknowledges lower confidence in enterprise sales and has moved to hire a Head of Sales — a strong signal of calibrated self-awareness.'],
                ['C', 'Persistence under uncertainty evidenced through a 14-month period without external validation. Work pattern consistency and documented decision logs verified through reference checks.'],
              ].map(([dim, text], i) => (
                <div key={i} className={styles.listRow}>
                  <div className={`${styles.listDim} tag-blue`} style={{ background: dim === 'C' ? 'var(--blue-50)' : 'var(--teal-50)', color: dim === 'C' ? 'var(--blue-800)' : 'var(--teal-800)' }}>{dim}</div>
                  <div className={styles.listText}>{text}</div>
                </div>
              ))}
            </div>
            <div className={styles.resultCard}>
              <div className={styles.cardLabel}>Risk factors</div>
              {[
                ['R', 'Resilience — moderate concern. Recovery speed from high-visibility setbacks is slower than optimal (est. 3–4 weeks). May impair stakeholder confidence communication during post-Series A scaling stress.'],
                ['R', 'Burnout vulnerability. Current work patterns show limited recovery rituals. Solo operational responsibility across product, customer success, and fundraising may compound this risk post-investment.'],
                ['SE', 'Confidence interval wider than average (CI 60–76). Calibration validation via reference check is recommended before final investment committee.'],
              ].map(([dim, text], i) => (
                <div key={i} className={styles.listRow}>
                  <div className={styles.listDim} style={{ background: dim === 'R' ? 'var(--amber-50)' : 'var(--purple-50)', color: dim === 'R' ? 'var(--amber-600)' : 'var(--purple-600)' }}>{dim}</div>
                  <div className={styles.listText}>{text}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Factor deep-dive */}
        {tab === 'factors' && (
          <div>
            {[
              { dim: 'Conscientiousness', score: 78, scoreCls: 'tag-blue', scoreColor: '#185FA5', tag: 'Strong', q1: 'We mapped every dependency before the sprint started. I kept a live risk log and sent the team a Friday update every week without exception — even when the news wasn\'t good.', q1note: 'Consistent across 3 separate project narratives. Reference confirmed: "Alex was the most organised founder I\'ve worked with."', q2: 'There was a 14-month stretch with no external validation. I kept the same weekly routine — customer interviews on Mondays, product review on Thursdays — because the process was the anchor, not the results.', q2note: 'Adaptive tenacity pattern confirmed. One deliberate product direction change with documented evidence threshold.', strengths: ['Milestone decomposition is highly specific', 'Proactive investor communication discipline', 'Documented decision logs verified by reference', 'Consistent routines under ambiguity'], risks: ['Score at 78 — approaching rigidity threshold (85+)', 'Comfort with ambiguity may reduce at scale'] },
              { dim: 'Self-Efficacy', score: 68, scoreCls: 'tag-teal', scoreColor: '#1D9E75', tag: 'Calibrated', q1: 'I\'m confident in the data pipeline architecture because I built three of them from scratch. I\'m not confident in enterprise sales — which is why we\'re hiring for it.', q1note: 'Domain-differentiated confidence. No uniform self-enhancement. Calibration task accuracy: 74% vs. stated 71% — tight alignment.', q2: 'That\'s a fair concern about TAM. Our current estimate is conservative — here\'s the bottom-up model — but I\'d rather be anchored to evidence and be wrong upward than promise a number I can\'t defend.', q2note: 'Confident evidence-based defence without defensiveness. Maintained position with substantive support.', strengths: ['Grounded in documented mastery experiences', 'Appropriate gap acknowledgment — recruits to complement', 'Calibration accuracy close to stated confidence'], risks: ['Wider-than-average CI — validate via reference check', 'SE under board pressure not yet field-tested'] },
              { dim: 'Resilience', score: 65, scoreCls: 'tag-amber', scoreColor: '#BA7517', tag: 'Moderate — monitor', q1: 'We lost our biggest design partner three weeks before our seed close. I won\'t pretend it didn\'t hit hard — I probably took about three weeks to fully reset and get back to full speed.', q1note: 'Recovery speed: 3–4 weeks — longer than optimal target of 1–2 weeks. Learning extraction was specific and constructive.', q2: 'First 24 hours: I\'d stabilise the team messaging, then call the investors before they heard it elsewhere. I\'d be honest — I wouldn\'t spin it. Then I\'d map what the CTO actually owned and triage what needs external cover.', q2note: 'Structured response under pressure. Decision quality maintained. Communication instinct is transparent.', strengths: ['Transparent communication instinct during downturns', 'Decision structure maintained under simulated crisis', 'Constructive attribution — no external blame pattern'], risks: ['Recovery speed slower than high-performer benchmark', 'Limited recovery rituals — burnout risk at scale', 'No evidence of sustained high-pressure experience yet'] },
            ].map(f => (
              <div key={f.dim} className={styles.resultCard} style={{ marginBottom: '1rem' }}>
                <div className={styles.factorHeader}>
                  <h3 className={styles.factorTitle}>{f.dim}</h3>
                  <span className={`tag ${f.scoreCls}`}>{f.score} · {f.tag}</span>
                </div>
                <div className={styles.evidenceBlock}>
                  <div className={styles.evLabel}>BEHAVIOURAL EVIDENCE</div>
                  <blockquote className={styles.quote}>"{f.q1}"</blockquote>
                  <div className={styles.evNote}>{f.q1note}</div>
                </div>
                <div className={styles.evidenceBlock}>
                  <div className={styles.evLabel}>RESPONSE TO CHALLENGE</div>
                  <blockquote className={styles.quote}>"{f.q2}"</blockquote>
                  <div className={styles.evNote}>{f.q2note}</div>
                </div>
                <div className={styles.srGrid}>
                  <div className={styles.srBox} style={{ background: 'var(--teal-50)', border: '0.5px solid var(--teal-100)' }}>
                    <div className={styles.srLabel} style={{ color: 'var(--teal-600)' }}>STRENGTHS</div>
                    <ul className={styles.srList}>{f.strengths.map(s => <li key={s}>{s}</li>)}</ul>
                  </div>
                  <div className={styles.srBox} style={{ background: 'var(--amber-50)', border: '0.5px solid var(--amber-100)' }}>
                    <div className={styles.srLabel} style={{ color: 'var(--amber-600)' }}>WATCH POINTS</div>
                    <ul className={styles.srList}>{f.risks.map(r => <li key={r}>{r}</li>)}</ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Team dynamics */}
        {tab === 'team' && (
          <div>
            <div className={styles.resultCard}>
              <div className={styles.cardLabel}>Founding team profiles</div>
              <div className={styles.teamGrid}>
                {[
                  { initials: 'AL', name: 'Alex Lim', role: 'CEO · Assessed', c: 78, se: 68, r: 65, archetype: 'Operator', av: '#E6F1FB', ac: '#185FA5', tag: 'tag-blue' },
                  { initials: 'SR', name: 'Siti Rahman', role: 'CTO · Assessed', c: 82, se: 74, r: 71, archetype: 'Engineer', av: '#E1F5EE', ac: '#1D9E75', tag: 'tag-teal' },
                  { initials: 'JT', name: 'James Tan', role: 'CPO · Verify', c: 62, se: 80, r: 77, archetype: 'Visionary', av: '#EEEDFE', ac: '#534AB7', tag: 'tag-purple' },
                ].map(m => (
                  <div key={m.name} className={styles.teamCard}>
                    <div className={styles.tmHead}>
                      <div className={styles.tmAv} style={{ background: m.av, color: m.ac }}>{m.initials}</div>
                      <div><div className={styles.tmName}>{m.name}</div><div className={styles.tmRole}>{m.role}</div></div>
                    </div>
                    {[['C', m.c, '#185FA5'], ['SE', m.se, '#1D9E75'], ['R', m.r, '#BA7517']].map(([lbl, val, col]) => (
                      <div key={lbl as string} className={styles.tmBarRow}>
                        <span className={styles.tmBarLabel}>{lbl}</span>
                        <div className={styles.tmBarTrack}><div style={{ width: `${val}%`, background: col as string, height: '100%', borderRadius: 2 }} /></div>
                        <span className={styles.tmBarVal}>{val}</span>
                      </div>
                    ))}
                    <span className={`tag ${m.tag}`} style={{ marginTop: 8, display: 'inline-block' }}>{m.archetype}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.resultCard}>
              <div className={styles.cardLabel}>Team composition analysis</div>
              <div className={styles.execBox} style={{ borderColor: '#1D9E75', marginBottom: '1rem' }}>
                <p>Strong complementarity across the founding team. Alex (Operator) provides execution discipline, Siti (Engineer) adds technical depth with higher resilience, and James (Visionary, pending verification) brings high self-efficacy and creative range. The collective covers the conscientiousness–innovation axis effectively. Team survival probability estimated at 2× the solo-founder baseline.</p>
              </div>
              <div className={styles.srGrid}>
                <div className={styles.srBox} style={{ background: 'var(--teal-50)', border: '0.5px solid var(--teal-100)' }}>
                  <div className={styles.srLabel} style={{ color: 'var(--teal-600)' }}>COLLECTIVE STRENGTHS</div>
                  <ul className={styles.srList}>
                    {['All three FIRI dimensions covered across team', 'High-C coverage from CEO + CTO', 'Siti\'s resilience (71) compensates for Alex\'s moderate score', 'Visionary–Operator pairing is a validated success pattern'].map(s => <li key={s}>{s}</li>)}
                  </ul>
                </div>
                <div className={styles.srBox} style={{ background: 'var(--amber-50)', border: '0.5px solid var(--amber-100)' }}>
                  <div className={styles.srLabel} style={{ color: 'var(--amber-600)' }}>GAPS & FRICTION RISKS</div>
                  <ul className={styles.srList}>
                    {['CPO profile unverified — full assessment required', 'Two high-C founders may resist pivoting under pressure', 'No assessed founder with high openness to experience'].map(r => <li key={r}>{r}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        {tab === 'actions' && (
          <div>
            <div className={styles.resultCard}>
              <div className={styles.cardLabel}>Recommended actions — investment structuring</div>
              {[
                'Verify CPO profile (James Tan) via full FIRI assessment before final committee. Self-reported data is not sufficient for investment-grade confidence.',
                'Reference-validate SE calibration. Target two references with direct observation of Alex under investor pressure. Specific probe: decision quality during the seed-round design partner loss.',
                'Mandate quarterly resilience monitoring for Alex. Assign executive coach with founder burnout specialisation. Include a wellbeing trigger clause in the term sheet at 6 and 12 months post-close.',
                'Negotiate milestone-based tranching for the second tranche (SGD 2M). Tie to product and revenue milestones with a 90-day confirmation window.',
                'Board composition: appoint one independent director with adaptive strategy experience to complement Alex\'s high conscientiousness. Consider a second with founder coaching background.',
              ].map((a, i) => (
                <div key={i} className={styles.listRow}>
                  <div className={styles.listNum}>{i + 1}</div>
                  <div className={styles.listText}>{a}</div>
                </div>
              ))}
            </div>
            <div className={styles.actionGrid}>
              {[
                { dim: 'Conscientiousness', action: 'Leverage as-is', body: 'No intervention needed. Set explicit milestone framework. Structured reporting cadence will reduce monitoring burden.', tagCls: 'tag-blue' },
                { dim: 'Self-Efficacy',     action: 'Monitor + verify', body: 'Reference check to close the wider CI. Implement 360-degree feedback loop post-investment.', tagCls: 'tag-teal' },
                { dim: 'Resilience',        action: 'Active mitigation', body: 'Executive coaching from day 1. Explicit workload structure. Wellbeing trigger clause. Quarterly FIRI reassessment.', tagCls: 'tag-amber' },
              ].map(a => (
                <div key={a.dim} className={styles.actionCard}>
                  <span className={`tag ${a.tagCls}`} style={{ marginBottom: 8, display: 'inline-block' }}>{a.dim}</span>
                  <div className={styles.actionTitle}>{a.action}</div>
                  <p className={styles.actionBody}>{a.body}</p>
                </div>
              ))}
            </div>
            <div className={styles.recFinal}>
              <div>
                <div className={styles.recFinalTitle}>FIRI 72 · Proceed with standard process</div>
                <p className={styles.recFinalBody}>Above-average founder quality with strong execution fundamentals. Primary risk is resilience under scaling pressure — manageable with the mitigation protocol above. Full team FIRI verification recommended before close.</p>
              </div>
              <Link href="/assessment" className="btn-primary">Start a real assessment</Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

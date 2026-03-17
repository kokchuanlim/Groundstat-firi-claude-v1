import Head from 'next/head'
import Link from 'next/link'
import Nav from '../components/Nav'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <>
      <Head>
        <title>GroundStat FIRI — Founder Investment Readiness Index</title>
      </Head>
      <Nav />
      <main>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <span className={styles.eyebrow}>VENTURE CAPITAL INTELLIGENCE</span>
            <h1>Quantify <span className={styles.accent}>founder readiness</span> before you commit capital</h1>
            <p className={styles.heroSub}>
              GroundStat FIRI applies AI-powered psychological assessment to predict founder
              execution capacity, resilience, and leadership sustainability — backed by
              peer-reviewed research on 10,500+ founder-startup pairs.
            </p>
            <div className={styles.heroCtas}>
              <Link href="/assessment" className="btn-primary">Start an assessment</Link>
              <Link href="/report" className="btn-outline">View sample report</Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className={styles.statsRow}>
          {[
            { num: '10,500+', label: 'Founder-startup dyads studied' },
            { num: '82.5%',   label: 'Classification accuracy' },
            { num: '3',       label: 'Core psychological predictors' },
            { num: '45 min',  label: 'Assessment duration' },
          ].map(s => (
            <div key={s.label} className={styles.statItem}>
              <div className={styles.statNum}>{s.num}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </section>

        {/* Score demo */}
        <section className={styles.section}>
          <div className="container-sm">
            <div className={styles.sectionLabel}>The FIRI Score</div>
            <h2>A composite index built for investment decisions</h2>
            <p className={styles.sectionSub}>
              Three validated psychological predictors — Conscientiousness, Self-Efficacy, and
              Resilience — combined into a single 0–100 score benchmarked against high-performing
              founder populations.
            </p>
            <div className={styles.scoreDemo}>
              <div className={styles.scoreDemoHeader}>
                <div className={styles.profileRow}>
                  <div className={styles.avatar}>AL</div>
                  <div>
                    <div className={styles.profileName}>Alex Lim — Founder &amp; CEO</div>
                    <div className={styles.profileSub}>Series A · SaaS · 3-person founding team</div>
                  </div>
                </div>
                <div className={styles.firiBadge}>
                  <div className={styles.firiNum}>72</div>
                  <div className={styles.firiLabel}>FIRI SCORE</div>
                  <div className={styles.firiBand}>Above average</div>
                </div>
              </div>
              {[
                { label: 'Conscientiousness', val: 78, color: '#185FA5', tag: 'Strong · 80th pct' },
                { label: 'Self-Efficacy',     val: 68, color: '#1D9E75', tag: 'Calibrated · 65th pct' },
                { label: 'Resilience',        val: 65, color: '#BA7517', tag: 'Moderate · 58th pct' },
              ].map(b => (
                <div key={b.label} className={styles.barRow}>
                  <div className={styles.barLabel}>{b.label}</div>
                  <div className={styles.barTrack}>
                    <div className={styles.barFill} style={{ width: `${b.val}%`, background: b.color }} />
                  </div>
                  <div className={styles.barVal}>{b.val}</div>
                  <div className={styles.barTag}>{b.tag}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Audience */}
        <section className={styles.section} style={{ background: 'var(--color-bg-secondary)' }}>
          <div className="container">
            <div className={styles.sectionLabel}>Who it's for</div>
            <h2>Built for every stage of capital deployment</h2>
            <p className={styles.sectionSub}>Whether you're running pre-seed screens or monitoring portfolio founders, FIRI integrates into your existing workflow.</p>
            <div className={styles.audienceGrid}>
              {[
                { tag: 'VCs & Institutional', tagClass: 'tag-blue', title: 'Pre-investment due diligence', body: 'Quantify founder quality alongside market and financial analysis. Identify execution risk before committing capital.' },
                { tag: 'Angel & Syndicates',  tagClass: 'tag-purple', title: 'Scalable founder screening', body: 'Standardised assessment across your pipeline without the overhead of extended relationship-building before each deal.' },
                { tag: 'Grants & Accelerators', tagClass: 'tag-teal', title: 'Seed funding applications', body: 'Apply psychological readiness evidence to grant and accelerator selections. Complement business plan review with founder capacity data.' },
              ].map(c => (
                <div key={c.title} className="card">
                  <span className={`tag ${c.tagClass}`} style={{ marginBottom: '0.875rem', display: 'inline-block' }}>{c.tag}</span>
                  <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>{c.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.65 }}>{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className={styles.section}>
          <div className="container-sm">
            <div className={styles.sectionLabel}>How it works</div>
            <h2>From application to investment insight</h2>
            <p className={styles.sectionSub}>A staged assessment process that scales with the stakes.</p>
            <div className={styles.processCard}>
              {[
                { n: '1', title: 'Online screening assessment', body: 'Founder completes a 45-minute text-based conversational interview. AI analyses language patterns across all three FIRI dimensions.', meta: '100% of applicants · Low cost · Automated scoring' },
                { n: '2', title: 'Voice/video deep-dive', body: 'Shortlisted founders complete an enhanced voice or video session. Paralinguistic signals add independent prediction streams for resilience scoring.', meta: '20–30% of applicants · Moderate cost' },
                { n: '3', title: 'Facilitated in-person session', body: 'For lead investments, a trained facilitator conducts a structured interview with AI-assisted real-time scoring and team dynamics analysis.', meta: '5–10% of applicants · Maximum accuracy' },
                { n: '4', title: 'Portfolio monitoring', body: 'Periodic reassessment tracks psychological state evolution post-investment. Quarterly for high-risk profiles, annually for stable performers.', meta: '100% of portfolio · Continuous intelligence' },
              ].map((s, i, arr) => (
                <div key={s.n} className={styles.step} style={{ borderBottom: i < arr.length - 1 ? '0.5px solid var(--color-border)' : 'none' }}>
                  <div className={styles.stepNum}>{s.n}</div>
                  <div>
                    <div className={styles.stepTitle}>{s.title}</div>
                    <div className={styles.stepBody}>{s.body}</div>
                    <div className={styles.stepMeta}>{s.meta}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.ctaSection}>
          <h2>Ready to assess your next founder?</h2>
          <p>Start with a single assessment or integrate FIRI into your full investment pipeline. Results in 24 hours.</p>
          <Link href="/assessment" className="btn-primary" style={{ fontSize: 15, padding: '12px 32px' }}>
            Start an assessment
          </Link>
          <p className={styles.ctaNote}>No commitment required. Sample report included with first assessment.</p>
        </section>
      </main>
    </>
  )
}

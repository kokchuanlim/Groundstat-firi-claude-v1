import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from './Nav.module.css'

export default function Nav() {
  const router = useRouter()

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <div className={styles.logoMark}>
          <svg viewBox="0 0 18 18" fill="none" stroke="#fff" strokeWidth="2">
            <polyline points="2,13 6,8 10,11 16,4" />
            <circle cx="16" cy="4" r="2" fill="#fff" stroke="none" />
          </svg>
        </div>
        <Link href="/">
          <div>
            <div className={styles.logoText}>GroundStat</div>
            <div className={styles.logoSub}>FIRI — Founder Investment Readiness Index</div>
          </div>
        </Link>
      </div>

      <div className={styles.links}>
        <Link href="/report" className={router.pathname === '/report' ? styles.active : ''}>
          Sample report
        </Link>
        <Link href="/assessment" className={router.pathname === '/assessment' ? styles.active : ''}>
          Assessment
        </Link>
        <Link href="/scoring" className={router.pathname === '/scoring' ? styles.active : ''}>
          Scoring engine
        </Link>
        <Link href="/assessment" className={styles.ctaBtn}>
          Start assessment
        </Link>
      </div>
    </nav>
  )
}

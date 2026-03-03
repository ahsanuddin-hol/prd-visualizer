import { ArrowRight, Layout, Layers, Zap } from 'lucide-react';
import Link from 'next/link';
import styles from './page.module.css';
import { EPICS, STORIES } from '@/data/visualizations';

export default function Home() {
  const totalVisualizations = EPICS.length + STORIES.length;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Project Dashboard</h1>
        <p className={styles.subtitle}>
          Select a visualization mode to view implemented specifications.
        </p>
      </header>

      <div className={styles.grid}>
        <Link href="/epic" className={styles.card}>
          <div className={styles.cardIcon}>
            <Layout size={32} />
          </div>
          <div className={styles.cardContent}>
            <h2 className={styles.cardTitle}>Epic Visualizer</h2>
            <p className={styles.cardDescription}>
              View comprehensive feature implementations derived from detailed Product Requirement Documents (PRDs).
            </p>
            <div className={styles.cardFooter}>
              <span>Browse Epics</span>
              <ArrowRight size={16} />
            </div>
          </div>
        </Link>

        <Link href="/story" className={styles.card}>
          <div className={styles.cardIcon}>
            <Layers size={32} />
          </div>
          <div className={styles.cardContent}>
            <h2 className={styles.cardTitle}>Story Visualizer</h2>
            <p className={styles.cardDescription}>
              Explore granular UI components and flows based on individual Jira Tickets and User Stories.
            </p>
            <div className={styles.cardFooter}>
              <span>Browse Stories</span>
              <ArrowRight size={16} />
            </div>
          </div>
        </Link>
      </div>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <Zap size={20} className={styles.statIcon} />
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{totalVisualizations}</span>
            <span className={styles.statLabel}>Active Visualizations</span>
          </div>
        </div>
        {/* Add more stats as we build */}
      </div>
    </div>
  );
}

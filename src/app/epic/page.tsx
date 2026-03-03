import { EPICS } from '@/data/visualizations';
import Link from 'next/link';
import styles from './page.module.css';

export default function EpicListPage() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Epic Visualizations</h1>
                    <p className={styles.subtitle}>
                        Collection of implemented PRDs and major features.
                    </p>
                </div>

            </header>

            <div className={styles.grid}>
                {EPICS.map(epic => (
                    <Link key={epic.id} href={epic.href} className={styles.card}>
                        <div className={styles.cardIcon} style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                            <epic.icon size={24} />
                        </div>
                        <div>
                            <h3 className={styles.cardTitle} style={{ fontSize: '16px', lineHeight: '1.4' }}>
                                {epic.title}
                            </h3>
                            <p className={styles.cardDescription} style={{ fontSize: '13px', margin: 0 }}>
                                {epic.description}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div >
    );
}

import { Layers, Plus } from 'lucide-react';
import styles from './page.module.css';

export default function StoryListPage() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Story Visualizations</h1>
                    <p className={styles.subtitle}>
                        Collection of implemented Jira Tickets and User Stories.
                    </p>
                </div>

            </header>

            <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                    <Layers size={48} />
                </div>
                <h3 className={styles.emptyTitle}>No Stories Implemented Yet</h3>
                <p className={styles.emptyDescription}>
                    This is where we will showcase individual ticket implementations and UI flows.
                </p>
            </div>
        </div>
    );
}

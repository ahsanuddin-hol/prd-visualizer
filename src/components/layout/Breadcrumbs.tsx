'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import styles from './Breadcrumbs.module.css';

export default function Breadcrumbs() {
    const pathname = usePathname();
    const paths = pathname.split('/').filter(Boolean);

    if (paths.length === 0) return null;

    return (
        <nav className={styles.breadcrumbsContainer} aria-label="Breadcrumb">
            <Link href="/" className={styles.crumbLink}>
                <Home className={styles.homeIcon} />
                <span>Home</span>
            </Link>

            {paths.map((path, index) => {
                const href = `/${paths.slice(0, index + 1).join('/')}`;
                const isLast = index === paths.length - 1;
                const label = path.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

                return (
                    <div key={path} className={styles.separator}>
                        <ChevronRight size={14} />
                        {isLast ? (
                            <span className={styles.currentCrumb} aria-current="page">
                                {label}
                            </span>
                        ) : (
                            <Link href={href} className={styles.crumbLink}>
                                {label}
                            </Link>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}

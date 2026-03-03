'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FolderKanban, Layers, LayoutGrid, Settings, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import styles from './Sidebar.module.css';

const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutGrid },
    { name: 'Epic Visualizer', href: '/epic', icon: FolderKanban },
    { name: 'Story Visualizer', href: '/story', icon: Layers },
];

interface SidebarProps {
    isOpen: boolean;
    toggle: () => void;
}

export default function Sidebar({ isOpen, toggle }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside className={`${styles.sidebar} ${!isOpen ? styles.collapsed : ''}`}>
            <button className={styles.toggleBtn} onClick={toggle}>
                {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            </button>

            <div className={styles.logoContainer}>
                <div className={styles.logoIcon}>PV</div>
                {isOpen && <h1 className={styles.logoText}>PRD Visualizer</h1>}
            </div>

            <nav className={styles.nav}>
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

                    return (
                        <Link key={item.href} href={item.href} className={`${styles.navItem} ${isActive ? styles.active : ''}`}>
                            <item.icon size={20} className={styles.icon} />
                            {isOpen && <span className={styles.label}>{item.name}</span>}
                            {isActive && (
                                <motion.div
                                    layoutId="activeNav"
                                    className={styles.activeIndicator}
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className={styles.footer}>
                <button className={styles.settingsBtn}>
                    <Settings size={20} />
                    {isOpen && <span>Settings</span>}
                </button>
                <button
                    className={styles.settingsBtn}
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    title="Sign Out"
                >
                    <LogOut size={20} />
                    {isOpen && <span>Sign Out</span>}
                </button>
            </div>
        </aside>
    );
}

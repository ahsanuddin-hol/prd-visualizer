'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Breadcrumbs from './Breadcrumbs';
import styles from './MainLayout.module.css';

import { AutomationProvider, useAutomation } from '@/context/AutomationContext';
import PrdSidebar from './PrdSidebar';

// Helper to bridge MainLayout state with AutomationContext
const LayoutController = ({ setOpen }: { setOpen: (v: boolean) => void }) => {
    const { registerMainSidebarControl } = useAutomation();
    useEffect(() => {
        registerMainSidebarControl(setOpen);
    }, [registerMainSidebarControl, setOpen]);
    return null;
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const pathname = usePathname();
    // Only show Sidebar on specific detail pages (e.g. /epic/reopen-compliance), not on the listing pages (/epic or /story)
    const showPrdSidebar = pathname?.startsWith('/epic/') || pathname?.startsWith('/story/');

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    if (pathname === '/login') {
        return <>{children}</>;
    }

    return (
        <AutomationProvider>
            <LayoutController setOpen={setIsSidebarOpen} />
            <div className={styles.container}>
                <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />
                <main
                    className={`${styles.main} ${!isSidebarOpen ? styles.mainCollapsed : ''}`}
                    style={{ paddingRight: showPrdSidebar ? '48px' : '0' }}
                >
                    <div className={styles.content}>
                        <Breadcrumbs />
                        {children}
                    </div>
                </main>
                {showPrdSidebar && <PrdSidebar />}
            </div>
        </AutomationProvider>
    );
}

'use client';

import { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';

type AutomationHandler = (storyId: string) => void;

interface AutomationContextType {
    triggerStory: (storyId: string) => void;
    registerHandler: (handler: AutomationHandler) => () => void;

    // UI Controls
    setMainSidebarOpen: (open: boolean) => void;
    setPrdSidebarOpen: (open: boolean) => void;
    registerMainSidebarControl: (fn: (open: boolean) => void) => void;
    registerPrdSidebarControl: (fn: (open: boolean) => void) => void;
}

const AutomationContext = createContext<AutomationContextType | undefined>(undefined);

export function AutomationProvider({ children }: { children: ReactNode }) {
    const [handlers] = useState<Set<AutomationHandler>>(new Set());
    const [mainSidebarControl, setMainSidebarControl] = useState<((open: boolean) => void) | null>(null);
    const [prdSidebarControl, setPrdSidebarControl] = useState<((open: boolean) => void) | null>(null);

    const triggerStory = useCallback((storyId: string) => {
        console.log(`[Automation] Triggering story: ${storyId}`);
        handlers.forEach(handler => handler(storyId));
    }, [handlers]);

    const registerHandler = useCallback((handler: AutomationHandler) => {
        handlers.add(handler);
        return () => {
            handlers.delete(handler);
        };
    }, [handlers]);

    const registerMainSidebarControl = useCallback((fn: (open: boolean) => void) => {
        setMainSidebarControl(() => fn);
    }, []);

    const registerPrdSidebarControl = useCallback((fn: (open: boolean) => void) => {
        setPrdSidebarControl(() => fn);
    }, []);

    const setMainSidebarOpen = useCallback((open: boolean) => {
        if (mainSidebarControl) mainSidebarControl(open);
    }, [mainSidebarControl]);

    const setPrdSidebarOpen = useCallback((open: boolean) => {
        if (prdSidebarControl) prdSidebarControl(open);
    }, [prdSidebarControl]);

    const contextValue = useMemo(() => ({
        triggerStory,
        registerHandler,
        setMainSidebarOpen,
        setPrdSidebarOpen,
        registerMainSidebarControl,
        registerPrdSidebarControl
    }), [triggerStory, registerHandler, setMainSidebarOpen, setPrdSidebarOpen, registerMainSidebarControl, registerPrdSidebarControl]);

    return (
        <AutomationContext.Provider value={contextValue}>
            {children}
        </AutomationContext.Provider>
    );
}

export function useAutomation() {
    const context = useContext(AutomationContext);
    if (!context) {
        throw new Error('useAutomation must be used within an AutomationProvider');
    }
    return context;
}

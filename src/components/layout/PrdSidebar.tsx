'use client';

import { useState, useEffect } from 'react';
import { Play, ChevronRight, ChevronLeft, FileText, X } from 'lucide-react';
import { useAutomation } from '@/context/AutomationContext';
import ReactMarkdown from 'react-markdown';

interface Story {
    id: string;
    mdPath: string;
    description: string;
    ready: boolean;
}

export default function PrdSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedStory, setSelectedStory] = useState<{ title: string; content: string } | null>(null);
    const { triggerStory, registerPrdSidebarControl } = useAutomation();

    useEffect(() => {
        registerPrdSidebarControl(setIsOpen);
    }, [registerPrdSidebarControl]);

    const stories: Story[] = [
        {
            id: 'reopen',
            mdPath: 'Epic Reopen Compliance/reopen_compliance_story.md',
            description: 'Reset to Audited state → Open More Menu → Click Reopen → Show Modal',
            ready: true
        },
        {
            id: 'unassign',
            mdPath: 'Epic Reopen Compliance/unassign_compliance_story.md',
            description: 'Reset to Assigned → Open Setup → Clear Fields → Save',
            ready: true
        },
        {
            id: 'inactive',
            mdPath: 'Epic Reopen Compliance/inactive_compliance_constraints_story.md',
            description: 'Reset to Inactive → Verify hidden buttons & disabled inputs',
            ready: false
        },
        {
            id: 'notification',
            mdPath: 'Epic Reopen Compliance/reopen_compliance_notification_story.md',
            description: 'Trigger mock notification for Reopen event',
            ready: false
        }
    ];

    const getTitleFromPath = (path: string) => {
        const filename = path.split('/').pop()?.replace('.md', '') || '';
        return filename
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const handleStoryClick = async (story: Story) => {
        try {
            const response = await fetch(`/api/prd?path=${encodeURIComponent(story.mdPath)}`);
            if (response.ok) {
                const content = await response.text();
                setSelectedStory({
                    title: getTitleFromPath(story.mdPath),
                    content
                });
            } else {
                console.error('Failed to load PRD content');
            }
        } catch (error) {
            console.error('Error fetching PRD content:', error);
        }
    };

    return (
        <>
            <div
                style={{
                    width: isOpen ? '360px' : '48px', // Slightly wider for better reading
                    height: '100vh',
                    backgroundColor: 'var(--bg-secondary)',
                    borderLeft: '1px solid var(--border-subtle)',
                    position: 'fixed',
                    right: 0,
                    top: 0,
                    transition: 'width 0.3s ease',
                    zIndex: 40,
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                {/* Toggle Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                        position: 'absolute',
                        left: '-12px',
                        top: '24px',
                        width: '24px',
                        height: '24px',
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 50,
                        color: 'var(--text-secondary)'
                    }}
                >
                    {isOpen ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>

                {/* Header */}
                <div style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)', display: isOpen ? 'block' : 'none' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileText size={16} color="var(--accent-primary)" />
                        Interactive PRD
                    </h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        Select a story to view details or run automation.
                    </p>
                </div>

                {/* Content */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: isOpen ? 'block' : 'none' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {stories.map(story => {
                            const title = getTitleFromPath(story.mdPath);
                            return (
                                <div
                                    key={story.id}
                                    onClick={() => handleStoryClick(story)}
                                    style={{
                                        padding: '12px',
                                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                        borderRadius: '8px',
                                        border: '1px solid var(--border-subtle)',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)'}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                                            {title}
                                        </span>
                                        {story.ready && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent opening modal
                                                    triggerStory(story.id);
                                                }}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    padding: '4px 8px',
                                                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                                    border: '1px solid rgba(99, 102, 241, 0.3)',
                                                    borderRadius: '4px',
                                                    color: 'var(--accent-primary)',
                                                    fontSize: '11px',
                                                    fontWeight: 600,
                                                    cursor: 'pointer'
                                                }}
                                                title="Run Automation"
                                            >
                                                <Play size={10} fill="currentColor" />
                                                RUN
                                            </button>
                                        )}
                                    </div>
                                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                                        {story.description}
                                    </p>
                                    {!story.ready && (
                                        <span style={{ display: 'inline-block', marginTop: '8px', fontSize: '10px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                            (Automation Not Ready)
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Collapsed State Icon */}
                {!isOpen && (
                    <div style={{ padding: '24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                        <FileText size={20} color="var(--text-secondary)" />
                    </div>
                )}
            </div>

            {/* PRD Content Modal */}
            {selectedStory && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 60,
                    padding: '32px'
                }} onClick={() => setSelectedStory(null)}>
                    <div
                        style={{
                            backgroundColor: 'var(--bg-primary)',
                            borderRadius: '12px',
                            width: '900px',
                            maxWidth: '90%',
                            maxHeight: '85vh',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                            border: '1px solid var(--border-subtle)'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{
                            padding: '24px',
                            borderBottom: '1px solid var(--border-subtle)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)' }}>
                                {selectedStory.title}
                            </h2>
                            <button
                                onClick={() => setSelectedStory(null)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--text-secondary)',
                                    padding: '8px',
                                    borderRadius: '8px'
                                }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div style={{
                            padding: '32px',
                            overflowY: 'auto',
                            color: 'var(--text-primary)',
                            lineHeight: '1.6',
                            fontSize: '15px'
                        }} className="markdown-body">
                            <ReactMarkdown
                                components={{
                                    h1: ({ node, ...props }) => <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px', marginTop: '0', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }} {...props} />,
                                    h2: ({ node, ...props }) => <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px', marginTop: '24px' }} {...props} />,
                                    h3: ({ node, ...props }) => <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '10px', marginTop: '20px' }} {...props} />,
                                    p: ({ node, ...props }) => <p style={{ marginBottom: '16px' }} {...props} />,
                                    ul: ({ node, ...props }) => <ul style={{ paddingLeft: '24px', marginBottom: '16px' }} {...props} />,
                                    ol: ({ node, ...props }) => <ol style={{ paddingLeft: '24px', marginBottom: '16px' }} {...props} />,
                                    li: ({ node, ...props }) => <li style={{ marginBottom: '4px' }} {...props} />,
                                    blockquote: ({ node, ...props }) => <blockquote style={{ borderLeft: '4px solid var(--accent-primary)', paddingLeft: '16px', marginLeft: 0, color: 'var(--text-secondary)', fontStyle: 'italic' }} {...props} />,
                                    code: ({ node, className, children, ...props }) => {
                                        const match = /language-(\w+)/.exec(className || '');
                                        const isInline = !match && !String(children).includes('\n');
                                        return isInline ? (
                                            <code style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '2px 4px', borderRadius: '4px', fontSize: '0.9em' }} {...props}>
                                                {children}
                                            </code>
                                        ) : (
                                            <code
                                                style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', overflowX: 'auto', marginBottom: '16px' }}
                                                {...props}
                                            >
                                                {children}
                                            </code>
                                        );
                                    }
                                }}
                            >
                                {selectedStory.content}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

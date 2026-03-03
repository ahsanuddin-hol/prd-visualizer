'use client';

import { useState, useMemo, useEffect } from 'react';
import {
    ChevronLeft,
    MoreHorizontal,
    ChevronDown,
    CheckSquare,
    Search,
    Bold,
    Italic,
    Link as LinkIcon,
    Edit,
    Trash2,
    X,
    Plus,
    RotateCcw,
    AlertCircle,
    CheckCircle2,
    Circle,
    FileText,
    Info,
    Pencil,
    Settings,
    Square,
    UserPlus,
    Play
} from 'lucide-react';
import { useAutomation } from '@/context/AutomationContext';
import styles from './page.module.css';

// --- Constants & Types ---
const GROUPS = ['Legal', 'Compliance', 'Corsec'];
const USERS = ['Feryan', 'Wira', 'Darryl'];
const ROLES = ['Viewer', 'Contributor'];

interface Member {
    id: number;
    name: string;
    role: string;
    status: 'Active' | 'Inactive';
}

interface FormData {
    priority: string;
    assigneeGroup: string;
    assignee: string[];
    verifikatorGroup: string;
    verifikator: string[];
    dueDate: string;
    expiredDate: string;
    description: string;
}

const INITIAL_DATA = {
    assigneeGroup: '',
    assignee: [],
    verifikatorGroup: '',
    verifikator: [],
    cc: [],
    dueDate: '',
    expiredDate: '',
    priority: 'Low', // Default priority
    description: ''
};

const INITIAL_ACTIVITIES = [
    {
        id: '1',
        user: 'Ahsanuddin (Admin)',
        action: 'Activate this obligation',
        timestamp: '27 Jan 2026, 09:00 AM'
    }
];

export default function ReopenCompliancePage() {
    // UI State
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [highlightedSections, setHighlightedSections] = useState<string[]>([]);

    // Data State
    const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
    const [savedData, setSavedData] = useState<FormData>(INITIAL_DATA);
    const [members, setMembers] = useState<Member[]>([]);

    // Member Config State in Modal
    const [inviteSearch, setInviteSearch] = useState('');

    // Automation Logic
    const { registerHandler, setMainSidebarOpen, setPrdSidebarOpen } = useAutomation();
    const [pointer, setPointer] = useState({ x: 0, y: 0, visible: false, click: false });
    const [automationMessage, setAutomationMessage] = useState<string | null>(null);

    useEffect(() => {
        const unregister = registerHandler((storyId) => {
            if (storyId === 'reopen') {
                setAutomationMessage('Running Automation: Reopen Compliance');

                // 1. Force Precondition: Comply State
                const now = new Date();
                const todayStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

                setIsAudited(true);
                setIsReadyToReview(true); // Enable Ready to Review Step
                setIsInactive(false);
                setEnforcedDate(todayStr); // Dynamic Date
                setVerificationDate(todayStr); // Dynamic Date
                setAuditDate("27 Jan 2026"); // Date for Audited

                // Set Data to look "filled"
                const activeData = {
                    assigneeGroup: "Internal Compliance Team",
                    assignee: ["Sarah Jenkins"],
                    verifikatorGroup: "Senior Auditors",
                    verifikator: ["Michael Chen"],
                    priority: "High",
                    dueDate: "",
                    expiredDate: "",
                    description: ""
                };

                setFormData(prev => ({ ...prev, ...activeData }));
                setSavedData(prev => ({ ...prev, ...activeData })); // Enable Assigned Step

                // Force Activities
                const automationActivities = [
                    { id: '4', action: 'Approve this obligation', user: 'Ahsanuddin (Admin)', timestamp: `${todayStr}, 11:30 AM` },
                    { id: '3', action: 'Claim this obligation', user: 'Ahsanuddin (Admin)', timestamp: `${todayStr}, 11:00 AM` },
                    { id: '2', action: 'Setup this obligation', user: 'Ahsanuddin (Admin)', timestamp: `${todayStr}, 10:00 AM` },
                    { id: '1', action: 'Activate this obligation', user: 'Ahsanuddin (Admin)', timestamp: `${todayStr}, 09:00 AM` }
                ];
                setActivities(automationActivities);

                // Helper to safely target elements
                const movePointerTo = (id: string) => {
                    const el = document.getElementById(id);
                    if (el) {
                        const rect = el.getBoundingClientRect();
                        setPointer({
                            x: rect.left + rect.width / 2,
                            y: rect.top + rect.height / 2,
                            visible: true,
                            click: false
                        });
                    }
                };

                const clickPointer = () => {
                    setPointer(prev => ({ ...prev, click: true }));
                    setTimeout(() => setPointer(prev => ({ ...prev, click: false })), 200);
                };

                // 2. Visual Sequence
                // Collapse Sidebars
                setMainSidebarOpen(false);
                setPrdSidebarOpen(false);

                // Step 1: Move to More Menu
                setTimeout(() => {
                    movePointerTo('btn-more-menu');
                }, 500);

                // Step 2: Click More Menu (3s delay)
                setTimeout(() => {
                    clickPointer();
                    setIsMenuOpen(true);
                }, 3500);

                // Step 3: Move to Reopen (allow render)
                setTimeout(() => {
                    movePointerTo('btn-menu-reopen');
                }, 4500);

                // Step 4: Click Reopen (3s delay)
                setTimeout(() => {
                    clickPointer();
                    setIsMenuOpen(false);
                    setIsReopenModalOpen(true);
                }, 7500);

                // Step 5: Move to Yes (allow render)
                setTimeout(() => {
                    movePointerTo('btn-modal-confirm');
                }, 8500);

                // Step 6: Click Yes & Execute Logic (3s delay)
                setTimeout(() => {
                    clickPointer();

                    // Click Yes Logic
                    setIsAudited(false);
                    setIsReadyToReview(false);
                    setIsReopenModalOpen(false);
                    setVerificationDate(null);
                    setAuditDate(null);

                    // Helper to format date inside effect
                    const now = new Date();
                    const todayStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

                    setActivities(prev => [{
                        id: Date.now().toString(),
                        user: 'Ahsanuddin (Admin)',
                        action: 'Reopen this obligation back to In Progress from Comply',
                        timestamp: `${todayStr}, ${timeStr}`
                    }, ...prev]);

                    // Hide Pointer, Show Success Toast
                    setPointer(prev => ({ ...prev, visible: false }));
                    showToast('Success! Compliance has been reopened', 'success');

                    // Expand Sidebar back? Maybe keeps it clean. User can open if they want.
                }, 11500);

                // Step 7: Verification Mode (After Toast, +4s)
                setTimeout(() => {
                    setAutomationMessage('Verifying: Status, Stepper, and Activity Log...');

                    // Highlight
                    setHighlightedSections(['status', 'progress', 'activity', 'info-progress']);
                    setActiveTab('activity'); // Force open Activity Tab
                }, 15500);

                // 4. Cleanup Highlights
                setTimeout(() => {
                    setHighlightedSections([]);
                    setAutomationMessage(null); // Clear banner
                }, 25500); // Extended cleanup
            } else if (storyId === 'unassign') {
                setAutomationMessage('Running Automation: Unassign Compliance');

                // 1. Force Precondition: Assigned State
                setIsAudited(false);
                setIsReadyToReview(false);
                setIsInactive(false);
                setIsEditing(false); // Start closed

                // Pre-fill data
                setFormData(prev => ({
                    ...prev,
                    assigneeGroup: "Internal Compliance Team",
                    assignee: ["Sarah Jenkins"],
                    verifikatorGroup: "Senior Auditors",
                    verifikator: ["Michael Chen"],
                    priority: "High"
                }));
                setSavedData(prev => ({
                    ...prev,
                    assigneeGroup: "Internal Compliance Team",
                    assignee: ["Sarah Jenkins"],
                    verifikatorGroup: "Senior Auditors",
                    verifikator: ["Michael Chen"],
                    priority: "High"
                }));

                // Helper to safely target elements
                const movePointerTo = (id: string) => {
                    const el = document.getElementById(id);
                    if (el) {
                        const rect = el.getBoundingClientRect();
                        setPointer({
                            x: rect.left + rect.width / 2,
                            y: rect.top + rect.height / 2,
                            visible: true,
                            click: false
                        });
                    }
                };

                const clickPointer = () => {
                    setPointer(prev => ({ ...prev, click: true }));
                    setTimeout(() => setPointer(prev => ({ ...prev, click: false })), 200);
                };

                // 2. Visual Sequence
                // Collapse Sidebars
                setMainSidebarOpen(false);
                setPrdSidebarOpen(false);

                // Step 1: Move to Setup Compliance
                setTimeout(() => {
                    movePointerTo('btn-setup-compliance');
                }, 500);

                // Step 2: Click Setup Compliance (3s delay)
                setTimeout(() => {
                    clickPointer();
                    setIsEditing(true);
                }, 3500);

                // Step 3: Move to Clear Assignee Group (Allow render)
                setTimeout(() => {
                    movePointerTo('btn-clear-assigneeGroup');
                }, 4500);

                // Step 4: Click Clear Assignee Group
                setTimeout(() => {
                    clickPointer();
                    // Simulate clearing Assignee Group
                    handleChange('assigneeGroup', ''); // This also clears assignee
                }, 7500);

                // Step 5: Move to Clear Verifikator Group (Allow render)
                setTimeout(() => {
                    movePointerTo('btn-clear-verifikatorGroup');
                }, 8500);

                // Step 6: Click Clear Verifikator Group
                setTimeout(() => {
                    clickPointer();
                    // Simulate clearing Verifikator Group
                    handleChange('verifikatorGroup', ''); // This also clears verifikator
                }, 11500);

                // Step 7: Move Pointer to Save Change
                setTimeout(() => {
                    movePointerTo('btn-save-change');
                }, 12500);

                // Step 8: Click Save Change
                setTimeout(() => {
                    clickPointer();

                    // Logic: Save and Update State
                    // Ensure perfectly cleared just in case
                    setSavedData(prev => ({
                        ...prev,
                        assigneeGroup: "",
                        assignee: [],
                        verifikatorGroup: "",
                        verifikator: []
                    }));

                    const now = new Date();
                    const todayStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                    setEnforcedDate(todayStr); // Reset to today as per requirement

                    setIsEditing(false);

                    logActivity('Setup this obligation');
                    showToast('Success! Compliance has been set up.', 'success');

                    // Hide Pointer
                    setPointer(prev => ({ ...prev, visible: false }));
                }, 15500);

                // Step 9: Verification Mode (After Toast, +4s)
                setTimeout(() => {
                    setAutomationMessage('Verifying: Status, Stepper, Enforced Date, and Activity Log...');

                    // Highlight
                    setHighlightedSections(['status', 'progress', 'activity', 'info-progress']);
                    setActiveTab('activity'); // Force open Activity Tab
                }, 19500);

                // 4. Cleanup Highlights
                setTimeout(() => {
                    setHighlightedSections([]);
                    setAutomationMessage(null); // Clear banner
                }, 29500);

            } else if (storyId === 'inactive') {
                showToast('Running Automation: Inactive Constraint', 'success');

                // 1. Force Precondition: Inactive State
                setIsAudited(false);
                setIsEditing(false);
                setIsInactive(true);

                // Set some data to show it was active before
                setFormData(prev => ({
                    ...prev,
                    assigneeGroup: "Internal Compliance Team",
                    assignee: ["Sarah Jenkins"],
                    verifikatorGroup: "Senior Auditors",
                    verifikator: ["Michael Chen"]
                }));

                // Visual Sequence: Just highlight the badge maybe?
                // The state change itself is the visual.

            } else if (storyId === 'notification') {
                // Mock Notification
                showToast('New Notification: Compliance Reopened by Admin', 'success');
            }
            return; // Explicit return for cleanliness
        });
        return unregister;
    }, [registerHandler, setMainSidebarOpen, setPrdSidebarOpen]);

    // Derived State
    const isDirty = useMemo(() => {
        return JSON.stringify(formData) !== JSON.stringify(savedData);
    }, [formData, savedData]);

    // Handlers
    // Toast State
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; visible: boolean } | null>(null);

    // State for Workflow
    const [isReadyToReview, setIsReadyToReview] = useState(false);
    const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
    const [verificationDate, setVerificationDate] = useState<string | null>(null);
    const [isAudited, setIsAudited] = useState(false);
    const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
    const [auditDate, setAuditDate] = useState<string | null>(null);
    const [isReopenModalOpen, setIsReopenModalOpen] = useState(false);
    const [isInactive, setIsInactive] = useState(false);
    const [isInactivateModalOpen, setIsInactivateModalOpen] = useState(false);
    const [enforcedDate, setEnforcedDate] = useState('27 Jan 2026');
    const [activeTab, setActiveTab] = useState('checklist'); // 'checklist', 'regulation', 'activity'
    const [activities, setActivities] = useState<Array<{ id: string; user: string; action: string; timestamp: string }>>(INITIAL_ACTIVITIES);

    // Handlers
    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type, visible: true });
        setTimeout(() => {
            setToast(null);
        }, 3000);
    };

    // Activity logging
    const logActivity = (action: string) => {
        const now = new Date();
        const formattedDate = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        const timestamp = `${formattedDate}, ${formattedTime}`;

        const newActivity = {
            id: Date.now().toString(),
            user: 'Ahsanuddin (Admin)',
            action,
            timestamp
        };

        setActivities(prev => [newActivity, ...prev]);
    };

    const startEditing = () => {
        setFormData(savedData); // Keep starting with saved data
        setIsEditing(true);
    };

    const cancelEditing = () => {
        setFormData(savedData); // Revert to saved state
        setIsEditing(false);
    };

    const saveChanges = () => {

        // Validation Logic
        const isAssigneeCleared = !formData.assigneeGroup || formData.assignee.length === 0;
        const isVerifikatorCleared = !formData.verifikatorGroup || formData.verifikator.length === 0;

        if (isAssigneeCleared || isVerifikatorCleared) {
            if (isAudited) {
                showToast('Failed! Cannot remove assignee or verificator when complied.', 'error');
                return;
            } else if (isReadyToReview) {
                showToast('Failed! Cannot remove assignee or verificator while on review.', 'error');
                return;
            }
        }

        const isValid = true;

        if (isValid) {
            setSavedData(formData);

            // Check if we are reverting to Enforced state (not assigned)
            const willBeAssigned = !!formData.assigneeGroup &&
                formData.assignee.length > 0 &&
                !!formData.verifikatorGroup &&
                formData.verifikator.length > 0;

            if (!willBeAssigned) {
                setEnforcedDate(formattedDate);
            }

            setIsEditing(false);
            logActivity('Setup this obligation');
            showToast('Success! Compliance has been set up.', 'success');
        } else {
            showToast('Failed! Please check your inputs.', 'error');
        }
    };

    const handleReset = () => {
        setFormData(INITIAL_DATA);
        setSavedData(INITIAL_DATA);
        setIsEditing(false);
        setIsMemberModalOpen(false);
        setMembers([]);
        setIsReadyToReview(false); // Reset workflow
        setVerificationDate(null);
        setIsAudited(false);
        setAuditDate(null);
        setIsInactive(false); // Reset inactive state
        setActivities(INITIAL_ACTIVITIES); // Reset activities
        setEnforcedDate('27 Jan 2026'); // Reset enforced date
    };

    const handleInactivate = () => {
        setIsInactivateModalOpen(true);
    };

    const confirmInactivate = () => {
        setIsInactive(true);
        setIsEditing(false);
        setIsInactivateModalOpen(false);
        logActivity('Inactivate this obligation');
        showToast('Success! Compliance has been inactivated.', 'success');
    };

    const confirmClaim = () => {
        setIsReadyToReview(true);
        setIsClaimModalOpen(false);
        setVerificationDate(formattedDate);
        logActivity("Claim this obligation fulfillment");
        showToast('Success! Compliance has been claimed.', 'success');
    };

    const confirmApprove = () => {
        setIsAudited(true);
        setIsApprovalModalOpen(false);
        setAuditDate(formattedDate);
        logActivity("Approve this obligation's fulfillment claim");
        showToast('Success! Compliance has been approved.', 'success');
    };

    const confirmReject = () => {
        setIsReadyToReview(false);
        setIsApprovalModalOpen(false);
        setVerificationDate(null);
        // Date stamp for assignment not needed to update? Requirement says "back to assigned with today date as stamp"
        // Wait, "back to assigned with today date as stamp". Assigned step uses formattedDate if assigned.
        // It should just use the current formattedDate which is dynamic "today".
        logActivity("Reject this obligation's fullfilment claim");
        showToast('Success! Compliance has been rejected.', 'success');
    };

    const confirmReopen = () => {
        setIsAudited(false);
        setIsReadyToReview(false);
        setIsReopenModalOpen(false);
        setVerificationDate(null);
        setAuditDate(null);
        logActivity('Reopen this obligation back to In Progress from Comply');
        showToast('Success! Compliance has been reopened.', 'success');
    };

    const handleChange = (field: keyof FormData, value: any) => {
        setFormData(prev => {
            const newData = { ...prev, [field]: value };

            // Rule: When clearing assignee group, assignee also cleared
            if (field === 'assigneeGroup' && !value) {
                newData.assignee = [];
            }

            // Rule: When clearing verifikator group, verifikator also cleared
            if (field === 'verifikatorGroup' && !value) {
                newData.verifikator = [];
            }

            return newData;
        });
    };

    const toggleMultiSelect = (field: 'assignee' | 'verifikator', value: string) => {
        setFormData(prev => {
            const current = prev[field];

            // Logic for "All User in Group"
            if (value === 'All User in Group') {
                if (current.includes('All User in Group')) {
                    // Deselecting All User -> Clear it
                    return { ...prev, [field]: [] };
                } else {
                    // Selecting All User -> Clear others and set only All User
                    return { ...prev, [field]: ['All User in Group'] };
                }
            }

            // Logic for specific users
            if (current.includes('All User in Group')) {
                // If All User is selected, and we click a specific user, remove All User and add the specific user
                // Wait, requirements say: "When the value is TRUE... other option below it will be disabled"
                // This means we can't click other options if All User is selected?
                // "When click once again and make it FALSE, other option back to available."
                // So if All User is selected, we shouldn't be able to trigger this for others.
                // But just in case, let's strictly handle it in the render disabled state.
                return prev;
            }

            const exists = current.includes(value);
            return {
                ...prev,
                [field]: exists ? current.filter(item => item !== value) : [...current, value]
            };
        });
    };

    // Member Modal Handlers
    const addMember = (name: string) => {
        if (!members.find(m => m.name === name)) {
            setMembers([...members, { id: Date.now(), name, role: 'Viewer', status: 'Active' }]);
        }
    };

    const removeMember = (id: number) => {
        setMembers(members.filter(m => m.id !== id));
    };

    const updateMemberRole = (id: number, role: string) => {
        setMembers(members.map(m => m.id === id ? { ...m, role } : m));
    };

    // Helper to render multi-select
    const renderMultiSelect = (field: 'assignee' | 'verifikator') => {
        if (!isEditing) return formData[field].length > 0 ? formData[field].join(', ') : '-';

        const isOpen = activeDropdown === field;
        const selectedValues = formData[field];
        const hasSelection = selectedValues.length > 0;
        const displayLabel = hasSelection ? selectedValues.join(', ') : `Select ${field}`;

        const clearSelection = (e: React.MouseEvent) => {
            e.stopPropagation();
            handleChange(field, []);
        };

        return (
            <div className={styles.multiSelectWrapper}>
                <button
                    className={`${styles.multiSelectTrigger} ${isOpen ? styles.active : ''}`}
                    onClick={() => setActiveDropdown(isOpen ? null : field)}
                >
                    <span className={hasSelection ? styles.selectedText : styles.placeholderText}>
                        {displayLabel}
                    </span>
                    <div className={styles.triggerIcons}>
                        {hasSelection && (
                            <X
                                id={`btn-clear-${field}`}
                                size={14}
                                className={styles.clearIcon}
                                onClick={clearSelection}
                            />
                        )}
                        <ChevronDown size={14} className={isOpen ? styles.rotate180 : ''} />
                    </div>
                </button>

                {isOpen && (
                    <div className={styles.multiSelectDropdown}>
                        <div
                            className={`${styles.multiSelectOption} ${selectedValues.includes('All User in Group') ? styles.activeOption : ''}`}
                            onClick={() => toggleMultiSelect(field, 'All User in Group')}
                        >
                            {selectedValues.includes('All User in Group') ? <CheckSquare size={16} /> : <Square size={16} />}
                            All User in Group
                        </div>
                        {USERS.map(user => {
                            const isAllSelected = selectedValues.includes('All User in Group');
                            return (
                                <div
                                    key={user}
                                    className={`${styles.multiSelectOption} ${selectedValues.includes(user) ? styles.activeOption : ''} ${isAllSelected ? styles.disabledOption : ''}`}
                                    onClick={() => !isAllSelected && toggleMultiSelect(field, user)}
                                    style={isAllSelected ? { opacity: 0.5, cursor: 'not-allowed', pointerEvents: 'none' } : {}}
                                >
                                    {selectedValues.includes(user) ? <CheckSquare size={16} /> : <Square size={16} />}
                                    {user}
                                </div>
                            );
                        })}
                    </div>
                )}
                {/* Backdrop to close dropdown when clicking outside */}
                {isOpen && (
                    <div
                        className={styles.dropdownBackdrop}
                        onClick={() => setActiveDropdown(null)}
                    />
                )}
            </div>
        );
    };

    // Helper to render single select (Assignee/Verifikator Group)
    const renderGroupSelect = (field: 'assigneeGroup' | 'verifikatorGroup') => {
        if (!isEditing) return formData[field] || '-';

        const isOpen = activeDropdown === field;
        const selectedValue = formData[field];
        const hasSelection = !!selectedValue;
        const displayLabel = hasSelection ? selectedValue : `Select group`;

        const clearSelection = (e: React.MouseEvent) => {
            e.stopPropagation();
            handleChange(field, '');
        };

        return (
            <div className={styles.multiSelectWrapper}>
                <button
                    className={`${styles.multiSelectTrigger} ${isOpen ? styles.active : ''}`}
                    onClick={() => setActiveDropdown(isOpen ? null : field)}
                >
                    <span className={hasSelection ? styles.selectedText : styles.placeholderText}>
                        {displayLabel}
                    </span>
                    <div className={styles.triggerIcons}>
                        {hasSelection && (
                            <X
                                id={`btn-clear-${field}`}
                                size={14}
                                className={styles.clearIcon}
                                onClick={clearSelection}
                            />
                        )}
                        <ChevronDown size={14} className={isOpen ? styles.rotate180 : ''} />
                    </div>
                </button>

                {isOpen && (
                    <div className={styles.groupSelectDropdown}>
                        {GROUPS.map(group => (
                            <div
                                key={group}
                                className={styles.groupOption}
                                onClick={() => {
                                    handleChange(field, group);
                                    setActiveDropdown(null);
                                }}
                            >
                                {group}
                            </div>
                        ))}
                    </div>
                )}
                {/* Backdrop to close dropdown when clicking outside */}
                {isOpen && (
                    <div
                        className={styles.dropdownBackdrop}
                        onClick={() => setActiveDropdown(null)}
                    />
                )}
            </div>
        );
    };

    // State Logic
    const isAssigned = useMemo(() => {
        return (
            !!savedData.assigneeGroup &&
            savedData.assignee.length > 0 &&
            !!savedData.verifikatorGroup &&
            savedData.verifikator.length > 0
        );
    }, [savedData]);

    const formattedDate = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    return (
        <div className={styles.htmlMirrorContainer}>
            {/* Toast Notification */}
            {toast && toast.visible && (
                <div className={styles.toastContainer}>
                    <div className={`${styles.toast} ${toast.type === 'success' ? styles.toastSuccess : styles.toastError}`}>
                        {toast.type === 'success' ?
                            <CheckCircle2 size={20} color="white" fill="#10b981" /> :
                            <AlertCircle size={20} color="#ef4444" />
                        }
                        {toast.message}
                    </div>
                </div>
            )}

            {/* The Outer Wrapper mimicking the user HTML structure */}
            <div className={styles.mainContentArea}>
                <div className={styles.topRightAction}>
                    <button className={styles.btnResetState} onClick={handleReset}>Reset State</button>
                </div>

                {/* 1. Header Card */}
                <div className={styles.cardBox}>
                    <div className={styles.headerTopRow}>
                        <div className={styles.headerTitleGroup}>
                            <p className={styles.idText}>WP.1.C.37.I</p>
                            {(() => {
                                const priority = savedData.priority || 'Low';
                                let badgeClass = styles.statusBadgeP3;
                                let badgeLabel = 'P3';

                                if (priority === 'High') {
                                    badgeClass = styles.statusBadgeP1;
                                    badgeLabel = 'P1';
                                } else if (priority === 'Medium') {
                                    badgeClass = styles.statusBadgeP2;
                                    badgeLabel = 'P2';
                                }

                                const isHighlighted = highlightedSections.includes('status');

                                return (
                                    <div className={styles.headerTopRow}>
                                        <div className={styles.headerRight}>
                                            <span className={badgeClass}>
                                                <span className={styles.badgeIcon}>{badgeLabel}</span>
                                                <span>{priority}</span>
                                            </span>
                                            <span className={`${styles.flexBox} ${isHighlighted ? styles.highlight : ''}`} style={{ borderRadius: '12px' }}>
                                                {isAssigned ? (
                                                    isAudited ? (
                                                        <span className={styles.statusBadgeComply}>Comply</span>
                                                    ) : (
                                                        <span className={styles.statusBadgeInProgress}>In Progress</span>
                                                    )
                                                ) : (
                                                    <span className={styles.statusBadgeUnassigned}>Unassigned</span>
                                                )}
                                                {isInactive && (
                                                    <span className={styles.statusBadgeInactive} style={{ marginLeft: '4px' }}>Inactive</span>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>

                    <p className={styles.headerMainTitle}>
                        Mekanisme pelaporan, diagnosis, penetapan, pemberian manfaat program JKK dan penyelesaian atas perbedaan pendapat dalam menetapkan PAK karena Covid-19 dilaksanakan dengan mengacu pada ketentuan peraturan perundang undangan
                    </p>

                    <div className={styles.headerEditRow}>
                        <button className={styles.btnEditAlias}>
                            <div className={styles.flexBox}>
                                <Pencil size={14} className="mr-1" />
                                <span className="ml-[1px]">Edit Alias</span>
                            </div>
                        </button>
                    </div>


                    {/* Highlight Applied to Stepper ONLY, excluding actions if they were here (they are separate below) */}
                    <div className={styles.stepperContainer}>
                        <div className={`${styles.stepperItem} ${highlightedSections.includes('progress') ? styles.highlight : ''}`} style={{ borderRadius: '8px', padding: '4px' }}>
                            <div className={styles.flexBox}>
                                <CheckCircle2 size={32} color={!isAssigned ? "#10b981" : "#10b981"} fill="#e0f2fe" />
                                <div className={styles.stepperTextGroup}>
                                    <p className={styles.stepTitle}>Enforced</p>
                                    <p className={styles.stepDate}>{enforcedDate}</p>
                                </div>
                            </div>
                            <div className={styles.stepDivider}><hr className={`${styles.stepLine} ${isAssigned ? styles.stepLineActive : ''}`} style={{ borderColor: isAssigned ? '#10b981' : '#e2e8f0' }} /></div>

                            <div className={styles.stepperItem}>
                                <div className={styles.flexBox}>
                                    {isAssigned ? (
                                        <CheckCircle2 size={32} color="#10b981" fill="#e0f2fe" />
                                    ) : (
                                        <Circle size={32} color="#cbd5e1" />
                                    )}
                                    <div className={styles.stepperTextGroup}>
                                        <p className={isAssigned ? styles.stepTitle : styles.stepTitleInactive}>Assigned</p>
                                        {isAssigned && <p className={styles.stepDate}>{formattedDate}</p>}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.stepDivider}><hr className={styles.stepLine} /></div>

                            <div className={styles.stepperItem}>
                                <div className={styles.flexBox}>
                                    {isReadyToReview ? (
                                        <CheckCircle2 size={32} color="#10b981" fill="#e0f2fe" />
                                    ) : (
                                        <Circle size={32} color={isAssigned ? "#cbd5e1" : "#cbd5e1"} />
                                    )}
                                    <div className={styles.stepperTextGroup}>
                                        <p className={isReadyToReview ? styles.stepTitle : styles.stepTitleInactive}>Ready to Review</p>
                                        {isReadyToReview && <p className={styles.stepDate}>{verificationDate}</p>}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.stepDivider}><hr className={styles.stepLine} /></div>

                            <div className={styles.flexBox}>
                                {isAudited ? (
                                    <CheckCircle2 size={32} color="#10b981" fill="#e0f2fe" />
                                ) : (
                                    <Circle size={32} color={isReadyToReview ? "#cbd5e1" : "#cbd5e1"} />
                                )}
                                <div className={styles.stepperTextGroup}>
                                    <p className={isAudited ? styles.stepTitle : styles.stepTitleInactive}>Audited</p>
                                    {isAudited && <p className={styles.stepDate}>{auditDate}</p>}
                                </div>
                            </div>
                        </div>

                        <div className={styles.headerActionButtons}>
                            {!isInactive && (
                                <>
                                    {isAssigned ? (
                                        isReadyToReview ? (
                                            !isAudited && <button className={styles.btnHeaderPrimary} onClick={() => setIsApprovalModalOpen(true)}>Approval</button>
                                        ) : (
                                            <button className={styles.btnHeaderPrimary} onClick={() => setIsClaimModalOpen(true)}>Claim</button>
                                        )
                                    ) : (
                                        <button className={styles.btnInactivate} onClick={handleInactivate}>Inactivate</button>
                                    )}

                                    {/* Renew Button */}
                                    {isAudited && savedData.expiredDate && (
                                        <button className={styles.btnHeaderPrimary}>Renew</button>
                                    )}
                                </>
                            )}
                            <div className={styles.actionWrapper}>
                                <button id="btn-more-menu" className={styles.btnMore} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                    <MoreHorizontal size={20} />
                                </button>
                                {isMenuOpen && (
                                    <div className={styles.dropdownMenu}>
                                        {isInactive ? (
                                            <>
                                                <button className={styles.dropdownItem}>Duplicate</button>
                                                <button className={styles.dropdownItem}>Bookmark</button>
                                                <button className={styles.dropdownItem}>Share</button>
                                            </>
                                        ) : (
                                            <>
                                                <button className={styles.dropdownItem}>Duplicate</button>
                                                <button className={styles.dropdownItem}>Share</button>
                                                <button className={styles.dropdownItem}>Bookmark</button>
                                                {isAudited && (
                                                    <button
                                                        id="btn-menu-reopen"
                                                        className={styles.dropdownItem}
                                                        onClick={() => {
                                                            setIsMenuOpen(false);
                                                            setIsReopenModalOpen(true);
                                                        }}
                                                    >
                                                        Reopen
                                                    </button>
                                                )}
                                                {isAssigned && (
                                                    <button
                                                        className={styles.dropdownItem}
                                                        onClick={() => {
                                                            setIsMenuOpen(false);
                                                            handleInactivate();
                                                        }}
                                                    >
                                                        Inactivate
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>

                {/* 2. Compliance Information */}
                <div className={`${styles.cardBox} ${styles.grayBg}`}>
                    <div className={styles.sectionHeader}>
                        <p className={styles.sectionTitle}>Compliance Information</p>
                        <div className={styles.sectionActions}>
                            {!isInactive && !isEditing ? (
                                <button id="btn-setup-compliance" className={styles.btnPrimary} onClick={startEditing}>
                                    <Settings size={14} className="mr-2" />
                                    Setup Compliance
                                </button>
                            ) : !isInactive && isEditing ? (
                                <div className={styles.flexBox}>
                                    <button className={styles.btnCancel} onClick={cancelEditing}>Cancel</button>
                                    <button
                                        id="btn-save-change"
                                        className={`${styles.btnSave} ${isDirty ? styles.btnSaveActive : ''}`}
                                        onClick={saveChanges}
                                        disabled={!isDirty}
                                    >
                                        Save Change
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    </div>

                    <div className={styles.formContainer}>
                        {/* Left Column */}
                        <div className={styles.formColumn}>
                            <div className={styles.formRow}>
                                <div className={styles.labelCol}>Obligation Name</div>
                                <div className={styles.valueColBold}>Mekanisme pelaporan, diagnosis, penetapan, pemberian manfaat program JKK dan penyelesaian atas perbedaan pendapat dalam menetapkan PAK karena Covid-19 dilaksanakan dengan mengacu pada ketentuan peraturan perundang undangan</div>
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.labelCol}>Sector</div>
                                <div className={styles.valueColBold}>Keselamatan dan Kesehatan Kerja</div>
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.labelCol}>Topic Level</div>
                                <div className={styles.valueColBold}>Keselamatan dan Kesehatan Kerja &gt; Pencegahan dan Penanggulangan Covid-19 di Tempat Kerja</div>
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.labelCol}>Obligation Type</div>
                                <div className={styles.valueColBold}>Continuous</div>
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.labelCol}>Obligation Penalty</div>
                                <div className={styles.valueColBold}>Tidak Ada Sanksi</div>
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.labelCol}>Priority</div>
                                <div className={styles.valueColBold}>
                                    {!isEditing ? formData.priority : (
                                        <div className={styles.actionWrapper}>
                                            <select
                                                className={styles.selectField}
                                                value={formData.priority}
                                                onChange={(e) => handleChange('priority', e.target.value)}
                                            >
                                                <option>High</option>
                                                <option>Medium</option>
                                                <option>Low</option>
                                            </select>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.labelCol}>Notes</div>
                                <div className={styles.valueColBold}>-</div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className={styles.formColumn}>
                            <div className={`${styles.formRow} ${highlightedSections.includes('info-progress') ? styles.highlight : ''}`}>
                                <div className={styles.labelCol}>Progress</div>
                                <div className={styles.valueColBold}>{isAudited ? 'Audited' : (isReadyToReview ? 'Ready to Review' : (isAssigned ? 'Assigned' : 'Enforced'))}</div>
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.labelCol}>Assignee Group</div>
                                <div className={styles.valueColBold}>
                                    {renderGroupSelect('assigneeGroup')}
                                </div>
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.labelCol}>Assignee</div>
                                <div className={styles.valueColBold}>
                                    {renderMultiSelect('assignee')}
                                </div>
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.labelCol}>Verifikator Group</div>
                                <div className={styles.valueColBold}>
                                    {renderGroupSelect('verifikatorGroup')}
                                </div>
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.labelCol}>Verifikator</div>
                                <div className={styles.valueColBold}>
                                    {renderMultiSelect('verifikator')}
                                </div>
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.labelCol}>Member</div>
                                <div className={styles.valueColBold}>
                                    {members.length} <span className={styles.linkText} onClick={() => isEditing && setIsMemberModalOpen(true)}>{!isEditing ? 'View Member' : 'Edit Member'}</span>
                                </div>
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.labelCol}>Due Date</div>
                                <div className={styles.valueColBold}>
                                    {!isEditing ? (formData.dueDate || '-') : (
                                        <div className={styles.clearableInputWrapper}>
                                            <input
                                                type="date"
                                                className={`${styles.inputField} ${!formData.dueDate ? styles.placeholderColor : ''}`}
                                                value={formData.dueDate}
                                                onChange={(e) => handleChange('dueDate', e.target.value)}
                                            />
                                            {formData.dueDate && (
                                                <X
                                                    size={14}
                                                    className={styles.dateClearIcon}
                                                    onClick={() => handleChange('dueDate', '')}
                                                />
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.labelCol}>Expired Date</div>
                                <div className={styles.valueColBold}>
                                    {!isEditing ? (formData.expiredDate || '-') : (
                                        <div className={styles.clearableInputWrapper}>
                                            <input
                                                type="date"
                                                className={`${styles.inputField} ${!formData.expiredDate ? styles.placeholderColor : ''}`}
                                                value={formData.expiredDate}
                                                onChange={(e) => handleChange('expiredDate', e.target.value)}
                                            />
                                            {formData.expiredDate && (
                                                <X
                                                    size={14}
                                                    className={styles.dateClearIcon}
                                                    onClick={() => handleChange('expiredDate', '')}
                                                />
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.labelCol}>Description</div>
                                <div className={styles.valueColBold}>
                                    {!isEditing ? (formData.description || '-') : (
                                        <textarea
                                            className={styles.textareaField}
                                            value={formData.description}
                                            onChange={(e) => handleChange('description', e.target.value)}
                                        ></textarea>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Main Split: Tabs & Collaboration */}
                <div className={styles.splitSection}>
                    {/* Left: Tabs */}
                    <div className={styles.tabsContainer}>
                        <div className={styles.tabHeader}>
                            <button
                                className={`${styles.tabBtn} ${activeTab === 'checklist' ? styles.activeTab : ''}`}
                                onClick={() => setActiveTab('checklist')}
                            >
                                Checklist and File
                            </button>
                            <button
                                className={`${styles.tabBtn} ${activeTab === 'regulation' ? styles.activeTab : ''}`}
                                onClick={() => setActiveTab('regulation')}
                            >
                                Regulation
                            </button>
                            <button
                                className={`${styles.tabBtn} ${activeTab === 'activity' ? styles.activeTab : ''}`}
                                onClick={() => setActiveTab('activity')}
                            >
                                Activity
                            </button>
                        </div>

                        <div className={styles.tabBodyCard}>
                            {activeTab === 'checklist' && (
                                <>
                                    {!isInactive && (
                                        <div className={styles.tabActions}>
                                            <button className={styles.btnTextPrimary}>Add New Checklist</button>
                                            <button className={styles.btnPrimary}>
                                                Attach <ChevronDown size={14} className="ml-1" />
                                            </button>
                                        </div>
                                    )}

                                    <div className={styles.blueAlertBox}>
                                        <Info size={20} />
                                        <span style={{ fontSize: '12px', fontWeight: 500 }}>This document below attached directly to compliance not belong to any checklist</span>
                                    </div>

                                    <div className={styles.progressSection}>
                                        <div className={styles.progressTrack}>
                                            <div className={styles.progressBar} style={{ width: '96%' }}></div>
                                        </div>
                                        <div className={styles.progressLabel}>96% Progress (24 of 25 checklists)</div>
                                    </div>

                                    {!isInactive && (
                                        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                                            <button
                                                className={styles.btnHeaderPrimary}
                                                style={{ height: '32px', fontSize: '13px', padding: '0 12px' }}
                                                onClick={() => {
                                                    logActivity('Claim all compliance checklists');
                                                    showToast('Success! All checklists claimed.', 'success');
                                                }}
                                            >
                                                Claim All
                                            </button>
                                            <button
                                                className={styles.btnGhost}
                                                style={{ border: '1px solid #cbd5e1', padding: '0 12px', height: '32px', fontSize: '13px' }}
                                                onClick={() => {
                                                    logActivity('Unclaim all compliance checklists');
                                                    showToast('Success! All checklists unclaimed.', 'success');
                                                }}
                                            >
                                                Unclaim All
                                            </button>
                                        </div>
                                    )}

                                    {/* Dummy Checklists */}
                                    <div className={styles.checklistContainer} style={{ display: 'flex', flexDirection: 'column', gap: '12px', pointerEvents: isInactive ? 'none' : 'auto' }}>
                                        {[
                                            "Memenuhi standar pelaksanaan kegiatan usaha pada saat melaksanakan kegiatan usaha.",
                                            "Memiliki NIB yang diterbitkan melalui Sistem OSS.",
                                            "Memenuhi persyaratan Izin sesuai dengan norma, standar, prosedur, dan kriteria sebelum melaksanakan kegiatan operasional dan/atau komersial."
                                        ].map((item, idx) => (
                                            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                                <div style={{
                                                    minWidth: '20px', height: '20px', borderRadius: '4px',
                                                    backgroundColor: isInactive ? '#cbd5e1' : '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2px'
                                                }}>
                                                    <CheckSquare size={16} color="white" />
                                                </div>
                                                <span style={{ fontSize: '14px', color: '#334155', lineHeight: '24px' }}>{idx + 1}. {item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {activeTab === 'regulation' && (
                                <div className={styles.emptyStateContainer}>
                                    <div className={styles.emptyIconCircle}>
                                        <AlertCircle size={48} color="#cbd5e1" />
                                    </div>
                                    <p className={styles.emptyText}>No Regulation Data</p>
                                </div>
                            )}

                            {activeTab === 'activity' && (
                                <div className={styles.activityList}>
                                    {activities.length > 0 ? (
                                        activities.map((activity, index) => (
                                            <div key={activity.id} className={`${styles.activityItem} ${index === 0 && highlightedSections.includes('activity') ? styles.highlight : ''}`}>
                                                <div className={styles.activityAvatar}>A</div>
                                                <div className={styles.activityContent}>
                                                    <div className={styles.activityText}>
                                                        <span className={styles.activityUser}>{activity.user}</span> {activity.action}
                                                    </div>
                                                    <div className={styles.activityTime}>{activity.timestamp}</div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className={styles.emptyStateContainer}>
                                            <div className={styles.emptyIconCircle}>
                                                <AlertCircle size={48} color="#cbd5e1" />
                                            </div>
                                            <p className={styles.emptyText}>No Activity Yet</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Collaboration */}
                    <div className={styles.collabContainer}>
                        <div className={styles.cardBox}>
                            <h3 className={styles.collabTitle}>Collaboration</h3>

                            <div className={styles.editorContainer}>
                                <div className={styles.editorToolbar}>
                                    {/* Mock Toolbar Icons */}
                                    {['B', 'I', 'U', 'Link'].map((i) => (
                                        <span key={i} className={styles.toolbarIcon}>{i}</span>
                                    ))}
                                </div>
                                <div className={styles.editorArea}>
                                    Type Comment Here
                                </div>
                            </div>

                            <div className={styles.collabActions}>
                                <button className={styles.btnText}>Clear</button>
                                <button className={styles.btnPrimary}>Send</button>
                            </div>
                        </div>
                    </div>

                </div>

                {/* --- Member Edit Modal --- */}
                {isMemberModalOpen && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent}>
                            <div className={styles.modalHeader}>
                                <h2>Edit Member</h2>
                                <button className={styles.btnClose} onClick={() => setIsMemberModalOpen(false)}><X /></button>
                            </div>

                            <div className={styles.modalBody}>
                                <div className={styles.inviteSection}>
                                    <label>Invite Member</label>
                                    <div className={styles.searchWrapper}>
                                        <input
                                            className={styles.inputField}
                                            placeholder="Search user"
                                            value={inviteSearch}
                                            onChange={(e) => setInviteSearch(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    addMember(inviteSearch);
                                                    setInviteSearch('');
                                                }
                                            }}
                                        />
                                    </div>
                                    {inviteSearch.trim() !== '' && (
                                        <div className={styles.suggestionList}>
                                            {/* Suggestions: Filter matches, exclude existing members */}
                                            {USERS
                                                .filter(u =>
                                                    u.toLowerCase().includes(inviteSearch.toLowerCase()) &&
                                                    !members.find(m => m.name === u)
                                                )
                                                .map(u => (
                                                    <div key={u} className={styles.suggestionItem} onClick={() => { addMember(u); setInviteSearch(''); }}>
                                                        <UserPlus size={14} /> {u}
                                                    </div>
                                                ))
                                            }
                                            {USERS.filter(u => u.toLowerCase().includes(inviteSearch.toLowerCase()) && !members.find(m => m.name === u)).length === 0 && (
                                                <div className={styles.suggestionItem} style={{ cursor: 'default', color: '#94a3b8' }}>No user found</div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className={styles.memberList}>
                                    {members.map(member => (
                                        <div key={member.id} className={styles.memberRow}>
                                            <div className={styles.memberInfo}>
                                                <select
                                                    className={styles.roleSelect}
                                                    value={member.role}
                                                    onChange={(e) => updateMemberRole(member.id, e.target.value)}
                                                >
                                                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                                                </select>
                                                <span className={styles.memberName}>{member.name} (User)</span>
                                            </div>
                                            <div className={styles.memberActions}>
                                                <span className={styles.activeStatus}>Active</span>
                                                <button className={styles.btnRemove} onClick={() => removeMember(member.id)}>
                                                    <X size={14} color="white" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {members.length === 0 && <p className={styles.emptyText}>No members added.</p>}
                                </div>
                            </div>

                            <div className={styles.modalFooter}>
                                <button className={styles.btnBack} onClick={() => setIsMemberModalOpen(false)}>Back</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Claim Confirmation Modal */}
            {isClaimModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContentConfirm}>
                        <p className={styles.modalTitleConfirm}>Claim Compliance</p>
                        <p className={styles.modalText}>Are you sure want to claim this compliance?</p>
                        <div className={styles.obligationBox}>
                            Mekanisme pelaporan, diagnosis, penetapan, pemberian manfaat program JKK dan penyelesaian atas perbedaan pendapat dalam menetapkan PAK karena Covid-19 dilaksanakan dengan mengacu pada ketentuan peraturan perundang undangan
                        </div>
                        <div className={styles.modalActionsRight}>
                            <button className={styles.btnGhost} onClick={() => setIsClaimModalOpen(false)}>Cancel</button>
                            <button className={styles.btnPrimary} onClick={confirmClaim}>Yes, Claim</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Approval Confirmation Modal */}
            {isApprovalModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContentConfirm}>
                        <p className={styles.modalTitleConfirm}>Approve Compliance</p>
                        <p className={styles.modalText}>Are you sure want to approve this compliance?</p>

                        <div className={styles.obligationBox}>
                            Mekanisme pelaporan, diagnosis, penetapan, pemberian manfaat program JKK dan penyelesaian atas perbedaan pendapat dalam menetapkan PAK karena Covid-19 dilaksanakan dengan mengacu pada ketentuan peraturan perundang undangan
                        </div>

                        <div className={styles.modalActionsRight}>
                            <button className={styles.btnGhost} onClick={() => setIsApprovalModalOpen(false)}>Cancel</button>
                            <button className={styles.btnGhostDanger} onClick={confirmReject}>Reject</button>
                            <button className={styles.btnPrimary} onClick={confirmApprove}>Yes, Approve</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reopen Confirmation Modal */}
            {isReopenModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContentConfirm}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <RotateCcw size={24} color="#0f172a" />
                            <p className={styles.modalTitleConfirm} style={{ marginBottom: 0 }}>Reopen Compliance</p>
                        </div>
                        <p className={styles.modalText}>Are you sure to reopen this compliance? Progress will be back to Assigned.</p>

                        <div className={styles.obligationBox}>
                            Mekanisme pelaporan, diagnosis, penetapan, pemberian manfaat program JKK dan penyelesaian atas perbedaan pendapat dalam menetapkan PAK karena Covid-19 dilaksanakan dengan mengacu pada ketentuan peraturan perundang undangan
                        </div>

                        <div className={styles.modalActionsRight}>
                            <button className={styles.btnGhost} onClick={() => setIsReopenModalOpen(false)}>Cancel</button>
                            <button id="btn-modal-confirm" className={styles.btnPrimary} onClick={confirmReopen}>Yes, Reopen</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Pointer Overlay */}
            <div
                className={`${styles.pointer} ${pointer.click ? styles.click : ''}`}
                style={{
                    left: pointer.x,
                    top: pointer.y,
                    opacity: pointer.visible ? 1 : 0
                }}
            />

            {/* Automation Banner */}
            {automationMessage && (
                <div className={styles.automationBanner}>
                    <Play size={24} fill="#0ea5e9" />
                    {automationMessage}
                </div>
            )}

            {/* Inactivate Confirmation Modal */}
            {isInactivateModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContentConfirm}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <AlertCircle size={24} color="#ef4444" />
                            <p className={styles.modalTitleConfirm} style={{ marginBottom: 0 }}>Confirmation</p>
                        </div>
                        <p className={styles.modalText}>Are you sure want to inactivate 1 obligation?</p>

                        <div className={styles.obligationBox}>
                            Inactivate this obligation would reset all information of this obligation, including : <strong>Assignee, Verificator, Member, Checklists, Due Date, etc.</strong>
                        </div>

                        <div className={styles.modalActionsRight}>
                            <button className={styles.btnGhost} onClick={() => setIsInactivateModalOpen(false)}>Cancel</button>
                            <button className={styles.btnPrimary} onClick={confirmInactivate}>Yes, Sure</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// NOTE: I am not using InfoRow helper anymore because I want to match the HTML structure more rigidly as per the user request.

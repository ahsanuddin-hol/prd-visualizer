import { LucideIcon, FolderKanban } from 'lucide-react';

export interface Epic {
    id: string;
    title: string;
    description: string;
    code?: string;
    priority?: string;
    priorityLabel?: string;
    href: string;
    icon: any; // Using any for simplicity with Lucide icons in data file
}

export const EPICS: Epic[] = [
    {
        id: 'reopen-compliance',
        title: 'Reopen Compliance',
        description: 'Re-assign obligation in compliance monitor from a complied obligation',
        href: '/epic/reopen-compliance',
        icon: FolderKanban
    }
];

export const STORIES: any[] = [];

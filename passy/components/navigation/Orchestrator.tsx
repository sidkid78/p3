'use client';

import React from 'react';
import { Page } from '@/types/navigation';
import { useNavigation } from '@/lib/navigation';

import DashboardView from '@/components/views/DashboardView';
import ThemeAssistant from '@/components/planning/ThemeAssistant';
import GuestManager from '@/components/views/GuestManager';
import BudgetTracker from '@/components/views/BudgetTracker';
import TaskManager from '@/components/views/TaskManager';

interface Guest {
    id: string;
    name: string;
    rsvp: 'confirmed' | 'pending' | 'declined';
    email: string;
    diet: string;
}

interface BudgetItem {
    id: string;
    category: string;
    amount: number;
    spent: number;
    status: 'paid' | 'partial' | 'pending';
}

interface Task {
    title: string;
    dueDate: string;
    category: string;
    status: 'pending' | 'completed';
}

interface DashboardData {
    user: { name: string };
    event: {
        daysToGo: number;
        date: string;
        progress: number;
        guestCount: number;
        guestLimit: number;
        budgetSpent: number;
        budgetLimit: number;
        status: Record<string, string>;
    };
    tasks: Task[];
    guests: Guest[];
    budgetItems: BudgetItem[];
}

const Orchestrator = ({ dashboardData }: { dashboardData: DashboardData }) => {
    const { page } = useNavigation();

    const renderView = () => {
        switch (page) {
            case Page.Dashboard:
                return <DashboardView data={dashboardData} />;
            case Page.ThemeAssistant:
                return <ThemeAssistant />;
            case Page.Guests:
                return <GuestManager data={dashboardData.guests} />;
            case Page.Budget:
                return (
                    <BudgetTracker
                        data={dashboardData.budgetItems}
                        limit={dashboardData.event.budgetLimit}
                        spent={dashboardData.event.budgetSpent}
                    />
                );
            case Page.Tasks:
                return <TaskManager initialTasks={dashboardData.tasks} />;
            default:
                return (
                    <div className="text-white text-center py-20">
                        <h2 className="text-2xl font-bold">Module: {page}</h2>
                        <p className="text-gray-400">This module is under construction.</p>
                    </div>
                );
        }
    };

    return (
        <div className="relative w-full h-full min-h-[600px] transition-all duration-500 ease-in-out">
            {renderView()}
        </div>
    );
};

export default Orchestrator;

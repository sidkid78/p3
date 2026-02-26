'use client';

import React from 'react';
import { Page } from '@/types/navigation';
import { useNavigation } from '@/lib/navigation';
import type { DashboardData } from '@/types/dashboard';

import DashboardView from '@/components/views/DashboardView';
import ThemeAssistant from '@/components/planning/ThemeAssistant';
import GuestManager from '@/components/views/GuestManager';
import BudgetView from '@/components/views/BudgetView';
import TaskManager from '@/components/views/TaskManager';
import VendorMarketplace from '@/components/views/VendorMarketplace';
import GamePlannerView from '@/components/views/GamePlannerView';
import DigitalInvitation from '@/components/views/DigitalInvitation';
import GiftRegistryManager from '@/components/views/GiftRegistryManager';
import InvitationEditor from '@/components/views/InvitationEditor';
import InvitationPasswordGate from '@/components/views/InvitationPasswordGate';
import AIThankYouHelper from '@/components/views/AIThankYouHelper';

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
                    <BudgetView
                        data={dashboardData.budgetItems}
                        limit={dashboardData.event.budgetLimit}
                        spent={dashboardData.event.budgetSpent}
                    />
                );
            case Page.Tasks:
                return <TaskManager initialTasks={dashboardData.tasks} />;
            case Page.Vendors:
                return <VendorMarketplace />;
            case Page.GamePlanner:
                return <GamePlannerView />;
            case Page.Invitation:
                return <DigitalInvitation />;
            case Page.GiftRegistry:
                return <GiftRegistryManager />;
            case Page.InvitationEditor:
                return <InvitationEditor />;
            case Page.InvitationPasswordGate:
                return <InvitationPasswordGate />;
            case Page.AIThankYouHelper:
                return <AIThankYouHelper />;

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

export interface Guest {
    id: string;
    name: string;
    rsvp: 'confirmed' | 'pending' | 'declined';
    email: string;
    diet: string;
}

export interface BudgetItem {
    id: string;
    category: string;
    amount: number;
    spent: number;
    status: 'paid' | 'partial' | 'pending';
}

export interface Task {
    title: string;
    dueDate: string;
    category: string;
    status: 'pending' | 'completed';
}

export interface DashboardData {
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

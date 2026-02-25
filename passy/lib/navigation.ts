import { useState, useEffect } from 'react';
import { Page } from '@/types/navigation';

// Simple bus for navigation events
const listeners = new Set<(page: Page) => void>();

let currentPage: Page = Page.Dashboard;

export const navigation = {
    get current() {
        return currentPage;
    },
    navigate(page: Page) {
        currentPage = page;
        listeners.forEach(l => l(page));
    },
    subscribe(listener: (page: Page) => void) {
        listeners.add(listener);
        return () => listeners.delete(listener);
    }
};

export function useNavigation() {
    const [page, setPage] = useState<Page>(currentPage);

    useEffect(() => {
        return navigation.subscribe(setPage);
    }, []);

    return {
        page,
        navigate: navigation.navigate
    };
}

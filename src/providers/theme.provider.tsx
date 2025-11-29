"use client";

import { useEffect, ReactNode } from 'react';
import { useThemeStore } from '@/store/theme.store';

interface ThemeProviderProps {
    children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const currentTheme = useThemeStore((state) => state.currentTheme);

    useEffect(() => {
        // Apply theme on mount and whenever it changes
        if (currentTheme) {
            document.documentElement.style.setProperty('--sidebar-bg', currentTheme.sidebarBg);
            document.documentElement.style.setProperty('--content-bg', currentTheme.contentBg);
        }
    }, [currentTheme]);

    return <>{children}</>;
}

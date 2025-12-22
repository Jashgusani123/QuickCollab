"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useThemeStore } from '@/store/theme.store';
import { THEME_PRESETS, Theme } from '@/lib/theme-types';
import { ThemePresetCard } from './theme-preset-card';

interface ThemeSettingsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ThemeSettingsDialog({ open, onOpenChange }: ThemeSettingsDialogProps) {
    const currentTheme = useThemeStore((state) => state.currentTheme);
    const setTheme = useThemeStore((state) => state.setTheme);

    const handlePresetSelect = (theme: Theme) => {
        setTheme(theme);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Theme Settings</DialogTitle>
                    <DialogDescription>
                        Choose from 10 professional themes for your workspace
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Theme Presets Grid */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Available Themes</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-[#131313]">
                            {THEME_PRESETS.map((theme) => (
                                <ThemePresetCard
                                    key={theme.name}
                                    theme={theme}
                                    isSelected={currentTheme.name === theme.name}
                                    onClick={() => handlePresetSelect(theme)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

"use client";

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useThemeStore } from '@/store/theme.store';
import { THEME_PRESETS, Theme } from '@/lib/theme-types';
import { ThemePresetCard } from './theme-preset-card';
import { CustomColorPicker } from './custom-color-picker';
import { Palette } from 'lucide-react';

interface ThemeSettingsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ThemeSettingsDialog({ open, onOpenChange }: ThemeSettingsDialogProps) {
    const currentTheme = useThemeStore((state) => state.currentTheme);
    const setTheme = useThemeStore((state) => state.setTheme);
    const [showCustomPicker, setShowCustomPicker] = useState(false);

    const handlePresetSelect = (theme: Theme) => {
        setTheme(theme);
        setShowCustomPicker(false);
    };

    const handleCustomClick = () => {
        setShowCustomPicker(true);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Theme Settings</DialogTitle>
                    <DialogDescription>
                        Choose a preset theme or create your own custom color scheme
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {!showCustomPicker ? (
                        <>
                            {/* Theme Presets Grid */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Preset Themes</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {THEME_PRESETS.map((theme) => (
                                        <ThemePresetCard
                                            key={theme.name}
                                            theme={theme}
                                            isSelected={
                                                currentTheme.name === theme.name &&
                                                !currentTheme.isCustom
                                            }
                                            onClick={() => handlePresetSelect(theme)}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Custom Theme Button */}
                            <div className="pt-4 border-t">
                                <Button
                                    onClick={handleCustomClick}
                                    variant="outline"
                                    className="w-full h-20 text-lg font-semibold border-2 border-dashed hover:border-purple-500 hover:bg-purple-50 transition-all"
                                >
                                    <Palette className="w-6 h-6 mr-2" />
                                    Create Custom Theme
                                </Button>

                                {/* Show Custom Theme Card if Active */}
                                {currentTheme.isCustom && (
                                    <div className="mt-4">
                                        <h3 className="text-sm font-semibold mb-2 text-gray-600">
                                            Your Custom Theme
                                        </h3>
                                        <ThemePresetCard
                                            theme={currentTheme}
                                            isSelected={true}
                                            onClick={handleCustomClick}
                                        />
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Custom Color Picker */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold">Custom Color Picker</h3>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowCustomPicker(false)}
                                    >
                                        ← Back to Presets
                                    </Button>
                                </div>
                                <CustomColorPicker onClose={() => setShowCustomPicker(false)} />
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

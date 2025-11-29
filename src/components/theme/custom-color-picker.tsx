"use client";

import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Button } from '@/components/ui/button';
import { useThemeStore } from '@/store/theme.store';
import { Check } from 'lucide-react';

interface CustomColorPickerProps {
    onClose: () => void;
}

export function CustomColorPicker({ onClose }: CustomColorPickerProps) {
    const currentTheme = useThemeStore((state) => state.currentTheme);
    const setCustomTheme = useThemeStore((state) => state.setCustomTheme);

    const [sidebarColor, setSidebarColor] = useState(
        currentTheme.isCustom ? currentTheme.sidebarBg : '#1A1A1A'
    );
    const [contentColor, setContentColor] = useState(
        currentTheme.isCustom ? currentTheme.contentBg : '#FFFFFF'
    );

    const handleSave = () => {
        setCustomTheme(sidebarColor, contentColor);
        onClose();
    };

    return (
        <div className="space-y-6">
            {/* Live Preview */}
            <div className="rounded-lg overflow-hidden border-2 border-gray-200">
                <div className="flex h-32">
                    {/* Sidebar Preview */}
                    <div
                        className="w-1/3 flex items-center justify-center transition-colors duration-200"
                        style={{ backgroundColor: sidebarColor }}
                    >
                        <div className="w-12 h-12 rounded-md bg-white/10 backdrop-blur-sm" />
                    </div>

                    {/* Content Preview */}
                    <div
                        className="w-2/3 flex flex-col gap-3 p-4 items-start transition-colors duration-200"
                        style={{ backgroundColor: contentColor }}
                    >
                        <div className="w-full h-3 rounded-full bg-gray-300" />
                        <div className="w-3/4 h-3 rounded-full bg-gray-200" />
                        <div className="w-1/2 h-3 rounded-full bg-gray-200" />
                    </div>
                </div>
            </div>

            {/* Color Pickers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sidebar Color Picker */}
                <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700">
                        Sidebar Background
                    </label>
                    <HexColorPicker color={sidebarColor} onChange={setSidebarColor} />
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={sidebarColor}
                            onChange={(e) => setSidebarColor(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
                            placeholder="#000000"
                        />
                        <div
                            className="w-10 h-10 rounded-md border-2 border-gray-300"
                            style={{ backgroundColor: sidebarColor }}
                        />
                    </div>
                </div>

                {/* Content Color Picker */}
                <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700">
                        Content Background
                    </label>
                    <HexColorPicker color={contentColor} onChange={setContentColor} />
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={contentColor}
                            onChange={(e) => setContentColor(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
                            placeholder="#FFFFFF"
                        />
                        <div
                            className="w-10 h-10 rounded-md border-2 border-gray-300"
                            style={{ backgroundColor: contentColor }}
                        />
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-4 border-t">
                <Button variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
                    <Check className="w-4 h-4 mr-2" />
                    Save Custom Theme
                </Button>
            </div>
        </div>
    );
}

"use client";

import { Theme } from '@/lib/theme-types';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface ThemePresetCardProps {
    theme: Theme;
    isSelected: boolean;
    onClick: () => void;
}

export function ThemePresetCard({ theme, isSelected, onClick }: ThemePresetCardProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "relative w-full rounded-lg overflow-hidden transition-all duration-200",
                "hover:scale-105 hover:shadow-lg",
                isSelected && "ring-4 ring-purple-500 ring-offset-2 scale-105"
            )}
        >
            {/* Theme Preview */}
            <div className="flex h-24 w-full">
                {/* Sidebar Preview */}
                <div
                    className="w-1/3 flex items-center justify-center"
                    style={{ backgroundColor: theme.sidebarBg }}
                >
                    <div className="w-8 h-8 rounded-md bg-white/10 backdrop-blur-sm" />
                </div>

                {/* Content Preview */}
                <div
                    className="w-2/3 flex flex-col gap-2 p-3 items-start"
                    style={{ backgroundColor: theme.contentBg }}
                >
                    <div className="w-full h-2 rounded-full bg-gray-300" />
                    <div className="w-3/4 h-2 rounded-full bg-gray-200" />
                    <div className="w-1/2 h-2 rounded-full bg-gray-200" />
                </div>
            </div>

            {/* Selected Check Mark */}
            {isSelected && (
                <div className="absolute top-2 right-2 bg-purple-500 rounded-full p-1">
                    <Check className="w-4 h-4 text-white" />
                </div>
            )}

            {/* Theme Name */}
            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className="text-white text-xs font-semibold">{theme.name}</span>
            </div>
        </button>
    );
}

/**
 * Professional Theme Engine
 * Generates complete color system from two base colors
 */

import { Theme } from './theme-types';

// ========================================
// COLOR CONVERSION UTILITIES
// ========================================

export interface RGB {
    r: number;
    g: number;
    b: number;
}

export interface HSL {
    h: number;
    s: number;
    l: number;
}

/**
 * Convert hex to RGB
 */
export function hexToRgb(hex: string): RGB {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) {
        console.warn(`Invalid hex color: ${hex}`);
        return { r: 0, g: 0, b: 0 };
    }
    return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
    };
}

/**
 * Convert RGB to hex
 */
export function rgbToHex(rgb: RGB): string {
    const toHex = (n: number) => {
        const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
        return hex.padStart(2, '0');
    };
    return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

/**
 * Convert RGB to HSL
 */
export function rgbToHsl(rgb: RGB): HSL {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (delta !== 0) {
        s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

        switch (max) {
            case r:
                h = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
                break;
            case g:
                h = ((b - r) / delta + 2) / 6;
                break;
            case b:
                h = ((r - g) / delta + 4) / 6;
                break;
        }
    }

    return {
        h: h * 360,
        s: s * 100,
        l: l * 100,
    };
}

/**
 * Convert HSL to RGB
 */
export function hslToRgb(hsl: HSL): RGB {
    const h = hsl.h / 360;
    const s = hsl.s / 100;
    const l = hsl.l / 100;

    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
        r: r * 255,
        g: g * 255,
        b: b * 255,
    };
}

// ========================================
// LUMINANCE & CONTRAST CALCULATION
// ========================================

/**
 * Calculate relative luminance (WCAG 2.0)
 * https://www.w3.org/TR/WCAG20/#relativeluminancedef
 */
export function getLuminance(hex: string): number {
    const rgb = hexToRgb(hex);

    const adjust = (channel: number) => {
        const c = channel / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };

    const r = adjust(rgb.r);
    const g = adjust(rgb.g);
    const b = adjust(rgb.b);

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Determine if color is dark (luminance < 0.5)
 */
export function isDark(hex: string): boolean {
    return getLuminance(hex) < 0.5;
}

/**
 * Get contrast ratio between two colors
 */
export function getContrastRatio(hex1: string, hex2: string): number {
    const lum1 = getLuminance(hex1);
    const lum2 = getLuminance(hex2);
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Get high-contrast text color for a background
 * Returns black or white based on WCAG AAA standard (7:1 ratio)
 */
export function getContrastText(bgHex: string): string {
    const luminance = getLuminance(bgHex);
    // Use threshold of 0.5 for maximum contrast
    return luminance > 0.5 ? '#1A1A1A' : '#FFFFFF';
}

/**
 * Get muted (secondary) text color
 */
export function getMutedText(bgHex: string): string {
    const luminance = getLuminance(bgHex);
    // Return gray that still maintains 4.5:1 contrast (WCAG AA)
    return luminance > 0.5 ? '#525252' : '#D4D4D4';
}

// ========================================
// COLOR MANIPULATION
// ========================================

/**
 * Lighten a color by adjusting HSL lightness
 * @param hex - Base color
 * @param amount - Percentage to lighten (0-100)
 */
export function lighten(hex: string, amount: number): string {
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb);

    // Increase lightness, capped at 100
    hsl.l = Math.min(100, hsl.l + amount);

    const newRgb = hslToRgb(hsl);
    return rgbToHex(newRgb);
}

/**
 * Darken a color by adjusting HSL lightness
 * @param hex - Base color
 * @param amount - Percentage to darken (0-100)
 */
export function darken(hex: string, amount: number): string {
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb);

    // Decrease lightness, floored at 0
    hsl.l = Math.max(0, hsl.l - amount);

    const newRgb = hslToRgb(hsl);
    return rgbToHex(newRgb);
}

/**
 * Adjust color opacity (returns rgba)
 */
export function withOpacity(hex: string, opacity: number): string {
    const rgb = hexToRgb(hex);
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
}

/**
 * Mix two colors
 */
export function mix(hex1: string, hex2: string, weight: number = 0.5): string {
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);

    const mixed: RGB = {
        r: rgb1.r * (1 - weight) + rgb2.r * weight,
        g: rgb1.g * (1 - weight) + rgb2.g * weight,
        b: rgb1.b * (1 - weight) + rgb2.b * weight,
    };

    return rgbToHex(mixed);
}

// ========================================
// SURFACE ELEVATION SYSTEM
// ========================================

export interface SurfacePalette {
    surface0: string; // Base
    surface1: string; // Subtle cards
    surface2: string; // Elevated panels
    surface3: string; // Highest (tooltips)
}

/**
 * Generate surface elevation colors
 */
export function generateSurfaces(baseHex: string): SurfacePalette {
    const dark = isDark(baseHex);

    if (dark) {
        // For dark backgrounds: lighten for elevation
        return {
            surface0: baseHex,
            surface1: lighten(baseHex, 5),
            surface2: lighten(baseHex, 10),
            surface3: lighten(baseHex, 15),
        };
    } else {
        // For light backgrounds: darken for elevation
        return {
            surface0: baseHex,
            surface1: darken(baseHex, 3),
            surface2: darken(baseHex, 6),
            surface3: darken(baseHex, 9),
        };
    }
}

// ========================================
// INTERACTIVE STATES
// ========================================

export interface InteractivePalette {
    hover: string;
    active: string;
    focus: string;
}

/**
 * Generate interactive state colors
 */
export function generateInteractive(baseHex: string): InteractivePalette {
    const dark = isDark(baseHex);

    if (dark) {
        return {
            hover: lighten(baseHex, 8),
            active: lighten(baseHex, 12),
            focus: lighten(baseHex, 15),
        };
    } else {
        return {
            hover: darken(baseHex, 5),
            active: darken(baseHex, 10),
            focus: darken(baseHex, 12),
        };
    }
}

// ========================================
// BORDER COLORS
// ========================================

export interface BorderPalette {
    border: string;
    borderStrong: string;
}

/**
 * Generate border colors with proper contrast
 */
export function generateBorders(baseHex: string): BorderPalette {
    const dark = isDark(baseHex);

    if (dark) {
        return {
            border: lighten(baseHex, 15),
            borderStrong: lighten(baseHex, 25),
        };
    } else {
        return {
            border: darken(baseHex, 12),
            borderStrong: darken(baseHex, 20),
        };
    }
}

// ========================================
// INPUT FIELD COLORS
// ========================================

export interface InputPalette {
    background: string;
    foreground: string;
    border: string;
    borderFocus: string;
    placeholder: string;
}

/**
 * Generate input field colors
 */
export function generateInputs(baseHex: string): InputPalette {
    const dark = isDark(baseHex);

    if (dark) {
        const bg = lighten(baseHex, 10);
        return {
            background: bg,
            foreground: getContrastText(bg),
            border: lighten(baseHex, 20),
            borderFocus: lighten(baseHex, 35),
            placeholder: getMutedText(bg),
        };
    } else {
        const bg = darken(baseHex, 2);
        return {
            background: bg,
            foreground: getContrastText(bg),
            border: darken(baseHex, 15),
            borderFocus: darken(baseHex, 30),
            placeholder: getMutedText(bg),
        };
    }
}

// ========================================
// COMPLETE THEME PALETTE GENERATOR
// ========================================

export interface CompletePalette {
    // Base
    base: string;
    baseFg: string;
    baseFgMuted: string;

    // Surfaces
    surfaces: SurfacePalette;

    // Interactive
    interactive: InteractivePalette;

    // Borders
    borders: BorderPalette;

    // Inputs
    inputs: InputPalette;
}

/**
 * Generate complete color palette from a single base color
 */
export function generatePalette(baseHex: string): CompletePalette {
    return {
        base: baseHex,
        baseFg: getContrastText(baseHex),
        baseFgMuted: getMutedText(baseHex),

        surfaces: generateSurfaces(baseHex),
        interactive: generateInteractive(baseHex),
        borders: generateBorders(baseHex),
        inputs: generateInputs(baseHex),
    };
}

/**
 * Generate complete theme from user-selected colors
 */
export function generateThemePalettes(theme: Theme) {
    return {
        sidebar: generatePalette(theme.sidebarBg),
        content: generatePalette(theme.contentBg),
    };
}

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Theme, THEME_PRESETS } from '@/lib/theme-types';
import { generateCompleteTheme } from '@/lib/theme-engine-v2';

interface ThemeState {
    currentTheme: Theme;
    setTheme: (theme: Theme) => void;
    resetToDefault: () => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            currentTheme: THEME_PRESETS[0],

            setTheme: (theme: Theme) => {
                set({ currentTheme: theme });
                applyThemeToDOM(theme);
            },

            resetToDefault: () => {
                const defaultTheme = THEME_PRESETS[0];
                set({ currentTheme: defaultTheme });
                applyThemeToDOM(defaultTheme);
            },
        }),
        {
            name: 'quickcollab-theme-storage',
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => (state) => {
                if (state?.currentTheme) {
                    applyThemeToDOM(state.currentTheme);
                }
            },
        }
    )
);

// ================================================================
// COMPLETE THEME APPLICATION (80+ CSS VARIABLES)
// ================================================================

function applyThemeToDOM(theme: Theme) {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const palette = generateCompleteTheme(theme);

    // ==================== SIDEBAR ====================
    root.style.setProperty('--sidebar-bg', palette.sidebar.bg);
    root.style.setProperty('--sidebar-surface-1', palette.sidebar.surface1);
    root.style.setProperty('--sidebar-surface-2', palette.sidebar.surface2);
    root.style.setProperty('--sidebar-surface-3', palette.sidebar.surface3);
    root.style.setProperty('--sidebar-hover', palette.sidebar.hover);
    root.style.setProperty('--sidebar-active', palette.sidebar.active);
    root.style.setProperty('--sidebar-focus', palette.sidebar.focus);
    root.style.setProperty('--sidebar-text', palette.sidebar.text);
    root.style.setProperty('--sidebar-text-muted', palette.sidebar.textMuted);
    root.style.setProperty('--sidebar-text-subtle', palette.sidebar.textSubtle);
    root.style.setProperty('--sidebar-icon', palette.sidebar.icon);
    root.style.setProperty('--sidebar-icon-muted', palette.sidebar.iconMuted);
    root.style.setProperty('--sidebar-icon-active', palette.sidebar.iconActive);
    root.style.setProperty('--sidebar-search-bg', palette.sidebar.searchBg);
    root.style.setProperty('--sidebar-search-border', palette.sidebar.searchBorder);
    root.style.setProperty('--sidebar-search-border-focus', palette.sidebar.searchBorderFocus);
    root.style.setProperty('--sidebar-search-text', palette.sidebar.searchText);
    root.style.setProperty('--sidebar-search-placeholder', palette.sidebar.searchPlaceholder);
    root.style.setProperty('--sidebar-border', palette.sidebar.border);
    root.style.setProperty('--sidebar-border-strong', palette.sidebar.borderStrong);
    root.style.setProperty('--sidebar-divider', palette.sidebar.divider);

    // ==================== NAVBAR ====================
    root.style.setProperty('--navbar-bg', palette.navbar.bg);
    root.style.setProperty('--navbar-text', palette.navbar.text);
    root.style.setProperty('--navbar-text-muted', palette.navbar.textMuted);
    root.style.setProperty('--navbar-icon', palette.navbar.icon);
    root.style.setProperty('--navbar-icon-hover', palette.navbar.iconHover);
    root.style.setProperty('--navbar-search-bg', palette.navbar.searchBg);
    root.style.setProperty('--navbar-search-border', palette.navbar.searchBorder);
    root.style.setProperty('--navbar-search-text', palette.navbar.searchText);
    root.style.setProperty('--navbar-search-placeholder', palette.navbar.searchPlaceholder);
    root.style.setProperty('--navbar-search-focus', palette.navbar.searchFocus);

    // ==================== CONTENT ====================
    root.style.setProperty('--content-bg', palette.content.bg);
    root.style.setProperty('--content-surface-1', palette.content.surface1);
    root.style.setProperty('--content-surface-2', palette.content.surface2);
    root.style.setProperty('--content-surface-3', palette.content.surface3);
    root.style.setProperty('--content-hover', palette.content.hover);
    root.style.setProperty('--content-active', palette.content.active);
    root.style.setProperty('--content-focus', palette.content.focus);
    root.style.setProperty('--content-text', palette.content.text);
    root.style.setProperty('--content-text-muted', palette.content.textMuted);
    root.style.setProperty('--content-text-subtle', palette.content.textSubtle);
    root.style.setProperty('--content-heading', palette.content.heading);
    root.style.setProperty('--content-link', palette.content.link);
    root.style.setProperty('--content-link-hover', palette.content.linkHover);
    root.style.setProperty('--content-border', palette.content.border);
    root.style.setProperty('--content-border-strong', palette.content.borderStrong);
    root.style.setProperty('--content-divider', palette.content.divider);
    root.style.setProperty('--content-card-bg', palette.content.cardBg);
    root.style.setProperty('--content-card-border', palette.content.cardBorder);
    root.style.setProperty('--content-card-hover', palette.content.cardHover);

    // ==================== MESSAGES ====================
    root.style.setProperty('--message-bubble-bg', palette.message.bubbleBg);
    root.style.setProperty('--message-bubble-hover', palette.message.bubbleHover);
    root.style.setProperty('--message-bubble-border', palette.message.bubbleBorder);
    root.style.setProperty('--message-thread-bg', palette.message.threadBg);
    root.style.setProperty('--message-thread-border', palette.message.threadBorder);
    root.style.setProperty('--message-author-text', palette.message.authorText);
    root.style.setProperty('--message-body-text', palette.message.bodyText);
    root.style.setProperty('--message-timestamp-text', palette.message.timestampText);
    root.style.setProperty('--message-reaction-bg', palette.message.reactionBg);
    root.style.setProperty('--message-reaction-border', palette.message.reactionBorder);
    root.style.setProperty('--message-reaction-hover', palette.message.reactionHover);
    root.style.setProperty('--message-reaction-active', palette.message.reactionActive);
    root.style.setProperty('--message-reaction-text', palette.message.reactionText);

    // ==================== EDITOR (QUILL) ====================
    root.style.setProperty('--editor-bg', palette.editor.bg);
    root.style.setProperty('--editor-border', palette.editor.border);
    root.style.setProperty('--editor-border-focus', palette.editor.borderFocus);
    root.style.setProperty('--editor-text', palette.editor.text);
    root.style.setProperty('--editor-placeholder', palette.editor.placeholder);
    root.style.setProperty('--editor-toolbar-bg', palette.editor.toolbarBg);
    root.style.setProperty('--editor-toolbar-border', palette.editor.toolbarBorder);
    root.style.setProperty('--editor-toolbar-icon', palette.editor.toolbarIcon);
    root.style.setProperty('--editor-toolbar-icon-hover', palette.editor.toolbarIconHover);
    root.style.setProperty('--editor-toolbar-icon-active', palette.editor.toolbarIconActive);
    root.style.setProperty('--editor-toolbar-divider', palette.editor.toolbarDivider);

    // ==================== STATES ====================
    root.style.setProperty('--state-success', palette.states.success);
    root.style.setProperty('--state-success-bg', palette.states.successBg);
    root.style.setProperty('--state-error', palette.states.error);
    root.style.setProperty('--state-error-bg', palette.states.errorBg);
    root.style.setProperty('--state-warning', palette.states.warning);
    root.style.setProperty('--state-warning-bg', palette.states.warningBg);
    root.style.setProperty('--state-info', palette.states.info);
    root.style.setProperty('--state-info-bg', palette.states.infoBg);

    // ==================== LEGACY COMPATIBILITY ====================
    root.style.setProperty('--sidebar-fg', palette.sidebar.text);
    root.style.setProperty('--sidebar-fg-muted', palette.sidebar.textMuted);
    root.style.setProperty('--content-fg', palette.content.text);
    root.style.setProperty('--content-fg-muted', palette.content.textMuted);

    // ==================== SHADCN/TAILWIND INTEGRATION ====================
    root.style.setProperty('--background', palette.content.bg);
    root.style.setProperty('--foreground', palette.content.text);
    root.style.setProperty('--card', palette.content.cardBg);
    root.style.setProperty('--card-foreground', palette.content.text);
    root.style.setProperty('--popover', palette.content.surface2);
    root.style.setProperty('--popover-foreground', palette.content.text);
    root.style.setProperty('--muted', palette.content.surface1);
    root.style.setProperty('--muted-foreground', palette.content.textMuted);
    root.style.setProperty('--accent', palette.content.hover);
    root.style.setProperty('--accent-foreground', palette.content.text);
    root.style.setProperty('--border', palette.content.border);
    root.style.setProperty('--input', palette.content.border);
    root.style.setProperty('--ring', palette.content.borderStrong);

    // Sidebar Shadcn
    root.style.setProperty('--sidebar', palette.sidebar.bg);
    root.style.setProperty('--sidebar-foreground', palette.sidebar.text);
    root.style.setProperty('--sidebar-primary', palette.sidebar.active);
    root.style.setProperty('--sidebar-primary-foreground', palette.sidebar.text);
    root.style.setProperty('--sidebar-accent', palette.sidebar.hover);
    root.style.setProperty('--sidebar-accent-foreground', palette.sidebar.text);
    root.style.setProperty('--sidebar-border', palette.sidebar.border);
    root.style.setProperty('--sidebar-ring', palette.sidebar.borderStrong);
}

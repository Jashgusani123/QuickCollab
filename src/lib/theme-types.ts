export interface Theme {
    sidebarBg: string;
    contentBg: string;
    name: string;
    isCustom?: boolean;
}

export const THEME_PRESETS: Theme[] = [
    {
        name: "Default",
        sidebarBg: "#1A1A1A",
        contentBg: "#FFFFFF",
    },
    {
        name: "Violet",
        sidebarBg: "#2D0A31",
        contentBg: "#F8F1FB",
    },
    {
        name: "Forest",
        sidebarBg: "#0D2410",
        contentBg: "#F1FFF3",
    },
    {
        name: "Ocean",
        sidebarBg: "#05293D",
        contentBg: "#EAFBFF",
    },
    {
        name: "Sunset",
        sidebarBg: "#3D1505",
        contentBg: "#FFF3EA",
    },
    {
        name: "Rose",
        sidebarBg: "#3D0520",
        contentBg: "#FFEAF5",
    },
    {
        name: "Midnight",
        sidebarBg: "#0A0A1A",
        contentBg: "#E8E8F0",
    },
    {
        name: "Amber",
        sidebarBg: "#2D1F05",
        contentBg: "#FFF8EA",
    },
];

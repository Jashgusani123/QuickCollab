# Theme Components

## Component Structure

### 1. ThemePresetCard
Large preview card showing sidebar | content split view.
- Used in settings dialog grid
- Shows selected state with ring
- Displays theme name badge

### 2. CustomColorPicker
Full color customization interface:
- Dual color pickers (sidebar + content)
- Live preview panel
- Hex input fields
- Save/Cancel actions

### 3. ThemeSettingsDialog
Main modal component:
- Grid of preset cards
- Custom theme builder section
- View switching (presets ↔ custom picker)
- Mobile responsive layout

## Usage Example

```typescript
import { ThemeSettingsDialog } from '@/components/theme/theme-settings-dialog';

function MyComponent() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Settings</button>
      <ThemeSettingsDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
```

## Theme Store Access

```typescript
import { useThemeStore } from '@/store/theme.store';

// Get current theme
const currentTheme = useThemeStore((state) => state.currentTheme);

// Set preset theme
const setTheme = useThemeStore((state) => state.setTheme);
setTheme(THEME_PRESETS[0]);

// Set custom theme
const setCustomTheme = useThemeStore((state) => state.setCustomTheme);
setCustomTheme('#1A1A1A', '#FFFFFF');
```

## CSS Variables

```css
/* Applied automatically by ThemeProvider */
var(--sidebar-bg)   /* Sidebar background */
var(--content-bg)   /* Content area background */
```

## Class Names

```typescript
className="bg_dark"          // Uses --sidebar-bg
className="bg_light"         // Uses --content-bg
className="theme-sidebar-bg" // Alternative sidebar class
className="theme-content-bg" // Alternative content class
```

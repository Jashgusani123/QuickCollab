# 🚀 QUICK THEME REFERENCE

## 📦 THEME CLASS CHEAT SHEET

Use this guide when building new components to ensure they integrate with the theme system.

---

## 🎯 LAYOUT AREAS

### **Navbar/Toolbar** (Top Bar)
```tsx
<nav className="navbar h-12 px-4 border-b sidebar-border">
    {/* Navbar background + bottom border */}
</nav>
```

### **Sidebar** (Left Navigation)
```tsx
<aside className="bg_dark h-full p-4">
    {/* Sidebar background */}
</aside>
```

### **Content Area** (Main Chat/Messages)
```tsx
<main className="bg_light h-full p-6">
    {/* Content background */}
</main>
```

---

## 🔍 SEARCH BARS

### **Navbar Search** (Global Search)
```tsx
<input
    type="search"
    placeholder="Search messages..."
    className="navbar-search w-full px-4 py-2 rounded-md border"
/>
```

### **Sidebar Search** (Channel Search)
```tsx
<input
    type="search"
    placeholder="Search channels..."
    className="sidebar-search w-full px-3 py-2 rounded-md border"
/>
```

---

## 📝 TEXT COLORS

### **Sidebar Text**
```tsx
<h2 className="text-sidebar text-xl font-bold">Workspace</h2>
<p className="text-sidebar-muted text-sm">50 members</p>
<span className="text-sidebar-subtle text-xs">Unread: 5</span>
```

### **Content Text**
```tsx
<h1 className="text-content-heading text-2xl font-bold"># general</h1>
<p className="text-content text-base">Message body text</p>
<span className="text-content-muted text-sm">Additional info</span>
<span className="text-content-subtle text-xs">Metadata</span>
```

---

## 🎨 ICONS

### **Navbar Icons**
```tsx
<Bell className="navbar-icon w-5 h-5" />
<Search className="navbar-icon w-4 h-4" />
```

### **Sidebar Icons**
```tsx
{/* Active/Primary Icons */}
<Hash className="sidebar-icon w-4 h-4" />

{/* Muted/Secondary Icons */}
<Hash className="sidebar-icon-muted w-4 h-4" />

{/* Active State Icons */}
<Hash className="sidebar-icon-active w-4 h-4" />
```

---

## 🔘 INTERACTIVE ITEMS

### **Channel/DM List Items**
```tsx
{/* Normal State */}
<button className="sidebar-item w-full px-3 py-2 rounded-md flex items-center gap-2">
    <Hash className="sidebar-icon-muted w-4 h-4" />
    <span className="text-sidebar text-sm">general</span>
</button>

{/* Active/Selected State */}
<button className="sidebar-item active w-full px-3 py-2 rounded-md flex items-center gap-2">
    <Hash className="sidebar-icon w-4 h-4" />
    <span className="text-sidebar text-sm font-semibold">random</span>
</button>
```

**Result:**
- Default: Uses `--sidebar-bg`
- Hover: Uses `--sidebar-hover` (automatic)
- Active: Uses `--sidebar-active`

---

## 💬 MESSAGES

### **Message Bubble**
```tsx
<div className="message-bubble p-4 rounded-lg border">
    <div className="flex items-start gap-3">
        <Avatar className="w-10 h-10" />

        <div className="flex-1">
            {/* Author + Timestamp */}
            <div className="flex items-baseline gap-2">
                <span className="message-author">John Doe</span>
                <span className="message-timestamp">2:34 PM</span>
            </div>

            {/* Message Body */}
            <p className="message-body-text mt-1">
                Hey team! This is the message content.
            </p>

            {/* Reactions */}
            <div className="flex gap-2 mt-2">
                <button className="message-reaction px-2 py-1 rounded-full text-xs flex items-center gap-1">
                    👍 <span>5</span>
                </button>
                <button className="message-reaction active px-2 py-1 rounded-full text-xs flex items-center gap-1">
                    ❤️ <span>3</span>
                </button>
            </div>

            {/* Thread Indicator */}
            <div className="message-thread pl-4 py-2 mt-2 rounded-md">
                <button className="link text-sm hover:underline">
                    2 replies
                </button>
            </div>
        </div>
    </div>
</div>
```

---

## ✏️ EDITOR (Quill)

### **Editor Container**
```tsx
<div className="p-4 border-t content-border">
    <div className="editor-container rounded-lg border overflow-hidden">
        {/* Quill Editor (auto-themed via CSS) */}
        <div className="ql-toolbar">
            {/* Toolbar icons automatically use --editor-toolbar-icon */}
        </div>
        <div className="ql-container">
            <div className="ql-editor" data-placeholder="Type a message...">
                {/* Editor content */}
            </div>
        </div>
    </div>
</div>
```

**Note:** Quill is automatically themed via globals.css. No additional classes needed!

---

## 🃏 CARDS & SURFACES

### **Elevated Card**
```tsx
<div className="content-card p-6 rounded-lg border hover:shadow-md transition-shadow">
    <h3 className="text-content-heading text-lg font-bold">Card Title</h3>
    <p className="text-content-muted text-sm">Card description</p>
</div>
```

### **Layered Surfaces**
```tsx
{/* Level 1 - Subtle elevation */}
<div className="content-surface-1 p-4 rounded-lg">
    Content here
</div>

{/* Level 2 - Medium elevation (dropdowns, popovers) */}
<div className="content-surface-2 p-4 rounded-lg border content-border-strong">
    Dropdown content
</div>

{/* Level 3 - Highest elevation (tooltips, modals) */}
<div className="content-surface-3 p-4 rounded-lg">
    Tooltip content
</div>
```

---

## 📊 STATE INDICATORS

### **Success**
```tsx
<div className="state-success px-4 py-3 rounded-lg flex items-center gap-3">
    <CheckCircle className="w-5 h-5" />
    <p className="text-sm">Message sent successfully!</p>
</div>
```

### **Error**
```tsx
<div className="state-error px-4 py-3 rounded-lg flex items-center gap-3">
    <XCircle className="w-5 h-5" />
    <p className="text-sm">Failed to send message</p>
</div>
```

### **Warning**
```tsx
<div className="state-warning px-4 py-3 rounded-lg flex items-center gap-3">
    <AlertTriangle className="w-5 h-5" />
    <p className="text-sm">Network connection unstable</p>
</div>
```

### **Info**
```tsx
<div className="state-info px-4 py-3 rounded-lg flex items-center gap-3">
    <Info className="w-5 h-5" />
    <p className="text-sm">New update available</p>
</div>
```

---

## 🔗 LINKS

```tsx
<a href="#" className="link text-sm hover:underline">
    View Profile
</a>
```

---

## 📏 BORDERS & DIVIDERS

### **Standard Borders**
```tsx
<div className="border content-border rounded-lg">
    Content with border
</div>

<div className="border sidebar-border rounded-lg">
    Sidebar element with border
</div>
```

### **Strong/Emphasized Borders**
```tsx
<div className="border content-border-strong rounded-lg">
    Important element
</div>
```

### **Divider Lines**
```tsx
<hr className="content-divider my-4" />
<hr className="sidebar-divider my-2" />
```

---

## ⚡ QUICK TIPS

1. **Navbar elements** → Use `.navbar`, `.navbar-search`, `.navbar-icon`, `.navbar-text`
2. **Sidebar elements** → Use `.sidebar-item`, `.sidebar-search`, `.sidebar-icon`, `.text-sidebar`
3. **Content elements** → Use `.content-card`, `.message-bubble`, `.text-content`, `.link`
4. **Search bars** → Always use dedicated search classes (`.navbar-search` or `.sidebar-search`)
5. **Icons** → Match icon class to area (`.navbar-icon`, `.sidebar-icon`, `.sidebar-icon-muted`)
6. **Borders** → Use semantic border classes (`.content-border`, `.sidebar-border`)
7. **Messages** → Use `.message-bubble`, `.message-author`, `.message-timestamp`, `.message-body-text`
8. **States** → Use `.state-success`, `.state-error`, `.state-warning`, `.state-info`

---

## 🎨 THEME VARIABLES REFERENCE

If you need to use CSS variables directly:

### **Navbar**
- `--navbar-bg` - Navbar background
- `--navbar-text` - Primary navbar text
- `--navbar-icon` - Navbar icon color
- `--navbar-search-bg` - Global search background

### **Sidebar**
- `--sidebar-bg` - Main sidebar background
- `--sidebar-text` - Primary sidebar text
- `--sidebar-hover` - Hover state background
- `--sidebar-active` - Active/selected state background
- `--sidebar-search-bg` - Search bar background

### **Content**
- `--content-bg` - Main content background
- `--content-text` - Primary content text
- `--content-surface-1` - Elevated card background
- `--content-border` - Standard border color
- `--content-link` - Link color

### **Messages**
- `--message-bubble-bg` - Message card background
- `--message-author-text` - Author name color
- `--message-timestamp-text` - Timestamp color
- `--message-reaction-bg` - Reaction bubble background

### **Editor**
- `--editor-bg` - Editor background
- `--editor-toolbar-bg` - Toolbar background
- `--editor-toolbar-icon` - Toolbar icon color

---

## ✅ TESTING CHECKLIST

When building a new component, verify:

- [ ] Text is readable (uses appropriate text color classes)
- [ ] Icons are visible (uses appropriate icon classes)
- [ ] Search bars stand out (uses `.navbar-search` or `.sidebar-search`)
- [ ] Hover states work (uses `.sidebar-item` or similar)
- [ ] Borders are visible (uses `.content-border` or `.sidebar-border`)
- [ ] Cards have elevation (uses `.content-card` or `.content-surface-1`)
- [ ] Works on all 8 theme presets
- [ ] Works with custom themes (any colors)

---

**For complete documentation, see: COMPLETE_THEME_GUIDE.md**

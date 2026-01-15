# Code KT Automation Platform - Design Guidelines

## Design Approach

**Selected Approach:** Design System (Material Design inspired) with Developer Tool References

**Justification:** This is a utility-focused, information-dense developer productivity tool requiring clear hierarchy, efficient navigation, and familiar patterns. Drawing inspiration from Linear's clean minimalism, VS Code's developer-friendly layouts, and GitHub's code-focused UI.

**Key Design Principles:**
- Clarity over decoration
- Information density without clutter
- Developer-familiar patterns
- Scannable content hierarchy

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, and 8
- Component padding: p-4, p-6
- Section gaps: gap-4, gap-6
- Margins: m-2, m-4, m-8
- Grid gaps: gap-6, gap-8

**Page Structure:**
- Sidebar navigation (fixed, w-64)
- Main content area (flex-1, max-w-7xl)
- Header bar (h-16, fixed top)
- Right panel for context/details (w-80, collapsible)

## Typography Hierarchy

**Font Stack:** 
- Primary: Inter (Google Fonts) - UI text
- Code: JetBrains Mono (Google Fonts) - code snippets

**Hierarchy:**
- Page titles: text-3xl, font-bold
- Section headers: text-2xl, font-semibold
- Subsections: text-xl, font-medium
- Body text: text-base, font-normal
- Labels: text-sm, font-medium
- Code snippets: text-sm, font-mono
- Captions: text-xs

## Core Component Library

### Navigation
**Left Sidebar:**
- Vertical nav with icons + labels
- Sections: Dashboard, Architecture, Code Explorer, Chat Assistant, Configuration
- Active state indicator (border-l-4)
- Icon size: w-5 h-5
- Item padding: px-4 py-3

**Top Header:**
- Logo/branding (left)
- Project selector dropdown (center-left)
- Search bar (center, max-w-md)
- User profile + settings (right)
- Height: h-16

### Dashboard Cards
- Grid layout: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Card structure: rounded-lg border p-6
- Shadow: shadow-sm hover:shadow-md transition
- Metric display: Large number (text-4xl font-bold) + label below
- Mini graphs/charts within cards

### Chat Interface
**Layout:**
- Full-height scrollable area
- Messages: max-w-3xl mx-auto
- User messages: ml-auto, max-w-2xl
- AI responses: mr-auto, max-w-2xl
- Input bar: Fixed bottom, w-full, p-4

**Message Bubbles:**
- User: rounded-2xl rounded-br-sm, p-4
- AI: rounded-2xl rounded-bl-sm, p-4
- Code blocks within messages: rounded-lg p-4, font-mono text-sm
- Syntax highlighting for code

### Code Display Components
**File Tree:**
- Nested indentation (pl-4 per level)
- Folder icons, file type icons
- Collapsible folders
- Hover highlight on items

**Code Viewer:**
- Line numbers (left gutter, w-12)
- Syntax highlighting
- Copy button (top-right)
- File path breadcrumb (top)
- Scrollable: max-h-96 overflow-auto

**Diagram Viewer:**
- SVG/Canvas container: w-full min-h-96
- Zoom controls (bottom-right)
- Pan functionality
- Export button (top-right)

### Forms & Inputs
**Configuration Panel:**
- Label above input pattern
- Input fields: rounded-md border px-4 py-2
- Dropdowns: Custom styled select
- Toggle switches for boolean configs
- Help text: text-sm text-gray-600 mt-1

**Search Bar:**
- Rounded-full px-6 py-2
- Icon (left): w-5 h-5
- Clear button (right, when active)
- Dropdown suggestions below

### Data Display
**Architecture Overview:**
- Three-column metrics (lg:grid-cols-3)
- Visual indicators (icons, badges)
- Click-to-expand cards
- Breadcrumb navigation for drill-down

**Feature List:**
- Table view with sortable columns
- Row hover states
- Action buttons per row (text-sm)
- Pagination at bottom

**Dependency Graph:**
- Interactive node-link diagram
- Legend (top-right)
- Filter controls (top-left)
- Full-screen mode option

## Responsive Behavior

**Breakpoints:**
- Mobile (base): Stack everything, hide right panel
- Tablet (md): 2-column grids, collapsible sidebar
- Desktop (lg): Full 3-column layout, persistent sidebar

**Mobile Adaptations:**
- Hamburger menu for sidebar
- Bottom navigation bar for primary actions
- Full-width chat interface
- Simplified diagrams (tap to expand)

## Accessibility

- Semantic HTML throughout
- ARIA labels for icon buttons
- Keyboard navigation support
- Focus indicators: ring-2 ring-blue-500
- Screen reader announcements for dynamic content
- High contrast text ratios

## Component Specifications

**Buttons:**
- Primary: px-6 py-2.5 rounded-md font-medium
- Secondary: px-4 py-2 rounded-md border
- Icon only: w-10 h-10 rounded-full
- Hover states via opacity or shadow changes

**Badges:**
- Rounded-full px-3 py-1 text-xs font-medium
- Count indicators: min-w-5 h-5 rounded-full

**Loading States:**
- Skeleton screens (animate-pulse)
- Spinner for inline loading (w-6 h-6)
- Progress bars for file scanning

**Tooltips:**
- Appear on hover (transition-opacity)
- Rounded-md px-3 py-1.5 text-sm
- Arrow pointer to source element

## Images

**No large hero images required.** This is a developer tool focusing on functionality.

**Icon Usage:**
- Use Heroicons (via CDN) throughout
- File type icons in code explorer
- Feature icons in dashboard cards
- Status indicators (checkmark, warning, error)

**Diagram Placeholders:**
- Architecture diagrams generated by tool
- Flow charts for code navigation
- Dependency graphs (force-directed layout)

## Animations

**Minimal, purposeful animations only:**
- Sidebar collapse/expand (transition-all duration-200)
- Dropdown menus (transition-opacity)
- Card hover elevation (transition-shadow)
- No scroll-triggered or decorative animations
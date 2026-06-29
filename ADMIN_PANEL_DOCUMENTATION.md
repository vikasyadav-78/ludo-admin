# Gaming Battle Platform - Ludo Admin Panel Documentation

This documentation covers the architecture, component design, state integration, page layout, and system features of the **Ludo Admin Panel**. It is intended to guide new developers in understanding and extending this secure administration dashboard.

---

## 1. Project Overview

### Purpose of the Admin Panel
The Ludo Admin Panel acts as the secure command and control center for the real-money Ludo gaming battle platform. It enables administrators and support staff to supervise platform health, view wagers, process deposits and withdrawals, settle match disputes, inspect automated AI vision checks, and modify global parameters.

### Main Responsibilities
* **Real-time Monitoring**: Tracks active players, wagers, and transaction volumes.
* **Wallet Settlements**: Audits platform ledger, bank deposit receipts, and withdrawal payouts safely.
* **Match Resolution**: Supervises screenshot proofs and overrides disputed battle outcomes manually.
* **AI vision Checks**: Evaluates Gemini Vision AI suggestions for game outcome validations.
* **Platform Operations**: Dispatches system announcements and modifies game limits dynamically.

### Features Provided
* **Business Analytics**: High-fidelity metrics cards and visual trends showing commissions, profits, and user logs.
* **User Management**: Deep search filters, win-rate indicators, profile drawers, and manual wallet adjustments.
* **Battle Dispute Management**: Real-time room wagers lists, dispute resolver overlays, and manual win declarations.
* **Screenshot Vault**: Archive database containing all uploaded outcome screenshots mapped to battle IDs.
* **Announcements Dispatch**: Targeted user system messages or platform-wide broadcast alerts.
* **Dynamic Settings**: Live global settings configurations for wagers, bonuses, commission, and withdrawal caps.

---

## 2. Folder Structure

The directory structure of the Admin Panel matches standard Next.js App Router rules:

```text
d:\ludo\admin\
├── src/
│   ├── app/
│   │   ├── globals.css                # Global stylesheet resets, custom scrollbars, animations
│   │   ├── layout.tsx                 # Root layouts file importing globals.css
│   │   └── page.tsx                   # Main dashboard state hub and tabs controller
│   │
│   └── components/
│       ├── layout/
│       │   ├── DashboardLayout.tsx    # Coordinates sidebar drawer and main content workspace
│       │   ├── Sidebar.tsx            # Left navigation column containing logo and profile bottom
│       │   ├── Header.tsx             # Sticky top horizontal bar containing controls
│       │   └── PageHeader.tsx         # Page Title, breadcrumbs, and actions layout
│       │
│       ├── cards/
│       │   ├── StatCard.tsx           # Premium numeric statistics displaying block
│       │   ├── RevenueCard.tsx        # Summarizes profit and ledger wagers side-by-side
│       │   ├── ChartCard.tsx          # Card container hosting graph containers
│       │   └── StatusCard.tsx         # Summarizes key system status details
│       │
│       ├── charts/
│       │   ├── RevenueChart.tsx       # Recharts Daily Revenue Area graph
│       │   ├── UserChart.tsx          # Recharts User Growth curve
│       │   ├── BattleChart.tsx        # Recharts Battle Activity bar charts
│       │   └── ProfitChart.tsx        # Recharts Deposit vs Withdrawal double bar chart
│       │
│       ├── tables/
│       │   ├── DataTable.tsx          # Generic, typed table grid supporting states
│       │   └── TableCard.tsx          # Table wrapper supporting search and action layouts
│       │
│       └── ui/
│           ├── Button.tsx             # Animated variant button with spinner loading states
│           ├── Input.tsx              # Form text inputs with label and error bindings
│           ├── Badge.tsx              # Color badge displaying text categories
│           ├── Avatar.tsx             # User circular avatar displaying image or initials
│           ├── Modal.tsx              # Overlay overlay dialog box with fade transitions
│           ├── Drawer.tsx             # Slides in from right to display profile details
│           ├── Dropdown.tsx           # Hover/click dropdown list for context menus
│           ├── SearchBar.tsx          # Search text bar with absolute magnifying glass icon
│           ├── LoadingSkeleton.tsx    # Skeleton shimmers for cards and tables
│           ├── EmptyState.tsx         # Zero list results illustrative alert
│           └── ErrorState.tsx         # Connection failure alerts with refresh actions
│
├── tailwind.config.js                 # Tailwind CSS styles mappings
└── postcss.config.js                  # CSS processors compilation
```

---

## 3. Component Structure

### layout/
* **DashboardLayout.tsx**: Main shell coordinating sidebar drawer, top header, content area, and mobile blur overlays.
* **Sidebar.tsx**: Left column with dark glassmorphic styling, containing branding header, scrolling navigation buttons, and bottom logout/profile widgets.
* **Header.tsx**: Top horizontal bar containing hamburger, breadcrumbs trail, search field, refresh button, socket connection badge, and user dropdown.
* **PageHeader.tsx**: Renders page-level title, subtitle descriptions, and custom right-aligned buttons.

### ui/
* **Button.tsx**: Extends button attributes, providing variant designs (Primary, Secondary, Outline, Danger), tap animations, and spinners.
* **Input.tsx**: Structured input elements bound to validation labels and error classes.
* **Badge.tsx**: Categorizes text items with colored backgrounds.
* **Avatar.tsx**: Renders profile image or initials based on input names.
* **Modal.tsx**: Backdrop blur centered popups with spring anims.
* **Drawer.tsx**: Slides in from the right to display profile specifications.
* **Dropdown.tsx**: Pyramidal drop-down selections containing list actions.
* **SearchBar.tsx**: Search box containing a search icon.
* **LoadingSkeleton.tsx**: Houses standard shimmers.
* **EmptyState.tsx / ErrorState.tsx**: Handles listings empty and connection retry screens.

### cards/
* **StatCard.tsx**: Features hover lift animations, glow borders, and colored icons.
* **RevenueCard.tsx**: Compares financial columns side-by-side.
* **ChartCard.tsx**: Standard container for graph containers.
* **StatusCard.tsx**: Displays key-value platform state wagers.

### charts/
* **RevenueChart.tsx**: Plugs AreaChart to show daily commission trend lines.
* **UserChart.tsx**: Renders smooth purple AreaChart detailing registered user counts.
* **BattleChart.tsx**: Uses comparative double bar lines representing created vs settled battles.
* **ProfitChart.tsx**: Uses green/red double bar grids to represent deposits vs payouts.

### tables/
* **DataTable.tsx**: Strictly typed, presentational grid that dynamically maps column cell render methods and captures loading/error states.
* **TableCard.tsx**: Standard wrappers introducing filters, pagination containers, and action panels.

---

## 4. Pages

The admin panel is a Single Page Application (SPA) driven by state hooks in `src/app/page.tsx` displaying 10 different workspace tabs:

| Tab ID | Tab Name | Purpose & Features | APIs Used | Components Used |
| :--- | :--- | :--- | :--- | :--- |
| `overview` | Dashboard Overview | Platform statistics wagers | `GET /admin/dashboard-stats` | `PageHeader`, `StatCard`, `Button` |
| `financials` | Financial Analytics | Profits and transaction vectors | `GET /admin/stats-financial` | `PageHeader`, `StatCard`, `RevenueCard`, `ChartCard`, `RevenueChart`, `ProfitChart` |
| `users` | User Registry | Manage registered players, balances, IP | `GET /admin/users-detailed`<br>`PATCH /admin/users/:id/status` | `PageHeader`, `TableCard`, `SearchBar`, `DataTable`, `Badge`, `Avatar`, `Button`, `Drawer` |
| `battles` | Battle Rooms | Audit rooms, invite codes, disputes | `GET /admin/battles`<br>`POST /admin/battles/:id/resolve-dispute` | `PageHeader`, `TableCard`, `SearchBar`, `DataTable`, `Badge`, `Button`, `Modal` |
| `ai_reviews` | AI Review Center | Evaluate conflict screenshots, settle wagers | `GET /admin/pending-ai-reviews`<br>`POST /admin/resolve-ai-review` | `PageHeader`, `EmptyState`, `Badge`, `Button`, `ZoomIn` |
| `screenshots` | Screenshot Vault | Historical outcome screenshots database | `GET /admin/screenshots` | `PageHeader`, `EmptyState`, `ZoomIn` |
| `transactions` | Ledger Audit | Wallet ledger transaction records | `GET /admin/transactions` | `PageHeader`, `TableCard`, `SearchBar`, `DataTable`, `Badge` |
| `deposits_withdrawals` | Deposits & Payouts | Settle deposits and manual payouts | `GET /admin/deposits`<br>`GET /admin/withdrawals`<br>`POST /admin/withdrawals/:id/approve`<br>`POST /admin/withdrawals/:id/reject`<br>`POST /admin/deposits/:id/approve`<br>`POST /admin/deposits/:id/reject` | `PageHeader`, `DataTable`, `Badge`, `Button`, `Modal` |
| `referrals` | Referrals & Broadcasts | Dispatch alerts, review leaderboard | `GET /admin/referral-analytics`<br>`GET /admin/referral-top`<br>`GET /admin/referral-earnings`<br>`POST /admin/send-notification` | `PageHeader`, `Input`, `Button`, `StatusCard` |
| `reports_audit` | Reports & Audits | Save system wagers, download CSV, view logs | `GET /admin/audit-logs`<br>`GET /admin/settings`<br>`POST /admin/settings` | `PageHeader`, `Input`, `Button`, `TableCard`, `SearchBar`, `DataTable` |

---

## 5. Dashboard

The dashboard (`overview`) serves as the central platform oversight panel:
* **Statistic Cards**: Displays Registered Users, Online Users (based on socket registry), Active Users Today, and Active Users Weekly.
* **Battle Rooms Grid**: Displays counts for Total Matches, Running / Active wagers, Pending Admin resolutions, Disputed Rooms, and Settled Matches.
* **Live Metrics**: Automatically fetches metrics every 20 seconds.
* **Recent Activity & Real-time Updates**: Socket connection binds real-time updates directly into the UI state, triggering automatic statistics refetches on every battle outcome declared.

---

## 6. User Management

Features standard player audit tools:
* **Detailed Records Table**: Renders Avatar, Name, Email, Phone, Balances, and Win rate.
* **Detailed Profile Drawer**: Slides in to detail wagers, UUID, active devices list, IP addresses, and registration timestamps.
* **Status Controls**: Suspend/Activate buttons toggle database status flag between `ACTIVE` and `SUSPENDED`.
* **Manual Wallet Adjustment**: Dedicated popup dialog box to add or deduct balances (with selections for Deposit, Winning, or Bonus wallets).

---

## 7. Battle Management

Provides room tracking tools:
* **Battle List**: Details wagers, room title, wagers, host/joiner profiles, room code, winner/loser ID, status, and AI confidence parameters.
* **Dispute Handling**: Resolves conflicted rooms manually using a popup declaration:
  * Creator Win Settle.
  * Joiner Win Settle.
  * Cancel Battle and Refund both wagers.

---

## 8. AI Verification

Houses Gemini Vision AI battle validation:
* **AI Review Queue**: Displays battles where players submitted contradicting results (e.g. both players claiming victory).
* **Screenshot Viewer**: Double-column panel showing screenshots side-by-side with full-screen zoom tools.
* **Gemini Vision AI Analysis**: Displays layout confirmation (is it Ludo King screenshot?), suggested winner/loser, confidence percentage, room codes detected, image modification alert signs, and vision analysis reason comments.
* **Manual Settle actions**:
  * *Approve AI Winner*: Settles match based on Gemini validation.
  * *Settle Host (A)* / *Settle Challenger (B)*: Settle manually based on custom evaluations.
  * *Refund Both*: Cancels wagers and refunds entry fees.
  * *Reject & Cancel*: Rejects screenshots and cancels matches.

---

## 9. Wallet Management

Ensures transaction safety:
* **Deposits**: Settle manually uploaded deposit receipts by inspecting transaction IDs and screenshot vouchers.
* **Withdrawals**: Process payouts to banks or UPI codes. Admins can approve (which triggers wallet payout deductions) or reject (requiring rejection descriptions which refund withdrawal wagers automatically).
* **Ledger Audit**: Archive ledger auditing transactions.
* **Manual Adjustments**: Settle adjustments by sending credit/debit parameters to the database.

---

## 10. Reports

Includes data exports (CSV downloads):
* **Users Database**: Detailed fields, balances, IPs, and win logs.
* **Battles Logs**: Historical battles data, wagers, commissions, and results.
* **Wallet Ledger**: Financial wagers, Razorpay gateway details, and types.
* **Admin Audit Logs**: Security log details mapping administrative changes.

---

## 11. Charts

Includes Recharts components rendered in Tab 2:
* **Daily Commissions Trend**: Plots commissions revenue over the last 30 days.
* **Deposits vs Withdrawals**: Plots inflows/outflows over days.
* **User Growth / Battle Activity**: Graphs available for active registries and wagers.
* **Refresh Behaviour**: Charts refetch data dynamically on tab switch or manual refresh, and pull live database stats.

---

## 12. Socket.IO Integration

* **Connection**: Launches Socket.IO connection to `http://localhost:5000` with the admin JWT token.
* **Connection Badge**: Shows live connection status dynamically.
* **Events**: Listens to `'battle_list_update'` to trigger automatic state refreshes when wagers, settlements, or AI checks change.

---

## 13. UI Components

| Component | Props | Usage | Reusability |
| :--- | :--- | :--- | :--- |
| `Button` | `variant` (Primary/Secondary/Outline/Danger), `isLoading`, `disabled`, React button attributes | Action button, form submissions | Universal |
| `Input` | `label`, `error`, `wrapperClassName`, React input attributes | Form text entries | Universal |
| `Badge` | `variant` (Primary/Success/Warning/Danger/Neutral), `children` | Status flags displaying | Universal |
| `Avatar` | `src`, `name`, `size` (sm/md/lg) | User circular icons | Universal |
| `Modal` | `isOpen`, `onClose`, `title`, `children` | Popup dialog boxes | Universal |
| `Drawer` | `isOpen`, `onClose`, `title`, `children`, `width` | User details profiles | Universal |
| `Dropdown` | `trigger`, `items` (labels, icons, onClick callbacks), `align` | User profile / actions list dropdowns | Universal |
| `SearchBar` | `value`, `onChange`, `placeholder` | Search lists | Universal |
| `DataTable` | `columns` (accessor and headers), `data`, `isLoading`, `isError`, `onRetry` | Tabular listings | Universal |
| `TableCard` | `title`, `searchBar`, `actions`, `filters`, `pagination`, `children` | Wraps data tables | Universal |

---

## 14. Design System

* **Colors**:
  * Primary Background: `#0B1120` (Deep blue-gray)
  * Secondary Background: `#111827` (Dark gray)
  * Card Background: `#1A2235` (Sleek slate)
  * Accent: `#00D4FF` (Bright cyan)
  * Success: `#22C55E` (Vibrant green)
  * Warning: `#F59E0B` (Amber)
  * Danger: `#EF4444` (Coral red)
  * Border: `rgba(255,255,255,0.08)`
* **Typography**: Default font family set to `Inter`, with letter spacing and font-weight variants (400, 500, 600, 700).
* **Spacing**: Consistent Tailwind grid layout sizes.
* **Cards**: Feature `.glow-card` hover shadow gradients and spring y-axis lift transitions.
* **Buttons**: Animated variants, support spinners, and disabled states.
* **Tables**: Sticky headers, hover backgrounds on rows, and overflow-x scroll structures.
* **Forms**: Border color shifts to Accent on focus, and Danger on errors.
* **Icons**: Semantic icons loaded dynamically.
* **Animations**: Powered by Framer Motion:
  * Modals/Drawers fade-in and spring slide-outs.
  * Nav active tab background slides smoothly via `layoutId`.

---

## 15. Responsive Behaviour

* **Desktop (1440px - 1920px)**: Sidebar stays fixed on the left (280px), top header fits remaining space, cards display 4 per row, tables show all details.
* **Laptop (1024px - 1366px)**: Sidebar stays fixed, content card grids wrap to 3 columns per row.
* **Tablet (768px - 1023px)**: Sidebar collapses off-screen into drawer, Hamburger menu button appears in top header to toggle sidebar, cards wrap to 2 columns per row.
* **Mobile (480px - 767px)**: Sidebar slides over layout as full drawer overlay, top header details wrap cleanly (profile text hides, leaving icon only), cards collapse to 1 column per row, tables scroll horizontally.

---

## 16. Performance Optimizations

* **Lazy Loading**: Recharts modules are packaged efficiently.
* **Unnecessary Re-renders Prevention**: Reusable components use memoized prop states.
* **Component Reuse**: UI primitives reduce overall build bundle size.
* **Scrolling Optimization**: Content scrolls inside a single vertical scrollbar (`<main>`), removing nested container overlays and double scrollbars.

---

## 17. Security

* **JWT Verification**: Token verified on every API request.
* **Route Protection**: If `token` is missing in `localStorage`, the dashboard redirects to the Secure Sign-In screen.
* **Unauthorized Role Prevention**: Sign-in rejects users without `ADMIN` or `SUPPORT` credentials.
* **Sanitized Inputs**: Forms filter special characters, and parameters are transaction-safe.

---

## 18. Future Improvements (Partially Implemented / Planned)

* **Light Mode Support**: Current system only implements Dark Mode themes.
* **Detailed Activity Feeds**: Live visual feeds listing signups or withdrawals (Partially Implemented via Socket connections).
* **Automated CSV Scheduling**: Auto-delivering CSV logs to emails.

---

## 19. Complete File List

* `tailwind.config.js`: Tailwind colors and fonts mappings.
* `postcss.config.js`: Processors compiler settings.
* `src/app/globals.css`: Tailwind baseline settings and animations classes.
* `src/app/layout.tsx`: Loads globals.css layout styles.
* `src/app/page.tsx`: Handles data fetching, state variables, tab modifications, and resolution forms.
* `src/components/layout/DashboardLayout.tsx`: Coordinates sidebar drawer and main viewports.
* `src/components/layout/Sidebar.tsx`: Glassmorphic navigation column.
* `src/components/layout/Header.tsx`: Sticky horizontal control header.
* `src/components/layout/PageHeader.tsx`: Layout for titles and breadcrumbs.
* `src/components/cards/StatCard.tsx`: Standard stats cards.
* `src/components/cards/RevenueCard.tsx`: Summarizes profits columns.
* `src/components/cards/ChartCard.tsx`: Graphic container layout.
* `src/components/cards/StatusCard.tsx`: Summarizes status listings.
* `src/components/charts/RevenueChart.tsx`: Area chart showing commissions.
* `src/components/charts/UserChart.tsx`: Area chart showing user base.
* `src/components/charts/BattleChart.tsx`: Bar chart showing active matches.
* `src/components/charts/ProfitChart.tsx`: Bar chart comparing deposits/withdrawals.
* `src/components/tables/DataTable.tsx`: Generic data grid.
* `src/components/tables/TableCard.tsx`: Grid wrapper with action items.
* `src/components/ui/Button.tsx`: Animated buttons.
* `src/components/ui/Input.tsx`: Form inputs.
* `src/components/ui/Badge.tsx`: Color badges.
* `src/components/ui/Avatar.tsx`: Circular avatars.
* `src/components/ui/Modal.tsx`: Overlay popups.
* `src/components/ui/Drawer.tsx`: Profile drawers.
* `src/components/ui/Dropdown.tsx`: Dropdown menus.
* `src/components/ui/SearchBar.tsx`: Search text box.
* `src/components/ui/LoadingSkeleton.tsx`: Shimmer layouts.
* `src/components/ui/EmptyState.tsx`: Listings placeholders.
* `src/components/ui/ErrorState.tsx`: Network failure retry cards.

---

## 20. Dependencies

* **next**: Core framework driving App routing and compilation.
* **react / react-dom**: UI layer rendering components.
* **socket.io-client**: Connects real-time events to lobby servers.
* **recharts**: Graph visualization packages.
* **lucide-react**: High-fidelity vector icons library.
* **framer-motion**: Drives active tab highlights, hover scales, and fade animations.
* **clsx**: Concatenates CSS classes dynamically.
* **tailwind-merge**: Resolves CSS classes overrides.
* **@reduxjs/toolkit / react-redux**: Manages global redux state hooks (kept intact for compatibility).

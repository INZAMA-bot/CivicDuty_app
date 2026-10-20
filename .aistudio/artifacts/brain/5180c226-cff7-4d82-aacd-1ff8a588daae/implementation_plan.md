# Provider Desk Navigation & Desk Owner Permission Alignment Plan

Revised work plan to preserve the restored Government Desk layout at 100% fidelity, restrict all department section edits strictly to verified desk owners, align Provider Desks navigation with the exact specification (removing Feed, adding Exit, Inbox, Works, Team, Audit), and solidify previously agreed architectural conclusions (Five-Vault system, peer tipping, and cashier POS workflows).

---

## User Review & Critical Decisions

> [!IMPORTANT]
> **Strict Government Desk Immunity**: As explicitly instructed, **zero changes** will be made to any part of the Government Desk views (`GovInboxView` sovereign sections, stats docket, 5-Vault Monthly Perks console, grassroots action flows, or styling). It remains 100% locked.

> [!IMPORTANT]
> **Department Section Edit Lockdown (Desk Owner Only)**:
> - **Zero Public Tampering**: General citizens, anonymous visitors, or officers from other institutions cannot edit or mutate department names, descriptions, contacts, avatars, or SLAs.
> - **Verified Desk Owner Authorization**: Only the authenticated desk owner (`user.dept === did` or `user.organization_name === d.name` or claimed owner of that specific desk) can access the edit studio, change avatars/hotlines, or update profile data in `DepartmentsView` and `DeptWallView`.
> - **Context-Layer Guard**: In `AppContext.tsx`, `updateClaimedEntityDetails` enforces strict ownership validation so rogue updates are rejected with an explicit permission notice.

> [!NOTE]
> **Provider Desk Navigation Alignment**:
> - **Bottom Nav Bar (Mobile)**: Matches your screenshot: `[Inbox]` (selected), `[Works]`, `[Team]`, `[Audit]`, and `[Exit]` (red power icon). The `Feed` tab is completely removed; the Inbox is sufficient for handling dispatches and inquiries.
> - **Desktop Sidebar**: Remove `Public Feed` from `providerWorkspaceItems`, add `Audit Chain`, and update the desktop footer exit button to cleanly terminate the provider session (`setUser(null); go('splash');`).

---

## 1. Overview & Core Concept

- **What It Does**:
  1. **Department Section Ownership Security**: Locks down the Service Registry (`DepartmentsView`) and Department Wall (`DeptWallView`) so that only verified desk owners and authorized accounting officers can edit department identity, branding, contacts, and SLA parameters. Citizens and visitors enjoy clean, read-only transparency (filing dispatches, viewing SLA compliance, staking, and claiming unclaimed entities).
  2. **Provider Desk Navigation Parity**: Equips registered businesses, schools, hospitals, utilities, and contractors with an authoritative operational console strictly focused on their institutional duties: triage incoming inquiries/complaints in **Inbox**, track facility upgrades in **Works**, manage assigned staff in **Team**, inspect transparency logs in **Audit**, and immediately sign out via **Exit**.
  3. **Zero Government Desk Tampering**: Ensures the Nakasero Parish Chief / Town Agent layout, 48-hour SLA metrics, Sovereign Government Desk allocations, and 5-Vault Monthly Top-3 Merit console remain identical to the restored baseline.
  4. **Foundation Synthesis (Previously Agreed Conclusions)**:
     - **Five-Vault Civic & Community Reward Engine**:
       1. *Parish Vault*: Scoped per parish, locked 33.3% Top-3 split, signed by Parish Chief.
       2. *Provider Vault*: Scoped per business, 1-click batch dispatch to top interacting patrons.
       3. *Contractor Vault*: Scoped per public works contract, 1-click batch dispatch to top milestone/defect watchdogs.
       4. *Frontline Scout & Bodaboda Vault*: Scoped per transit corridor/stage, instant fuel/transit/airtime voucher split.
       5. *Individual Citizen Vault*: Discretionary peer-to-peer tipping directly on posts via the "Reward Author" button or in-vault dispatch.
     - **Cashier POS & Merchant Loyalty Studio**: Fast voucher code redemption for registered merchants and schools.
     - **Firestore Cloud Sync**: Persistent synchronization to `ai-studio-civicduty-5180c226-cff7-4d82-aacd-1ff8a588daae`.

---

## 2. User Experience & Visual Design

### Department Section: Permission-Aware UI Behavior

```
┌────────────────────────────────────────────────────────┐
│ Gayaza High School / NWSC / Café Javas Wall            │
├────────────────────────────────────────────────────────┤
│ Citizen / Visitor View:                                │
│ • Verified Provider Badge · Staking [+ Stake]         │
│ • SLA Telemetry & Public Accountability Docket         │
│ • [+ File Report] & Counter QR Placard                 │
│ • [Edit Wall Details] & Camera Icon: HIDDEN            │
├────────────────────────────────────────────────────────┤
│ Verified Desk Owner View:                              │
│ • Active Desk Lead Indicator · Authorized Admin        │
│ • [Edit Wall Details] button visible                   │
│ • Camera icon on avatar visible                        │
│ • Modal allows updating contacts, logo & description   │
└────────────────────────────────────────────────────────┘
```

### Key Navigation Layouts

#### A. Government Desk (100% Preserved - Untouched)
```
┌────────────────────────────────────────────────────────┐
│ Parish Chief (Nakasero)     8 PENDING    38% resolved │
│ KCCA · Parish Chief / Town Agent                       │
│ Sovereign Government Desk · State-Funded Allocation    │
│ [ 5-Vault Monthly Perks → ]                            │
│ ┌────────────────────────────────────────────────────┐ │
│ │ ENTITY CIVIC PERKS & MONTHLY TOP-3 MERIT VAULT     │ │
│ │ MONTHLY TOP-3 SPLIT (33.3% EACH)                   │ │
│ └────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
  [ Grassroots ]    [ Works ]    [ Audit ]    [ Exit ⏻ ]
```

#### B. Provider Desk (Updated with Feed Removed & Exit Added)
```
┌────────────────────────────────────────────────────────┐
│ Gayaza High School / Café Javas / NWSC Branch          │
│ Verified Provider Desk · National Tier                 │
│ [ Cashier POS Desk ]  [ Team (N) ]  [ 5-Vault Perks ]  │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Inquiries & Tickets Queue / Merchant POS Terminal  │ │
│ └────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
  [ Inbox ]    [ Works ]    [ Team ]    [ Audit ]    [ Exit ⏻ ]
```

- **Bottom Tab Roster for Providers**:
  1. **Inbox** (`gov_inbox`): Ticket queue, parent/customer inquiries, SLA countdown, and reply composer.
  2. **Works** (`gov_projects`): Campus/facility infrastructure upgrades, contractor tracking, and milestone monitoring.
  3. **Team** (`entity_team`): Authorized staff members, role delegation, and operator credentials.
  4. **Audit** (`gov_audit`): Tamper-proof cryptographic ledger of all status transitions and POS redemptions.
  5. **Exit** (`setUser(null); go('splash');`): Red power button icon for instant secure desk logout.

---

## 3. Key Product Decisions & Trade-Offs

### 1. Department Edit Authorization Gate
- **Chosen Approach**: Multi-tier desk ownership verification:
  1. Check if logged-in user matches `user.dept === did` or `user.organization_name === d.name`.
  2. Check if user is the registered `owner_admin` or claimed representative for the entity.
  3. If not verified, hide all edit triggers (buttons, photo edit icons, modal forms).
  4. At context invocation (`updateClaimedEntityDetails`), verify authorization before committing changes to memory and Firestore.
- **Why**: Protects official government departments and reputable private institutions from unauthorized edits by third parties or general public users, guaranteeing institutional credibility.

### 2. Provider Desk Navigation Alignment
- **Chosen Approach**: Completely remove the `Feed` tab from private provider desks and replace it with `Exit` (matching Government Desk).
- **Why**: As you noted, the Inbox is sufficient for handling customer inquiries and dispatches. The Exit button provides instant workstation logout for shared staff computers.

---

## 4. Technical Architecture & Implementation Steps

```
┌──────────────────────────────────────────────────────────────────┐
│                         App Navigation                           │
└──────────────────────────────────────────────────────────────────┘
                                │
        ┌───────────────────────┴───────────────────────┐
        ▼                                               ▼
┌───────────────────────────────┐       ┌──────────────────────────────┐
│       Government Desk         │       │        Provider Desk         │
│  (100% Locked & Preserved)    │       │     (Aligned to Screenshot)  │
├───────────────────────────────┤       ├──────────────────────────────┤
│ • Grassroots Inbox            │       │ • Inbox (Inquiries/Tickets)  │
│ • Works (Public Projects)     │       │ • Works (Facility Projects)  │
│ • Audit (Sovereign Ledger)    │       │ • Team (Staff Roster)        │
│ • Exit (Red Power Logout)     │       │ • Audit (Activity Ledger)    │
│ • 5-Vault Monthly Perks       │       │ • Exit (Red Power Logout)    │
└───────────────────────────────┘       └──────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────┐
│             Department & Desk Owner Security Layer               │
├────────────────────────────────────────────────────────────────┤
│ • DepartmentsView & DeptWallView: Edit actions strictly locked   │
│   to verified desk owner (isDeskOwner). Citizens see read-only.  │
│ • AppContext: updateClaimedEntityDetails verifies ownership.     │
└──────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────┐
│                   Five-Vault Architecture Engine                 │
├──────────────────────────────────────────────────────────────────┤
│ 1. Parish Vault (Grassroots Escrow · Locked Top-3)               │
│ 2. Provider Vault (Shop/Clinic Service · Locked Top-3)           │
│ 3. Contractor Vault (Public Works Watchdogs · Locked Top-3)      │
│ 4. Scout Bounty Vault (Road Safety Corridor · Locked Top-3)     │
│ 5. Individual Vault (Discretionary Peer Post-Tipping)            │
└──────────────────────────────────────────────────────────────────┘
```

### Planned Code Adjustments:
1. **`src/views/DeptWallView.tsx` & `src/views/DepartmentsView.tsx`**:
   - Ensure all edit wall buttons, avatar upload triggers, and inline edit actions strictly require `isDeskOwner === true`.
   - Citizens and visitors see clean read-only profiles without any editing controls.
2. **`src/context/AppContext.tsx`**:
   - In `updateClaimedEntityDetails`, verify that the active user is the authorized desk administrator for `deptId` before saving changes to local state and Firestore.
3. **`src/components/Navigation.tsx`**:
   - Update `isPrivateProvider` mobile navigation bar:
     - Replace `[My Desk, Team, Profile, Perks, Feed]` with `[Inbox, Works, Team, Audit, Exit]`.
     - Set `Exit` button to red power icon with `setUser(null); go('splash');`.
   - Update `providerWorkspaceItems` (desktop):
     - Remove `feed` tab.
     - Add `Audit Chain` (`gov_audit`).
     - Align desktop exit action to cleanly log out provider session.
4. **`src/views/GovInboxView.tsx`**:
   - Keep government desk branches 100% intact.
   - For provider desk view, ensure smooth routing to Works (`gov_projects`), Team (`entity_team`), and Audit (`gov_audit`).
5. **Synthesis of Five-Vault & Peer Reward Features**:
   - Ensure the five vaults (`parish_vault`, `provider_vault`, `contractor_vault`, `scout_bounty_vault`, `individual_vault`) operate smoothly across `PerkVaultView.tsx` and `PostCardComponent.tsx` (peer tipping modal).
6. **Verification**:
   - Run `compile_applet` to guarantee complete build integrity and zero regressions.

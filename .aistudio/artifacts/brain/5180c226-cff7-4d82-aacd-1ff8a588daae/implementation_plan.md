# Implementation Plan: Five-Vault Civic & Community Reward Architecture

## 1. Architectural Overview
We will evolve the CivicDuty Perk & Escrow system into **Five Purpose-Built Vaults**, combining **four algorithmic, jurisdiction-ranked institutional vaults** (with locked Top-3 splits) and **one discretionary peer-to-peer citizen vault**:

1. **Parish Vault (`parish_vault`) — Grassroots Territorial Escrow**
   - **Jurisdiction Scope**: Scoped per Parish / Ward (`territory.parish` within the active country).
   - **Depositors**: Open to all sponsors (diaspora citizens, local well-wishers, NGOs, corporate CSR, or government community grants).
   - **Ranking Engine**: Automatically computes **Parish Reputation Standing** strictly from civic activity inside that Parish (verified reports filed in the parish, resolved local issues, and community upvotes/corroborations).
   - **Locked Top-3 Split & Parish Chief Dispatch**: Every deposit or batch is split evenly across the **Top 3 ranked citizens** in that Parish (`33.3%` / 1 voucher each per 3-pack). The **Parish Chief (Lowest Accounting Officer)** dispatches the reward on behalf of the Parish; the recipient list is **strictly locked** so the Parish Chief cannot alter or cherry-pick recipients—only verify and sign the batch release into the cryptographic audit ledger.

2. **Private Provider Vault (`provider_vault`) — Shop & Business Community Service Escrow**
   - **Jurisdiction Scope**: Strictly scoped to a specific registered business, shop, clinic, hospitality venue, or utility branch (`deptId`).
   - **Depositors**: Deposited by the Shop Owner / Business Representative as a community service and customer appreciation gesture.
   - **Ranking Engine**: Automatically computes an **Entity Interaction Score** based strictly on a citizen's verified interactions with that specific business (constructive feedback, quality audits, praise reports, verified resolution confirmations, and helpful community notes on that shop's wall). Global XP is ignored.
   - **Locked Top-3 One-Click Batch Dispatch**: Systematically locks onto the **Top 3 interacting citizens** for that business and splits the vault deposit evenly across them via a **One-Click Batch Dispatch** action.

3. **Contractor Vault (`contractor_vault`) — Public Works Watchdog Escrow**
   - **Jurisdiction Scope**: Strictly scoped to a specific Public Works Contract (`projectId`).
   - **Depositors**: Deposited by the contracted engineering firm (as Field Data & Watchdog Reimbursement) or supervising agency.
   - **Ranking Engine**: Ranks citizens strictly by their **Contract Watchdog Score** on that project (geotagged photo/video field reports, compiled witness dossiers, defect flags, and milestone verification participation).
   - **Locked Top-3 One-Click Batch Dispatch**: Automatically splits the vault deposit evenly across the **Top 3 Watchdogs** for that contract with a **One-Click Batch Dispatch** button, ensuring critical defect spotters and milestone verifiers are rewarded without interference.

4. **Frontline Scout & Bodaboda Road Safety Bounty Vault (`scout_bounty_vault`) — Transit & Hazard Bounty Escrow**
   - **Jurisdiction Scope**: Strictly scoped per **Transit Stage, Highway Corridor, or Road Safety Jurisdiction** (e.g., *Kampala Metro Bodaboda Stages*, *Northern Bypass & Bwaise Corridor*, *Entebbe Highway Stage*, or country-specific Matatu/Okada/Danfo/Tuk-tuk corridors and Transport/Works desks).
   - **Depositors**: Open to Corporate CSR sponsors (Telcos, Fuel & Mobility companies, Banks, Insurers), Transit Cooperatives, and Road/Transport Authorities.
   - **Ranking Engine**: Automatically computes **Frontline Scout & Road Safety Standing** strictly from road-safety and frontline hazard participation in that corridor (`pothole`, `transport`, `water`, and `power` hazard reports, geotagged camera/voice evidence, corroborated rider witness reports, and commuter upvotes).
   - **Locked Top-3 One-Click Batch Dispatch**: Every bounty pool deposit is automatically split evenly across the **Top 3 ranked Frontline Scouts / Bodaboda Riders** in that jurisdiction (`33.3%` / 1 voucher each per 3-pack). The Top-3 list is strictly locked to prevent favoritism and released via **One-Click Batch Dispatch** (delivering instant transit/fuel vouchers, airtime/data bundles, or utility tokens via SMS/USSD).

5. **Individual Citizen Vault (`individual_vault`) — Peer-to-Peer Discretionary Vault**
   - **Jurisdiction Scope**: Personal to the logged-in citizen (`user.id`).
   - **Depositors**: Citizens deposit utility vouchers or top up their personal vault via Mobile Money / Card.
   - **Discretionary Peer Reward (Feed + Perk Vault)**: Citizens have 100% personal choice over who to reward—either by clicking the **"Reward Author"** button directly on any post in the Civic Feed / Post Detail view, or by selecting a citizen/post inside the Individual Vault tab in `PerkVaultView`.

---

## 2. Data Model & State Updates (`src/types.ts` & `src/context/AppContext.tsx`)
- **Extend `EscrowPerkVoucher`**:
  - Add `vaultType?: 'parish_vault' | 'provider_vault' | 'contractor_vault' | 'scout_bounty_vault' | 'individual_vault'`.
  - Add `jurisdictionId?: string` (Parish name for `parish_vault`, `deptId` for `provider_vault`, `projectId` for `contractor_vault`, Corridor/Stage ID for `scout_bounty_vault`, or `citizenId` for `individual_vault`).
  - Add `jurisdictionLabel?: string` (human-readable Parish, Shop, Contract, or Scout Corridor name).
  - Add `rankedSlot?: 1 | 2 | 3` and `rankingScoreAtDispatch?: number` to record the exact algorithmic standing at the moment of Top-3 batch dispatch.
  - Add `authorizedDispatcherRole?: 'parish_chief' | 'provider_owner' | 'contractor_or_authority' | 'scout_corridor_coordinator' | 'citizen_peer'`.
- **Jurisdiction Leaderboard Calculators**:
  - Build deterministic ranking calculators that inspect live `posts`, `comments`, and `compiled_reports` for:
    1. **Parish Vault**: `computeParishTopCitizens(parishName, country)`
    2. **Private Provider Vault**: `computeProviderTopCitizens(deptId, country)`
    3. **Contractor Vault**: `computeContractorTopWatchdogs(projectId, country)`
    4. **Frontline Scout & Bodaboda Vault**: `computeScoutCorridorTopRiders(corridorId, country)`
  - Each calculator returns the **Top 3 ranked participants** along with their transparent score breakdown (Reports Filed, Geotagged/Resolved Proof, Community Upvotes) so the UI displays why each recipient earned Rank #1, #2, and #3.

---

## 3. UI & Workflow Changes

### A. `src/views/PerkVaultView.tsx` — Five-Vault Architecture & Jurisdiction Rankers
- **5-Vault Selector Matrix**:
  - Replace the legacy single-pool banner with an interactive **5-Vault Architecture Switcher**:
    1. **Parish Vault** (Grassroots Reputation Standing · Dispatched by Parish Chief)
    2. **Private Provider Vault** (Shop/Business Community Service · Strictly Entity Interactions)
    3. **Contractor Vault** (Public Works Watchdog Standing · Top Contract Watchdogs)
    4. **Frontline Scout & Bodaboda Vault** (Road Safety & Hazard Bounty Pools · Top Corridor Scouts)
    5. **Individual Citizen Vault** (Personal Deposit · Discretionary Peer-to-Peer Rewards)
- **Deposit Flow Tailored per Vault**:
  - When depositing into any of the **4 Institutional Vaults** (`parish_vault`, `provider_vault`, `contractor_vault`, `scout_bounty_vault`), deposits are structured into **3-Way Even Split Batches** (1/3 each for Rank #1, Rank #2, and Rank #3 in that jurisdiction) and preview the live Top 3 leaderboard before checkout.
  - When depositing into an **Individual Vault**, vouchers are added to the citizen's personal discretionary vault balance for 1-click peer tipping.
- **Locked Top-3 One-Click Batch Dispatch Panel**:
  - Displays the selected jurisdiction's live **Top 3 Leaderboard** with a **"Locked Top-3 Algorithmic Split"** badge (recipients cannot be manually swapped).
  - For **Parish Vaults**, enforces the Parish Chief fiduciary dispatch workflow and logs the release to the Audit Chain.
  - For **Private Provider**, **Contractor**, and **Frontline Scout & Bodaboda** Vaults, provides a **One-Click Batch Dispatch** button that releases the 3 vouchers simultaneously to Rank #1, #2, and #3 via SMS/USSD.

### B. `src/views/FeedView.tsx` & `src/views/PostDetailView.tsx` — Direct "Reward" Button on Posts
- Add a **"Reward"** action button on feed posts and post detail views.
- Clicking **"Reward"** opens an **Individual Vault Peer Reward Modal**:
  - Shows the post author's name, post title, and the citizen's available Individual Vault vouchers (plus an instant 1-click deposit option if their Individual Vault is empty).
  - Lets the citizen attach a brief appreciation note and immediately dispatch a utility voucher to the post author.

---

## 4. Verification Plan
- Run `compile_applet` to verify zero TypeScript or build errors across `types.ts`, `AppContext.tsx`, `PerkVaultView.tsx`, `FeedView.tsx`, and `PostDetailView.tsx`.
- Verify that all five vaults calculate rankings accurately per jurisdiction, enforce the locked Top-3 split for the four institutional vaults, and allow direct peer-to-peer post tipping from the Individual Vault.

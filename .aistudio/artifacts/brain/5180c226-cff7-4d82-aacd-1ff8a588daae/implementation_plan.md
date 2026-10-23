# Implementation Plan: Following, Trending, Near Me & Grassroots Hierarchy

## Overview
Streamlined the Civic Feed into the exact requested trio: **Following**, **Trending**, and **Near Me**, mirroring the minimalist aesthetic of Twitter/X while embedding deep **Parish, Ward, and Grassroot (Village/Cell)** level granularity across post cards, the inline composer, location filtering, and engagement ranking—all while maintaining the sovereign Signal Bulbs system (🔴 Urgent, 🟡 Alert, 🟢 Resolved).

---

## 1. Top Navigation: The Exact Trio
- **Following**:
  - Displays dispatches from monitored local authorities, ward councilors, and desk leads (`@kcca`, `@nwsc`, `@umeme`, `@nakasero_chief`, etc.).
  - Includes a quick-follow suggestion strip with 1-tap follow toggles to instantly connect with local frontline desks.
- **Trending**:
  - Ranks civic issues and community dispatches by citizen engagement volume (corroborations / upvotes, co-signs, and comment momentum).
  - Features an interactive horizontal trending topic strip: `#NakaseroWater`, `#CentralWardRoads`, `#KawempeDrainage`, `#PotholeWatch`, `#GrassrootsAction`, `#MulagoEmergency`.
- **Near Me**:
  - Dedicated to the grassroots hierarchy: **Parish, Ward, Grassroot Cell**, and Sub-County/District.
  - Allows citizens to switch between a clean **Stream List** and the geospatial **Radar Map**.
  - Provides a **Grassroots Location Hierarchy Picker** modal with popular urban/rural hubs and custom Parish/Ward entry.

---

## 2. Parish, Ward, and Grassroot Granularity
- **Post Cards (`PostCardComponent`)**:
  - Prominent interactive badges right below the author header:
    - `[Parish: Nakasero Parish]`
    - `[Ward: Central Ward]`
    - `[Grassroot: Lumumba Cell]`
  - Clicking any badge instantly filters the feed to that specific Parish or Ward.
  - Location footer strip clearly reflects `📍 Parish · Ward (Grassroot Cell) · Department · Source · SLA status`.
- **Post Model (`Post`, `PostTerritory`, `UserSession`)**:
  - Formalized fields for `parish`, `ward`, `village`, `cell`, and `grassroot`.
  - Helper `getPostGrassroots(country, post)` normalizes and cleanly resolves hierarchy names.

---

## 3. Thoroughly Simplistic Inline Composer (`TwitterFeedComposer`)
- **Twitter/X-style Minimalism**:
  - Auto-expanding textarea with clear prompt.
  - 3 Iconic **Signal Bulbs**: 🔴 Urgent (Whistleblower/Open), 🟡 Alert (In Progress), 🟢 Praise (Resolved/Commendation).
  - Quick action toolbar: Photo upload, Grassroot Picker, Destination Desk, and Anonymous Whistleblower lock.
  - Active Grassroots pill: `📍 Parish: Nakasero · Ward: Central · Grassroot: Lumumba Cell` with 1-tap edit.
  - Quick grassroots presets: Bukoto, Naguru, Mulago, Kisenyi, Kamwokya, etc.

---

## 4. Verification & Testing
- Both `compile_applet` and `lint_applet` (`tsc --noEmit`) pass with zero errors.

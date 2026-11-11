# ViniApp 2.0.0 — Enterprise Mega Platform (ViniApp.xyz Complete Replica)

> **Prompt-to-Onchain Miniapp Platform**: Users describe an idea or pick a template → AI agent synthesizes code, brand kit, Base L2 smart contracts, Farcaster Frames v2 manifest, provisions a dedicated Base App Wallet, and launches a Clanker-style token where **60% of all trading volume fees** route directly to the creator.

---

## 🚀 What's New in ViniApp 2.0.0

### 1. 7 Pre-Built Production Miniapp Templates
- **Arcade Game**: Canvas runner with verified high scores on Base L2
- **Tipping Bot**: Farcaster Frames v2 social micro-tipper with Base USDC
- **Meme Maker**: Cyberpunk text styling with 1-click Base L2 NFT minting
- **Simple Blog**: Web3 publishing with collector mint passes and tips
- **Poll App**: World ID verified one-person-one-vote sybil-resistant polling
- **NFT Gallery**: Interactive portfolio with Seaport buy/offer integration
- **Event Calendar**: Web3 hackathon radar with Base RSVP badges

### 2. Real-Time Build Progress Broadcasting
- Real-time progress engine broadcasting job statuses:
  `queued` → `clarifying` → `generating` → `creating_wallet` → `deploying` → `live`
- Live progress bar (0% - 100%), estimated time remaining countdown (~12s), and skeleton loading states.

### 3. Real-Time Workspace Collaboration & Presence
- Shared workspace room for each miniapp / organization.
- Live collaborator presence avatars with status (`active`, `typing`, `idle`).
- Live team side chat & co-editing suggestions.

### 4. Advanced Granular RBAC (11 Permissions)
- Roles: `PLATFORM_SUPER_ADMIN`, `ORG_OWNER`, `ORG_ADMIN`, `APP_OWNER`, `BUILDER`, `VIEWER`
- Granular permissions enforced via `usePermission()` hook and server middleware:
  - `create_app`, `deploy_app`, `manage_billing`, `view_analytics`, `claim_fees`, `manage_team`, `edit_code`, `manage_templates`, `feature_app`, `view_feedback`, `manage_onboarding`.

### 5. Farcaster Hubs Direct Sync
- Connect Farcaster ID (FID).
- Broadcast launch announcements directly to `/base`, `/frames`, `/dev`, or `/vibecoding`.
- Synchronized across global Nemes Hub nodes with domain association verification.

### 6. User Profile System & Guided Onboarding Tour
- Custom usernames, handles, bios, avatars, and social links (X, Farcaster FID, GitHub, website).
- Interactive 5-step guided onboarding walkthrough covering value proposition, templates, fee splits, multi-platform deployment, and collaboration.
- Restartable anytime from the top navigation bar or user profile settings!

### 7. Community Feedback Mechanism & Social Sharing
- 1–5 star rating and review modal prompted after an app reaches `live` status.
- One-click launch announcement to X (Twitter) and Warpcast with prefilled tags.
- Copyable Frame v2 HTML meta tags and mobile QR code simulator.

### 8. Featured Apps Curation
- Dedicated "Featured Apps" showcase section on homepage & Explore page.
- Admin pin/unpin toggles for curated discovery.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router pattern) + React 19 + TypeScript + Tailwind CSS v4 + Motion
- **Design System**: Cyberpunk Glassmorphism, Neon Flash Glows, Orbitron + Plus Jakarta Sans + JetBrains Mono
- **Onchain Architecture**: Base L2, Clanker-style Bonding Curves, Farcaster Frames v2, Farcaster Hubs
- **Database Schema**: Prisma ORM with full 2.0 models (`UserProfile`, `AppTemplate`, `AppFeedback`, `CollaborationPresence`, `BuildJob`, `FarcasterConnection`)

---

## 💻 Local Development

```bash
# Clone the repository
git clone https://github.com/viniapp-builds/viniapp-platform.git
cd viniapp-platform

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 🚢 Vercel One-Click Deployment

1. Push your repository to GitHub.
2. Import the project in Vercel.
3. Configure `vercel.json` (included in repository for Farcaster Frame header support).
4. Deploy!

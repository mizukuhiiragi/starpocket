# 🌟 StarPocket — Stellar Community Fund (SCF) Grant Application Dossier

**Project Name:** StarPocket  
**Category:** Consumer Wallets / Telegram Mini Apps (TMA) / DeFi & Onboarding  
**Target Grant Track:** SCF Build Track ($30,000 – $50,000 in XLM)  
**Website / Demo:** [http://localhost:3001](http://localhost:3001) (Testnet Live)  
**License:** Open Source (MIT)  

---

## 1. Executive Summary

**StarPocket** is a non-custodial Web3 smart wallet and yield portal built natively as a **Telegram Mini App (TMA)** on the **Stellar Network** & **Soroban**.

While Telegram's 900+ million active users have catalyzed massive onboarding for chains like TON via micro-incentives and in-chat mini apps, the **Stellar Network is fundamentally superior for this use case** due to its sub-second predictability, 3-5 second finality, and virtually non-existent transaction fees ($0.00001 / 0.00001 XLM).

StarPocket solves the single biggest flaw of crypto faucets and onboarding apps: **the depletion trap**. StarPocket introduces a **Self-Sustaining Closed-Loop Flywheel**:
1. Users receive micro-incentivized daily XLM drops sponsored by Web3 video ads (AdsGram).
2. Users manage multi-assets (XLM, native USDC, yXLM, yUSDC) directly within Telegram without leaving their chat.
3. Users earn passive yield via **Star Vault** (5.0% APY auto-compounding via UltraStellar yield assets).
4. Users trade tokens via **Star Swap**, where a **0.3% protocol fee is routed 100% directly back into the Daily Drop reward pool**, creating an infinite, self-funding onboarding engine for the Stellar ecosystem.

---

## 2. Problem Statement

1. **High Friction in Mainstream Onboarding:**  
   Downloading standalone wallet apps, memorizing 24-word seed phrases, and funding gas fees through centralized exchanges creates an insurmountable 95% drop-off rate for Web2 users.
2. **The Faucet Depletion Problem:**  
   Most Web3 faucets are short-lived marketing stunts. Once grant or developer treasury funds run out, user retention plummets to zero because there is no revenue mechanism to refill the pool.
3. **Underutilization of Stellar in the TMA Boom:**  
   The explosive growth of Telegram Mini Apps in 2024–2026 proved that in-chat micro-interactions are the #1 onboarding vehicle in crypto history. Yet, Stellar—the most battle-tested, high-throughput, micro-payment L1—has lacked a flagship Telegram Mini App wallet that combines onboarding rewards, multi-asset trading, and passive yield.

---

## 3. The StarPocket Solution

```
               ┌────────────────────────────────────────────────────────┐
               │              900M+ TELEGRAM USERS                     │
               └─────────────────────────┬──────────────────────────────┘
                                         │ 1-Click Launch (Zero Install)
                                         ▼
               ┌────────────────────────────────────────────────────────┐
               │           StarPocket Telegram Mini App                │
               │   • Non-custodial Ed25519 Browser Keypair / Passkey    │
               │   • Strict Global Compliance (English / USD Default)   │
               └─────────┬───────────────────┬──────────────────┬───────┘
                         │                   │                  │
    ┌────────────────────┴───┐   ┌───────────┴────────────┐  ┌──┴─────────────────────┐
    │     Daily Star Drop    │   │       Star Swap        │  │       Star Vault       │
    │  • 5 drops/day (15m cd)│   │  • Low-slippage DEX    │  │  • 5.0% APY Yield      │
    │  • AdsGram Video Ads   │   │  • 0.3% Protocol Fee   │  │  • yXLM & yUSDC Auto-   │
    │  • 1.0 XLM Activation  │   │    Recycled to Pool    │  │    Compounding Vault   │
    └────────────┬───────────┘   └───────────┬────────────┘  └────────────────────────┘
                 │                           │
                 │    ┌──────────────────────┘
                 ▼    ▼
      ┌─────────────────────────────────┐
      │  Self-Sustaining Reward Pool    │ ◄─── Ad Monetization Revenue
      │ (Infinite Onboarding Flywheel)  │
      └─────────────────────────────────┘
```

### Key Pillars:
1. **Instant, Non-Custodial Key Generation:**
   - Ed25519 cryptographic keypairs generated client-side inside the user's secure browser sandbox.
   - Private keys never touch any backend server.
   - Built-in transaction signing on-device via `@stellar/stellar-sdk`.
2. **Rewarding Daily Engagement (Daily Drop):**
   - 5 daily claims with a 15-minute stamina cooldown gauge.
   - Unfunded accounts receive automatic account activation (1.0 XLM Testnet welcome reserve).
   - Funded by high-CPM Web3 video ad impressions (AdsGram SDK integration) + Swap fees.
3. **Multi-Asset Portfolio (XLM, USDC, yXLM, yUSDC):**
   - Direct support for native Stellar USDC and UltraStellar yield-bearing tokens.
   - Real-time USD portfolio valuation and interactive send/receive modals with QR codes.
4. **Star Vault (5.0% APY):**
   - Simple deposit/withdraw interface enabling everyday users to compound rewards effortlessly into UltraStellar interest-bearing assets.
5. **Star Swap with Automated Protocol Recycling & Monthly Volume Bonus:**
   - 0.3% fee collected on all token swaps automatically credits the Faucet reward reserve.
   - **Monthly Swap Bonus (Volume Share Pool):** 30% of collected swap fees are pooled into an end-of-month dividend pool, shared proportionally with active traders based on their monthly volume. This drives industry-leading user retention (preventing end-of-month churn) and organic community volume without ongoing developer subsidies.
6. **Global Regulatory Compliance:**
   - English default (`en`), USD denominated (`$`), strictly decentralized non-custodial structure with localized language support (`🌐 EN / JA`), ensuring full compliance across all jurisdictions without specific regional solicitation.

---

## 4. Stellar Ecosystem Alignment & Impact

| Metric / Impact Area | StarPocket Contribution |
| :--- | :--- |
| **New User Acquisition** | Direct on-ramp pipeline targeting 900M+ active Telegram users worldwide. |
| **On-Chain Transactions** | Daily drops, Send, Receive, Swap, and Vault deposits generate active daily on-chain operations on Stellar Horizon / Soroban. |
| **Asset Circulation** | Promotes native Stellar USDC, yXLM, and yUSDC liquidity and utility. |
| **Soroban Adoption** | Upgrades the Vault and Swap router into native Soroban smart contracts, showcasing Stellar's Turing-complete capabilities to Web2 users. |
| **Public Good & Open Source** | Open-source MIT repository offering a plug-and-play Telegram Mini App boilerplate for all future Stellar developers. |

---

## 5. Roadmap & Milestone Deliverables

### 🏁 Milestone 1: Protocol Hardening & Soroban Smart Contracts (Months 1–2)
- **Deliverables:**
  - Migrate Star Vault and Star Swap protocol fee logic to formal Soroban Rust smart contracts.
  - Implement WebAuthn / Passkey integration for browser biometric signing (zero seed phrase burden).
  - Complete internal security & cryptographic audit.
  - Testnet deployment with full stress-testing under simulated 10,000 user concurrent load.
- **Budget Requested:** $15,000 USD (in XLM)

### 🚀 Milestone 2: Mainnet Launch & Ad Monetization Scaling (Months 3–4)
- **Deliverables:**
  - Mainnet deployment on Stellar public network.
  - Integration with live AdsGram mainnet ad inventory for positive cashflow monetization.
  - Direct integration with Stellar DEX orderbooks / Soroban AMM liquidity pools for Star Swap.
  - Initial Faucet liquidity buffer allocation (ensuring 100,000 initial user onboarding claims).
- **Budget Requested:** $20,000 USD (in XLM)

### 📈 Milestone 3: Global Growth, Gamification & Ecosystem Quests (Months 5–6)
- **Deliverables:**
  - Multi-tier viral referral program ("Invite a friend, earn 10% of their ad drop bonus").
  - Gamified Stellar Quests (e.g., "Make your first swap", "Hold 10 USDC", "Deposit in Star Vault").
  - Multilingual localized support expanded to Spanish, Russian, Indonesian, and Vietnamese.
  - Target: 100,000+ monthly active wallets on Stellar.
- **Budget Requested:** $15,000 USD (in XLM)

**Total Requested Funding:** **$50,000 USD (payable in XLM)**

---

## 6. Budget Allocation Breakdown

```
┌──────────────────────────────────────────────┬──────────┬────────┐
│ Item / Purpose                               │ Amount   │ Ratio  │
├──────────────────────────────────────────────┼──────────┼────────┤
│ Soroban Smart Contract Dev & Security Audit  │ $18,000  │ 36%    │
│ Stellar Mainnet Faucet Liquidity Buffer      │ $12,000  │ 24%    │
│ Frontend & TMA UX Optimization (Passkeys)    │ $10,000  │ 20%    │
│ Cloud Infrastructure, Horizon Relay & RPCs   │ $4,000   │  8%    │
│ Growth, Telegram Community & User Support    │ $6,000   │ 12%    │
├──────────────────────────────────────────────┼──────────┼────────┤
│ TOTAL                                        │ $50,000  │ 100%   │
└──────────────────────────────────────────────┴──────────┴────────┘
```
*(Note: Once the initial $12,000 liquidity buffer is deployed, the 0.3% Star Swap fee + AdsGram ad monetization will permanently replenish the pool, making StarPocket 100% self-sufficient.)*

---

## 7. Current Technical Status & Proof of Execution

- **Working Testnet MVP:** Fully functional and demonstrated on port 3001.
- **Backend Relay:** Express.js + `@stellar/stellar-sdk` handling Horizon Testnet calls, rate limiting, and automated account activation.
- **Frontend:** React 19 + Vite + Tailwind CSS v4 + Telegram WebApp SDK + Haptic Feedback.
- **Assets Configured:** Native XLM, USDC, UltraStellar yXLM, and yUSDC.
- **Repository:** Fully documented, ready for open-source inspection on GitHub.

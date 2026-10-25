# 🌟 StarPocket — Telegram Smart Wallet, Yield Vault & DEX for Stellar & Soroban

[![Stellar Network](https://img.shields.io/badge/Stellar-Testnet-blue?logo=stellar&style=flat-square)](https://stellar.org)
[![Telegram Mini App](https://img.shields.io/badge/Telegram-Mini%20App%20(TMA)-229ED9?logo=telegram&style=flat-square)](https://telegram.org)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&style=flat-square)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&style=flat-square)](https://vitejs.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/TailwindCSS-v4.0-38B2AC?logo=tailwind-css&style=flat-square)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](https://opensource.org/licenses/MIT)

> **StarPocket** is a high-speed, non-custodial smart wallet, 5.0% APY auto-compounding yield vault, and low-slippage DEX built natively as a Telegram Mini App for the 900M+ users of Telegram on the Stellar Network & Soroban.

---

## 🚀 Key Features

* **⚡ Instant Non-Custodial Onboarding:** Generates a full Ed25519 Stellar keypair client-side in sub-seconds. Users can immediately receive and transact without installing an external app or dealing with seed phrase barriers.
* **⭐ Micro-Incentivized Daily Drops:** 5 claims/day with a 15-minute stamina cooldown gauge. Unfunded accounts automatically receive a 1.0 XLM activation reserve. Integrated with AdsGram Web3 video advertising.
* **🔄 Self-Sustaining Swap Flywheel:** In-app token swap (XLM ⇄ USDC ⇄ yXLM ⇄ yUSDC). A **0.3% protocol fee is routed 100% directly back into the Daily Drop reward pool**, creating an infinite, self-funding community onboarding engine.
* **🏦 Star Vault (5.0% APY):** Seamless one-click deposit/withdraw into UltraStellar yield-bearing assets (`yXLM` and `yUSDC`), allowing everyday users to compound rewards effortlessly.
* **🌐 Global Regulatory Compliance & i18n:** Built strictly non-custodial, denominated in USD (`$`), and defaulted to English (`en`) for worldwide compliance, with an on-demand internationalization toggle (`🌐 EN / JA`).
* **📱 Native Telegram UX:** Full integration with Telegram WebApp SDK, including user context, haptic feedback, and one-tap viral share invites.

---

## 📐 System Architecture

```
                                  [ Telegram User ]
                                         │
                                         ▼
                     ┌───────────────────────────────────────┐
                     │    StarPocket Telegram Mini App       │
                     │  (Client-Side Ed25519 / React 19)     │
                     └───────┬───────────────────────┬───────┘
                             │                       │
           Direct Signed TXs │                       │ Claims & API Relays
                             ▼                       ▼
            ┌────────────────────────────────┐   ┌───────────────────────────┐
            │  Stellar Horizon / Soroban RPC │   │    StarPocket Relay API   │
            │  (https://horizon-testnet...)  │   │  (Node.js / Express 5)    │
            └────────────────────────────────┘   └─────────────┬─────────────┘
                             ▲                                 │
                             │ Executes Faucet & Pool Refill   │
                             └─────────────────────────────────┘
                                               │
                                 ┌─────────────┴─────────────┐
                                 │                           │
                                 ▼                           ▼
                     ┌───────────────────────┐   ┌───────────────────────┐
                     │   AdsGram Video Ads   │   │   0.3% Star Swap Fee  │
                     │   (Monetization)      │   │   (Protocol Recycle)  │
                     └───────────────────────┘   └───────────────────────┘
```

---

## 🛠️ Tech Stack

* **Frontend:** React 19, Vite, Tailwind CSS v4, Lucide React, Canvas Confetti
* **Stellar Integration:** `@stellar/stellar-sdk` v17, Stellar Horizon Testnet API
* **Backend Relay:** Node.js (ESM), Express 5, CORS, Stellar Keypair generation & pool manager
* **Monetization & Ads:** AdsGram SDK (`adsgram.ai`) with built-in high-fidelity fallback simulator
* **Internationalization:** Custom zero-dependency i18n dictionary (`src/i18n.js`)

---

## ⚡ Quick Start

### 1. Prerequisites
- Node.js 18+
- pnpm or npm

### 2. Installation
```bash
git clone https://github.com/your-username/starpocket.git
cd starpocket
pnpm install
```

### 3. Build & Run Fullstack Server
```bash
# Build the production frontend bundle
pnpm build

# Start the StarPocket fullstack backend & client server
node server.js
```
The application will be live at `http://localhost:3001`.

### 4. Local Development (Hot Reloading)
```bash
# In terminal 1: Start backend API
node server.js

# In terminal 2: Start Vite dev server with proxy to :3001
pnpm dev
```
Open `http://localhost:3000` for hot-reload development.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/user-status/:address` | Get daily claim count, remaining claims, and cooldown timer |
| `POST` | `/api/claim` | Execute daily drop (activates new account or pays 0.05 XLM) |
| `GET` | `/api/faucet` | Retrieve current faucet pool address, balance, and network info |
| `GET` | `/api/balance/:address` | Fetch on-chain balances for XLM, USDC, yXLM, and yUSDC |
| `GET` | `/api/vault/:address` | Fetch user's Star Vault deposit balances & estimated daily yield |
| `POST` | `/api/vault/deposit` | Deposit assets into Star Vault (converts to y-assets) |
| `POST` | `/api/vault/withdraw` | Withdraw assets from Star Vault |
| `GET` | `/api/swap/rates` | Fetch real-time AMM swap conversion rates |
| `POST` | `/api/swap` | Execute token swap and route 0.3% fee to faucet reserve |

---

## 🤝 Stellar Community Fund (SCF) Grant

StarPocket is actively preparing submission for the **Stellar Community Fund (SCF)**.
Full proposal documentation, milestones, and ecosystem impact can be reviewed in:
👉 [**SCF_APPLICATION.md**](./SCF_APPLICATION.md)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

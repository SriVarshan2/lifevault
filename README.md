# **Life Vault — Your Medical Identity. Always Ready.**

> "In 2024, an estimated 250,000 people die annually in the US from medical errors. A significant subset of these are preventable with basic information — blood type, known allergies, current medications — that first responders simply didn't have access to in time. This is not a technology problem. Every person already carries the solution in their pocket. Life Vault puts critical medical data where it belongs: accessible in under 10 seconds, without an app, without a login, without internet."

**Privacy-First Identity • High-Density Clinical Data • Zero Cloud Storage**
**Next.js • React • Offline-Ready • 8-Second Assessment**

<div align="center">
  <img src="https://img.shields.io/badge/Privacy-Zero%20Cloud-red?style=for-the-badge" />
  <img src="https://img.shields.io/badge/System-Offline%20First-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Speed-8%20Sec%20Scan-success?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Vitals-Real%20Time%20Tracking-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Status-Production%20Ready-green?style=for-the-badge" />
</div>

<div align="center" style="margin-top: 2rem;">
  <a href="http://lifevault-seven.vercel.app">
    <img src="https://img.shields.io/badge/SEE%20LIVE%20DEMO-lifevault--seven.vercel.app-dc2626?style=for-the-badge&logo=vercel" height="40" />
  </a>
</div>

---

## 📚 Table of Contents

* [Overview](#overview)
* [What Makes It Different](#what-makes-it-different)
* [Core Experience](#core-experience)
* [The 8-Second Rule](#the-8-second-rule)
* [Folder Structure](#folder-structure)
* [Technical Pipeline](#technical-pipeline)
* [Tech Stack](#tech-stack)
* [Running Locally](#running-locally)
* [Why Life Vault?](#why-life-vault)

---

## ✚ Overview

**Life Vault** is a high-density clinical identity system designed for the most critical moments.

Traditional medical IDs (like Apple’s Health or Android’s Emergency Info) are often too basic, requiring multiple taps and providing limited context. In a medical emergency, every second counts.

Life Vault provides **paramedic-grade data in under 8 seconds** — without needing an internet connection, a cloud account, or a database.

Your data never leaves your device.
It is stored locally.
It is shared only when you choose to show your vault.

---

## ✨ What Makes It Different

| Traditional Medical IDs | Life Vault                         |
| ------------------------ | ---------------------------------- |
| Limited clinical fields  | High-density clinical data         |
| Cloud dependency         | **Zero** Cloud Storage (Local Only)|
| 15-20s access time       | **< 8-Second** Assessment Window   |
| Static Information       | Dynamic Vitals & Sugar Mapping     |
| Privacy: Data Harvested  | Privacy: Data stays in your pocket |

This is **not** a health-tracking app.
It is a **life-saving protocol**.

---

## 🎨 Core Experience

1. **Local Vault Creation**: Users input clinical-grade data (Blood Type, Allergies, Conditions, Vitals).
2. **Offline-First Storage**: Data is stored securely in the browser's local memory (localStorage/crypto).
3. **8-Second QR Access**: Encoded, high-density QR codes provide instant data to responders.
4. **Dynamic Vitals**: Real-time tracking of blood sugar and medical history.
5. **Emergency Contact (ICE)**: One-tap calling for primary emergency responders.

The user remains the sole owner of their identity.

---

## 🏗️ The "Bridge" Architecture

Life Vault isn't just a website; it’s a **digital-to-physical bridge**. 

While many apps rely on constant connectivity, Life Vault allows users to generate and print a **High-Density QR ID (Clinical Mode)**. This physical backup contains your entire emergency summary in a format that works in hospital basements, rural areas, and disaster zones with **zero internet**. It transforms a piece of paper or a lock-screen sticker into a clinical-grade data terminal.

---

## 🛡️ Proactive vs. Reactive Safety

Most health apps are **reactive**: they store data and wait for you to find it. Life Vault’s **Safety Timer** is **proactive**. 

Whether you're going for a solo run, walking home late, or managing a chronic condition, the Safety Timer watches over you. If you don't check in, Life Vault initiates its emergency protocol automatically—so you don't have to reach for your phone in a crisis. It shifts the burden of safety from the victim to the system.

---

## 🧠 AI Intelligence with "Safe Fallback"

The Life Vault **Triage System** is designed for the high-stakes environment of a hospital basement where APIs fail. 

It uses a **robust rule-based engine first**, meaning it has medical "common sense" baked directly into the local client-side code. While it can leverage AI for complex analysis when online, its core triage logic remains fully functional offline. It’s an intelligent system that never forgets its primary mission just because it lost a signal.

---

## ⚡ The 8-Second Rule

In a crisis, paramedics have a "golden window" for assessment. Life Vault is engineered around this constraint:

* **Scan**: 1.5 seconds.
* **Decode**: 0.5 seconds.
* **Review**: 6.0 seconds.

Our compressed QR encoding ensures that even under poor lighting or with older camera hardware, the critical data payload is delivered instantly.

---

## 📁 Folder Structure

```text
lifevault/
├─ README.md
│
├─ src/
│  ├─ app/
│  │  ├─ medical-id/           # The high-density responder view
│  │  ├─ vault/                # User dashboard & clincal data entry
│  │  ├─ form/                 # Rapid onboarding flow
│  │  └─ api/triage/           # AI-assisted emergency logic
│  │
│  ├─ components/
│  │  ├─ EmergencyQR.tsx       # Compressed QR generation engine
│  │  ├─ PdfCertificate.tsx    # Physical backup generation
│  │  ├─ AiTriage.tsx          # Emergent symptom analysis
│  │  └─ VoiceResponder.tsx    # Accessibility for responders
│  │
│  ├─ lib/
│  │  ├─ qr-logic.ts           # High-density encoding protocols
│  │  ├─ crypto.ts             # Local encryption utilities
│  │  └─ storage.ts            # Persistence logic (Zero Cloud)
│  │
│  └─ types.ts                 # Strict clinical data schemas
│
└─ public/
   └─ manifest.json            # PWA configuration for offline access
```

---

## 🔁 Technical Pipeline

### 🔒 Data Lifecycle

1. **Input**: User enters clinical data via the Form component.
2. **Encryption**: Data is salted and hashed locally (client-side).
3. **Persistence**: Saved to LocalStorage (no backend required).
4. **Encoding**: `qr-logic.ts` compresses data into a high-density payload.
5. **Display**: `EmergencyQR.tsx` renders the optimized SVG for responders.

---

## 🧪 Tech Stack

### Frontend
* **Framework**: [Next.js](https://nextjs.org/) (App Router)
* **Logic**: React 19 + TypeScript
* **Styling**: Tailwind CSS
* **Animations**: Framer Motion
* **Visuals**: Lucide React + Recharts (for vitals)
* **QR Engine**: qrcode.react (High-density SVG mode)

### Security
* **Protocol**: Zero-Knowledge (Local Only)
* **Encryption**: Web Crypto API / SHA-256
* **Offline**: PWA / Service Workers

---

## ▶ Running Locally

### Installation

```bash
git clone https://github.com/SriVarshan2/lifevault.git
cd lifevault
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access your vault.

---

## 🌐 Deployment

Recommended for maximum reliability:
* Deploy as a **Static Site (SSG)** on Vercel or Netlify.
* Enable **PWA** support via the web manifest for true offline functionality.

---

## 💭 Why *Life Vault*?

> “Standard medical IDs are for convenience. Life Vault is for survival.”

Life Vault explores what happens when:
* Privacy is absolute.
* Speed is the primary metric.
* Data is clinical, not social.
* You are the only source of truth for your own life.

It is not about tracking steps.
It is about being ready for the step you can't see coming.

---

<p align="center" style="font-size:18px; color:#dc2626;">
  <i><b>“The data lives in your pocket. The peace of mind lives in your head.”</b></i>
</p>

---

# 🎮 PlayWise — Play More. Spend Smarter.

PlayWise is a gaming-focused spending intelligence application designed to help students and gamers track digital expenses, manage subscriptions, make informed gaming purchases, split team expenses, and identify potentially suspicious gaming offers.

Instead of only recording spending after a transaction, PlayWise aims to help users make better decisions before spending money.

<p align="center">
  <a href="https://play-wise-iqoo-hackathon.vercel.app/"><strong>🚀 Live Demo</strong></a>
  &nbsp; | &nbsp;
  <a href="https://github.com/Varshitha-567/PlayWise-IQOO-Hackathon"><strong>💻 Source Code</strong></a>
</p>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Our Solution](#-our-solution)
- [Core Features](#-core-features)
- [How It Works](#-how-it-works)
- [Technology Stack](#-technology-stack)
- [Core Algorithms](#-core-algorithms)
- [System Architecture](#-system-architecture)
- [Getting Started](#-getting-started)
- [Current Scope and Limitations](#-current-scope-and-limitations)
- [Future Enhancements](#-future-enhancements)
- [Project Links](#-project-links)

## 📖 Overview

Digital payments have become common among students and gamers. Expenses for gaming purchases, subscriptions, cloud storage, digital entertainment, and team activities can be spread across multiple payment methods and platforms.

PlayWise explores a unified approach to digital spending management by combining subscription tracking, gaming expense analytics, purchase evaluation, team expense splitting, and gaming-commerce risk assessment.

**Project:** PlayWise  
**Tagline:** Play More. Spend Smarter.  
**Domain:** FinTech & Commerce  

## 🎯 Problem Statement

Students and gamers often face four key challenges:

- **Unnoticed renewals:** Recurring subscriptions can renew without users reviewing their value.
- **Subscription waste:** Unused or overlapping plans can create avoidable expenses.
- **Impulse purchases:** Gaming purchases can exceed monthly budgets.
- **Suspicious gaming offers:** Fake top-up offers and unverified payment destinations can put users at risk.

Traditional expense tracking primarily shows users what they have already spent. PlayWise focuses on adding decision support before a purchase and visibility into upcoming commitments.

## 💡 Our Solution

PlayWise acts as a decision-intelligence layer for gaming commerce.

The solution combines three capabilities:

1. **Understand:** Categorize transactions, identify recurring payments, and summarize spending.
2. **Decide:** Evaluate planned purchases against budgets, expected usage, and personal preferences.
3. **Protect:** Assess gaming offers and payment destinations using explainable risk rules.

The goal is to provide actionable recommendations with understandable reasons rather than generic warnings.

## ✨ Core Features

### 1. Subscription Radar

- Identify potentially recurring transactions.
- Estimate billing cycles and upcoming renewal dates.
- Display subscription costs and potential annual commitments.
- Present Keep, Review, or Pause recommendations.

### 2. Waste Detector

- Highlight potentially unused or overlapping subscriptions.
- Surface plans that may deserve a review.
- Estimate potential savings from reviewing recurring expenses.

### 3. GamerWallet

- Categorize gaming transactions.
- Track monthly gaming budgets.
- Display spending by category or game.
- Calculate budget utilization and remaining balance.
- Highlight spending that reaches configured alert thresholds.

### 4. Purchase Evaluator

Evaluate a planned purchase using:

- Purchase price
- Remaining budget
- Expected usage hours
- Enjoyment rating
- Long-term value rating
- Typical spending context

The evaluator produces a Buy, Wait, or Review recommendation based on the configured decision logic.

### 5. Team Wallet

- Record shared gaming or tournament expenses.
- Track expense splits between team members.
- Show collected and pending amounts.
- Help users review outstanding payments.

### 6. Gaming Commerce Guard

Assess potentially suspicious offers using signals such as:

- Merchant verification status
- Payment ID mismatch
- Unusually large discounts
- Suspicious URLs
- Risk-related keywords

The rule engine produces a risk score and a LOW, MEDIUM, or HIGH classification with reasons for the result.

**Note:** A rule-based risk score is a screening aid, not proof that a merchant is legitimate or fraudulent.

## 🔄 How It Works

1. **Input:** Receive spending context from mock transaction data, planned purchases, or supported receipt/screenshot input.
2. **Processing:** Parse transaction fields, normalize merchant names, and categorize expenses.
3. **Decision intelligence:** Apply subscription detection, budget calculations, purchase evaluation, and risk-scoring rules.
4. **Results:** Present categorized transactions, renewal alerts, budget insights, purchase recommendations, and risk assessments.

Mock transaction import and planned purchase entry are described as MVP inputs. Screenshot and receipt OCR should be treated as a future capability unless implemented in the current codebase.

## 🛠️ Technology Stack

The project documentation specifies the following technologies. Verify them against the actual repository before publishing.

| Component | Technology |
|---|---|
| User interface | React.js |
| Programming language | TypeScript |
| Development and build tooling | Vite |
| Styling | Tailwind CSS |
| Mobile application packaging | Capacitor |
| Android development environment | Android Studio |
| State management | React Hooks and Context API |
| Decision logic | Rule-based recommendation engines |
| Analytics | Spending categorization, budget calculations, and risk scoring |

## 🧠 Core Algorithms

### Recurring Transaction Detection

The algorithm groups transactions by merchant, sorts them by date, and evaluates intervals between transactions.

- Checks whether payment intervals are consistent.
- Uses a tolerance of approximately three days for recurring patterns.
- Detects monthly and quarterly billing cycles.
- Flags uncertain patterns for user confirmation.

### Budget Utilization Tracker

The budget engine calculates spending for the current month and compares it with the configured budget.

**Budget utilization:**

`(Total spending / Monthly budget) × 100`

The proposed logic specifies alerts at 80% and 100% budget utilization.

### Gaming Commerce Risk Scoring

The rule-based scoring model uses the following risk signals:

| Signal | Score contribution |
|---|---:|
| Unverified merchant | +35 |
| Discount of at least 50% | +25 |
| Payment ID mismatch | +20 |
| Suspicious URL | +20 |
| Risk-related keywords | +10 |

Risk classification:

- **LOW:** Score below 30
- **MEDIUM:** Score from 30 to 59
- **HIGH:** Score of 60 or above

These are the documented scoring rules. Confirm that the current implementation uses the same weights and thresholds.

## 🏗️ System Architecture

The proposed architecture consists of four stages:

- **Sources:** Mock transaction records, planned purchases, and potential receipt inputs.
- **Ingestion:** Extract merchant, amount, date, and payment method into structured records.
- **Intelligence:** Normalize merchant names, categorize spending, calculate budget impact, evaluate purchase value, and assess risk.
- **Outputs:** Categorized transactions, budget alerts, purchase recommendations, and risk assessments.

The intended design emphasizes local processing of spending information. Actual offline behavior and supported input sources should be verified against the implementation.

## 🚀 Getting Started

### Prerequisites

- Git
- Node.js
- npm
- Android Studio, if building the Android application

### 1. Clone the repository

```bash
git clone https://github.com/Varshitha-567/PlayWise-IQOO-Hackathon.git
```

### 2. Navigate to the project directory

```bash
cd PlayWise-IQOO-Hackathon
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

Open the local URL displayed in the terminal.

### 5. Build the application

```bash
npm run build
```

Check `package.json` for the available scripts and resolve any build errors before deployment.

### 6. Run the Android version

If the project uses Capacitor, verify that the Android platform is configured and follow the project's existing Android build workflow in Android Studio.

## ⚠️ Current Scope and Limitations

- Screenshot and receipt OCR are identified as future capabilities.
- Risk scores are based on configured rules and are not definitive fraud detection.
- Displayed transactions and financial amounts should be treated as demo data unless verified against authorized real data sources.
- Automatic subscription cancellation and actual payment execution should not be assumed.

Confirm the status of these capabilities against the current codebase before publishing.

## 🔮 Future Enhancements

- On-device screenshot and receipt OCR.
- Improved merchant normalization and recurring-payment detection.
- Configurable budgets and notification preferences.
- More detailed subscription usage insights.
- Expanded team expense settlement workflows.
- Automated testing of purchase recommendations and risk rules.
- Verified gaming accessory marketplace integrations.
- Optional platform integrations with appropriate user consent and security safeguards.


## 🔗 Project Links

- **Live Demo:** https://play-wise-iqoo-hackathon.vercel.app/
- **GitHub Repository:** https://github.com/Varshitha-567/PlayWise-IQOO-Hackathon

---

*PlayWise — Play More. Spend Smarter.*

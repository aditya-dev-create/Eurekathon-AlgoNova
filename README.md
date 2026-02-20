# Antigravity Behavioral Credit Intelligence Platform

## Overview
Antigravity is a production-grade Behavioral Credit Intelligence Platform designed to score unbanked and underbanked populations. It leverages financial stability, behavioral patterns, and psychometric signals to create a more inclusive and accurate credit risk profile.

## Core Features
- **Digital Identity & Onboarding**: Comprehensive profile creation for structural risk assessment.
* **Behavioral Risk Assessment**: A psychometric quiz engine that evaluates impulse control, integrity, and financial discipline.
- **TrustSimulator Engine**: A real-time simulator to model credit score evolution based on alternative data points (UPI activity, savings ratio, etc.).
- **Scoring Pipeline (`antigravity_core.py`)**: An institutional-grade Python pipeline for Weight of Evidence (WoE) binning and Logistic Regression modeling.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, shadcn-ui.
- **Backend/Modeling**: Python (Pandas, Scikit-learn).
- **Architecture**: Privacy-first local processing with modular intelligence.

## Getting Started

### Local Development
```sh
# 1. Install dependencies
npm i

# 2. Run the platform
npm run dev
```

### Modeling Pipeline
```sh
# Run the core scoring logic
python antigravity_core.py
```

## Mission
To leverage alternative data and behavioral science to bridge the global financial inclusion gap.

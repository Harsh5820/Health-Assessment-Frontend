# Technical Decisions & Architectural Reasoning

This document outlines the core architectural choices made during the development of the Patient Health Assessment & AI Wellness Dashboard. It details the reasoning behind selected technologies and highlights why alternative approaches were bypassed.

---

## 1. Stack Selection (MERN over Next.js/SQL)

### Frontend: React + Vite (Over Next.js)
While Next.js is highly popular for Server-Side Rendering (SSR) and SEO-heavy applications, a medical dashboard is primarily an authenticated, gated application where SEO is entirely irrelevant. 
- **Reasoning:** A Single Page Application (SPA) built with React and Vite offers incredibly fast client-side navigation. Vite provides instant Hot Module Replacement (HMR) and significantly faster build times than Create React App or Next.js, vastly improving developer velocity without the unnecessary overhead of server-side Node rendering.
- **Vercel Routing:** To handle React Router's client-side history gracefully in production, a `vercel.json` file was configured to execute URL rewrites back to `index.html`.

### Backend: Node.js + Express (Over Django/Spring Boot)
- **Reasoning:** Utilizing a unified language (JavaScript) across both the client and server drastically reduces context-switching and allows for seamless code and logic sharing. Express remains the most unopinionated, lightweight, and scalable framework for purely RESTful JSON APIs.

### Database: MongoDB via Mongoose (Over PostgreSQL/MySQL)
Health reports contain dynamic, highly variant data attributes. A generic blood test could have 10 parameters, while a metabolic panel might have 30. 
- **Reasoning:** MongoDB's document-based NoSQL structure effortlessly accommodates schema flexibility. If the clinic decides to add "Cortisol Levels" to their Excel uploads tomorrow, MongoDB handles it without requiring complex SQL schema migrations (`ALTER TABLE`). We structured it relationally using Mongoose `ObjectId` references to link `Reports` back to `Users` for high-speed, indexed queries.

---

## 2. File Upload & Data Processing

### Multer Memory Storage (Over Disk Storage)
When admins upload thousands of patient reports via `.xlsx` or `.csv`, the file must be parsed and mapped to the database.
- **Approach Considered:** Using standard `multer` disk storage to save the file to a `/uploads` folder, processing it, and then running a cron job to delete it.
- **Approach Chosen:** We bypassed disk storage entirely and used `multer.memoryStorage()`. 
- **Reasoning:** Saving files to the disk introduces severe I/O bottlenecks and bloats the server filesystem (requiring cleanup scripts). By piping the file directly into a RAM buffer and having the `xlsx` library parse it immediately, the data is pushed to MongoDB in milliseconds and the buffer is instantly garbage-collected by V8. This makes the `/api/admin/upload` endpoint infinitely scalable on ephemeral cloud hosts like Render.

---

## 3. Generative AI Architecture

### Google Gemini API Integration (Over OpenAI GPT / Rule-Based Logic)
The requirement was to provide health tips based on failing test parameters. 
- **Approach Considered:** A static, hard-coded rule engine (e.g., `if (vitamin_d < 30) return "Get more sun"`). This is easy to build but rigid and highly unpersonalized.
- **Approach Chosen:** We integrated the `@google/generative-ai` SDK on the backend. We chose the **Gemini-3.5-Flash** model.
- **Reasoning:** Gemini-3.5-Flash was strictly selected for its extremely low latency and high cost-efficiency compared to Pro models, which is crucial for synchronous dashboard rendering. By combining the patient's exact out-of-range metrics (calculated locally) with their specific "Beauty Goal" and "Health Condition", the LLM infers incredibly personalized cross-disciplinary advice (e.g., tying Vitamin D deficiency to a Diabetic patient's wound healing goals) that a static logic tree could never accomplish.

---

## 4. UI/UX Component Architecture

### The `UserProfileView` Extraction
Initially, the Patient Dashboard and the Admin's "View Details" modal were entirely separate components. This led to code duplication and visual inconsistencies.
- **Reasoning:** I aggressively refactored the UI to extract the core visual layer into a single, highly prop-driven `UserProfileView.jsx` component. 
- **Impact:** Now, when an Admin clicks a patient, they render the exact same component the patient uses. If we add a new chart or AI feature to the patient view, it instantly propagates to the Admin dashboard, adhering strictly to the **DRY (Don't Repeat Yourself)** principle.

### Qualitative vs Quantitative Data Rendering
The `HealthMetricsTracker.jsx` was built with a generic engine. However, medical tests like "Urine Protein" return qualitative strings (e.g., "Nil", "Trace") rather than numeric values.
- **Reasoning:** I modified the core mapping algorithm to identify `isString` properties. It intelligently bypasses the percentage-delta math engine (preventing `NaN` crashes) and instead uses a keyword-based rule engine (searching for "Nil", "Negative", "Absent") to assign Healthy or Warning badges, allowing both data types to render flawlessly side-by-side in the same grid.

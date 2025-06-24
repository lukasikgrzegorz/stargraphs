# Product Requirements Document (PRD) – **Star Graphs**

## 1. 🪐 Product Overview

**Star Graphs** is an interactive web application for generating stylized infographics about movies and characters from Hollywood. Users enter a movie name or actor and choose an infographic style, and the system generates a unique, interactive graphical representation of the data.

The technology is based on:
- **Frontend**: [Next.js](https://https://nextjs.org/) + JavaScript,
- **Backend**: [Supabase](https://supabase.com/) + [n8n](https://n8n.io/) (automation),
- Style: themes referencing cosmic and retro-futuristic aesthetics.

---

## 2. 🚀 User Problem

Users want to quickly and effectively present information about actors, movies, or film series. However, there's a lack of easy tools that would allow generating visually attractive infographics without the need to use advanced graphic design software.

---

## 3. 🧩 Functional Scope

### 🖥️ Homepage
- Application title and brief description of its functionality.
- Hero image/animation inspired by Star Wars.
- Section with **3 latest infographics** (thumbnails + links).
- Creative footer.

### 🎛️ Infographic Generator
- Form with fields:
  - `Phrase` – movie name, actor, character related to cinematography,
  - `Graphic style` – e.g., classic, neon, holo-map.
- `Generate Infographic` button.
- After submission – redirect to unique generated infographic page.

### 🌌 Infographic Page
- Dynamic data loading based on ID/hash.
- Infographic view with ability to:
  - Download graphic (PNG/SVG),
  - Share link (social media)

---

## 4. 🧪 Technology

| Layer       | Technology                 |
|-------------|----------------------------|
| Frontend    | Next.js + JavaScript       |
| Styling     | TailwindCSS (cosmic aesthetics) |
| Backend     | Supabase (database, storage) + Node.js for generating graphic files |
| Automation  | n8n (API, data generation, LLM integrations) |
| Privacy     | Cookie-free design, minimal data collection |

---

## 5. 🛡️ Privacy & Data Principles

**Star Graphs** follows a privacy-first approach:
- **Cookie-free experience** – no tracking cookies or unnecessary data collection
- **Minimal data storage** – only essential information for infographic generation
- **No personal data retention** – user inputs are processed and not permanently stored
- **Transparent data usage** – clear information about what data is used and why
- **Data minimization** – collect only what's absolutely necessary for functionality

---

## 6. 🛑 MVP Boundaries

MVP **does not include**:
- Drag & drop editor,
- Color/theme personalization,
- Advanced content moderation,

---

## 7. 👤 User Stories

### US-001 – Homepage
**As** a user visiting the site,  
**I want** to see an example of the application in action,  
**so that** I can understand its functionality and proceed to the generator.

**Acceptance criteria**:
- Visible header with project mission,
- Section with 3 latest infographics (thumbnails with links),
- Styling referencing Star Wars,
- Link to generator.

---

### US-002 – Infographic Generator
**As** a user interested in a movie or actor,  
**I want** to enter a phrase and generate an infographic,  
**so that** I receive a visual representation of the data.

**Acceptance criteria**:
- Form allows entering phrase, type, style,
- Button generates query and saves result in Supabase,
- Redirect to unique infographic page.

---

### US-003 – Infographic Page
**As** a user,  
**I want** to see the infographic in aesthetic form,  
**so that** I can download it or share it with friends.

**Acceptance criteria**:
- Infographic loaded dynamically from Supabase,
- Visible download and share buttons,
- Section with suggestions for similar infographics.

---

## 8. 📊 Success Metrics

- **≥ 70%** of users generate at least 1 infographic.
- **≥ 50%** of infographics are shared or downloaded.
- **≤ 30 seconds** – average graphic generation time.
- **≥ 95%** of queries completed successfully (without errors).

---

## 9. 🔭 Further Development (post-MVP)
- Custom color and graphic style editing,
- Mobile version as PWA,
- Ability to save collections (infographic sets),

---

> ✨ *Star Graphs is a combination of passion for cinema and design – all in the aesthetics of a distant galaxy…*
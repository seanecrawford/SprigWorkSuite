# Sprig Work Suite

[![Build Status](https://img.shields.io/github/actions/workflow/status/seanecrawford/SprigWorkSuite/main.yml?branch=main)](https://github.com/seanecrawford/SprigWorkSuite/actions)
[![License](https://img.shields.io/github/license/seanecrawford/SprigWorkSuite)](https://github.com/seanecrawford/SprigWorkSuite/blob/main/LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/seanecrawford/SprigWorkSuite)](https://github.com/seanecrawford/SprigWorkSuite/commits/main)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fworksuitepro.com)](https://worksuitepro.com)

**Live Site:** [https://worksuitepro.com](https://worksuitepro.com)  
**Repository:** [https://github.com/seanecrawford/SprigWorkSuite](https://github.com/seanecrawford/SprigWorkSuite)

---

## 🚀 Overview

**Sprig Work Suite** is an AI-powered digital workspace that simulates a virtual boardroom for enterprise decision-making. Role-based agents (CFO, CMO, Legal, PM) collaborate to generate actionable deliverables including:

- ✅ Task Definition Lists (TDL)
- ✅ Statements of Work (SOW)
- ✅ CRM-driven customer insights
- ✅ Asana-style task creation
- ✅ DocuSign-style e-signature flows
- ✅ Decision memo orchestration

Sprig Work Suite is deployed at [worksuitepro.com](https://worksuitepro.com) and actively maintained for production-grade experimentation.

---

## 🧰 Tech Stack

- **Frontend:** Next.js, Tailwind CSS, TypeScript
- **Backend:** Node.js (mock APIs)
- **Build Tools:** PostCSS, Vite
- **Deployment:** GitHub Pages with SPA fallback
- **Versioning:** `.version` file for release tracking
- **Environment:** `.nvmrc` for Node consistency

---

├── app/ # Core app logic ├── backend/ # Mock API endpoints ├── components/ # UI components ├── docs/ # Documentation ├── lib/ # Connectors and utilities ├── public/ # Static assets ├── types/ # Type definitions ├── index.html # Entry point ├── package.json # Dependencies ├── tailwind.config.js # Tailwind setup ├── vite.config.js # Vite setup ├── .nojekyll # GitHub Pages compatibility ├── CNAME # Custom domain mapping └── README.md # Project documentation


---

## 🌐 SEO & Indexing Strategy

Sprig Work Suite is configured for optimal search engine indexing:

- Custom domain via `CNAME` → [worksuitepro.com](https://worksuitepro.com)
- `.nojekyll` included for full asset indexing
- Semantic HTML and metadata embedded in `index.html`
- README includes keywords: *AI workspace*, *digital boardroom*, *task automation*, *SOW generation*, *CRM integration*, *DocuSign*, *Asana*, *Next.js*, *Tailwind*, *enterprise decision support*

### 🔎 JSON-LD Metadata (Add to `index.html`)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Sprig Work Suite",
  "url": "https://worksuitepro.com",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "creator": {
    "@type": "Person",
    "name": "Sean Crawford"
  },
  "description": "Sprig Work Suite is an AI-powered digital boardroom for enterprise teams, enabling task automation, CRM insights, and e-signature workflows.",
  "keywords": "AI workspace, digital boardroom, task automation, CRM integration, DocuSign, Asana, SOW generation, Next.js, Tailwind"
}
</script>

## 📁 Project Structure


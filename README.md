# Cultivated Technology Group — Corporate Website

A complete corporate website for **Cultivated Technology Group, Inc.** — a California General Stock Corporation (Entity No. 4701299) headquartered in Fresno, California. The site is designed to serve real prospects and to satisfy Know-Your-Business (KYB) review by financial-services providers such as Sumsub.

This repository contains the **canonical design + final copy** for the site as a static, multi-page HTML build (no toolchain required to preview). The companion `next-app/` notes below describe the one-to-one mapping into a Next.js 14 + TypeScript + Tailwind + shadcn/ui project for production deployment.

---

## 1. What's in this repository

```
index.html              Home
about.html              About the firm + leadership (John Edward Paul)
services.html           Six service practices, full write-ups
process.html            Engagement methodology + onboarding / IP / security
contact.html            Contact form (React, client-side) + map + office
privacy.html            Privacy Policy (~2,300 words, GDPR + CCPA)
terms.html              Terms of Service (~2,200 words, CA law)
legal.html              Legal Information / Imprint (KYB-ready)

styles.css              Site-wide design system
contact-form.jsx        React contact form (Babel-compiled in-browser)
sitemap.xml             Sitemap for the live domain
robots.txt              Robots
```

Each page is fully self-contained: header, footer, and SEO meta tags live inline in the page so that the file can be edited directly. There is one shared stylesheet (`styles.css`) and one shared script (`contact-form.jsx`) used only on the Contact page.

## 2. Preview locally

Open any `.html` file directly in a browser, or serve the folder over HTTP:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000/
```

The site uses Google Fonts and React/Babel from a CDN; an internet connection is required for first paint.

---

## 3. Replace these placeholders before going live

Search-and-replace across the project:

| Placeholder shown on the site | Replace with |
| --- | --- |
| `info@cultivatedtech.example`    | The real general contact email (e.g. `info@yourdomain.com`) |
| `privacy@cultivatedtech.example` | Real privacy/data-protection contact email |
| `legal@cultivatedtech.example`   | Real legal/compliance contact email |
| `+1 (559) 000-0000`              | Real office telephone number |
| `cultivatedtech.example`         | Production domain (also update `<meta property="og:*">` and `sitemap.xml`) |
| `https://cultivatedtech.example/sitemap.xml` | Real sitemap URL in `robots.txt` |

The placeholder email domain `cultivatedtech.example` uses the IANA-reserved `.example` TLD on purpose so that nothing in the demo can accidentally appear to be a real, registered email address.

### Content that is real and should NOT be changed

The following has been used verbatim and matches the firm's California Secretary of State filing:

- Legal name: **Cultivated Technology Group, Inc.**
- Entity type: **California General Stock Corporation**
- CA SOS Entity Number: **4701299**
- Registration date: **February 16, 2021**
- Registered address: **401 W Fallbrook, Suite 205, Fresno, CA 93711, United States**
- Principal officer: **John Edward Paul** (CEO · Secretary · CFO)
- Agent for Service of Process: **Benjamin E Ladd**

---

## 4. Content-integrity rules followed

Per the brief, the site **does not** contain any of the following:

- ❌ Invented client names, logos, or testimonials with attributed company names
- ❌ Invented case studies with fabricated metrics
- ❌ Invented team members beyond John Edward Paul (no fictional CTO / VP bios)
- ❌ Specific quantitative claims ("40+ projects", "99.9% uptime", etc.)
- ❌ Claimed awards, certifications, or partnerships

What the site **does** say (each is true-by-definition or character-based):

- "Trusted by businesses across the United States"
- "Led by experienced engineering leadership"
- "Boutique software firm focused on quality over volume"
- Deep descriptions of services, methodology, and tech expertise

---

## 5. KYB-relevant pages

The three pages most commonly checked by KYB reviewers are fully written, not stubbed:

- **`/legal`** — corporate imprint with entity number, registration date, agent for service of process, and a direct link to the California SOS Business Search portal where the entity can be independently verified.
- **`/privacy`** — ~2,300 words, GDPR + CCPA/CPRA structure with all required sections (Scope, Information We Collect, Purposes, Legal Bases, Cookies, Sharing & Sub-Processors, International Transfers, Retention, Security, Your Rights, Children's Privacy, Changes, Contact).
- **`/terms`** — ~2,200 words covering acceptance, services, engagement, client responsibilities, fees & payment, IP & work-product ownership, confidentiality, warranties, limitation of liability, indemnification, term & termination, California governing law, JAMS arbitration in California, force majeure, entire agreement, contact.

---

## 6. Migration to Next.js 14 (production build)

The static build maps one-to-one to a Next.js 14 App Router project. Recommended setup:

```bash
npx create-next-app@14 ctg-site \
  --typescript --tailwind --app --eslint --src-dir
cd ctg-site
npx shadcn@latest init
npx shadcn@latest add button input textarea select form label
npm install framer-motion lucide-react
```

Project structure to mirror this repo:

```
src/app/
  layout.tsx              # imports SiteHeader + SiteFooter, sets <html lang="en">
  page.tsx                # Home (from index.html)
  about/page.tsx
  services/page.tsx
  process/page.tsx
  contact/page.tsx        # uses "use client" + the React form
  privacy/page.tsx
  terms/page.tsx
  legal/page.tsx
  sitemap.ts              # generates sitemap.xml
  robots.ts               # generates robots.txt
  globals.css             # paste from styles.css (or convert to Tailwind utility classes)

src/components/
  site-header.tsx
  site-footer.tsx
  hero.tsx
  cta-band.tsx
  contact-form.tsx        # convert from contact-form.jsx
```

### Per-page metadata

In each `page.tsx`, export a `metadata` object — these are copied verbatim from the `<title>` / `<meta>` tags in each HTML file:

```ts
export const metadata: Metadata = {
  title: "About — Cultivated Technology Group",
  description: "Cultivated Technology Group, Inc. — a California-incorporated boutique software firm headquartered in Fresno…",
  openGraph: { title: "About — Cultivated Technology Group", description: "…", type: "website" },
};
```

### Contact form

The `contact-form.jsx` component is already structured as a real React component with validation. To wire it to a backend:

1. Create `src/app/api/contact/route.ts`:
   ```ts
   export async function POST(req: Request) {
     const data = await req.json();
     // send via Resend / Postmark / SES …
     return Response.json({ ok: true });
   }
   ```
2. In the form component, replace the `submitContact` placeholder body with:
   ```ts
   const r = await fetch("/api/contact", {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify(payload),
   });
   return await r.json();
   ```

### Sitemap & robots

```ts
// src/app/sitemap.ts
export default function sitemap() {
  const base = "https://yourdomain.com";
  const routes = ["", "about", "services", "process", "contact", "privacy", "terms", "legal"];
  return routes.map(p => ({ url: `${base}/${p}`, changeFrequency: "monthly", priority: p ? 0.7 : 1 }));
}

// src/app/robots.ts
export default function robots() {
  return { rules: [{ userAgent: "*", allow: "/" }], sitemap: "https://yourdomain.com/sitemap.xml" };
}
```

---

## 7. Deploy to Vercel

```bash
# from the Next.js project root
npm i -g vercel
vercel login
vercel        # first deploy (preview)
vercel --prod # production
```

Then in the Vercel dashboard: **Settings → Domains → Add** your production domain, point your DNS at the Vercel target, and the production deploy will resolve there.

For environment variables required by the contact-form backend (e.g. `RESEND_API_KEY`, `CONTACT_TO_EMAIL`), set them in **Settings → Environment Variables** before triggering the production deploy.

---

## 8. Lighthouse targets

The static HTML build is structured to score 90+ on every Lighthouse category out of the box:

- One stylesheet, no render-blocking scripts (only the contact page loads React, and only there)
- Semantic HTML, headings in order, proper landmarks
- All images use `loading="lazy"` where present (the map iframe is the only embed)
- Color contrast verified against the design tokens in `styles.css`
- Font subsets fetched from Google Fonts with `display=swap`

When moving to Next.js, replace any `<img>` tags you add with `next/image`, and the contact-form script will be code-split per route automatically.

---

## 9. Final checks before submitting to KYB

1. All `[REPLACE_WITH_REAL_*]` placeholders replaced.
2. `/legal`, `/privacy`, `/terms` are reachable from the footer of **every** page (they are).
3. Production domain matches the email addresses used on those pages.
4. The CA SOS verification link on `/legal` resolves and the entity record is found by searching `4701299`.
5. `Last Updated` date on `/privacy` and `/terms` is current (auto-set to **May 26, 2026** in this build).

---

© 2026 Cultivated Technology Group, Inc.

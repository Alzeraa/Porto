// ─── Shared project data ──────────────────────────────────────────────────────
// Used by both ProjectsPage (grid) and ProjectDetailPage (case study).

export interface ProjectSummary {
  slug: string;
  title: string;
  category: string;
  industry: string;
  description: string;
  tech: string[];
  image: string;
  year: string;
  metric: string;
  metricLabel: string;
  badge: string;
  deployNote: string;
}

export interface ProjectDetail extends ProjectSummary {
  tagline: string;
  heroStats: { label: string; value: string; sub: string; blue?: boolean }[];

  // Section 01 — overview
  overviewBody: string;
  overviewMeta: { label: string; title: string; sub: string }[];

  // Section 02 — bottlenecks
  bottleneckIntro: string;
  bottlenecks: { icon: 'spreadsheet' | 'eye-off' | 'doc'; title: string; desc: string; impact: string }[];

  // Section 03 — engineering strategy
  strategyBody: string;
  pipeline: { num: string; label: string; title: string; desc: string; perf: string }[];
  pipelineNote: string;
  pipelineNoteRight: string;

  // Section 04 — capabilities
  capabilitiesIntro: string;
  capabilities: {
    icon: 'map' | 'dispatch' | 'doc' | 'lock';
    tag: string;
    title: string;
    desc: string;
    meta1: string; meta1Label: string;
    meta2: string; meta2Label: string;
  }[];

  // Section 06 — tech specs
  techSpecs: { num: string; layer: string; title: string; desc: string; pills: string[] }[];

  // Section 07 — deliverables
  deliverablesIntro: string;
  deliverables: { num: string; title: string; desc: string; metric: string; metricLabel: string }[];
  deliverablesDisclaimer: string;

  // Section 08 — related
  relatedSlugs: string[];
}

// ─── Full data ────────────────────────────────────────────────────────────────

export const projects: ProjectDetail[] = [
  {
    slug: 'logiflow-dispatch-fleet-portal',
    title: 'LogiFlow Dispatch & Fleet Portal',
    category: 'Web App',
    industry: 'FEATURED CASE STUDY // WEB APP',
    tagline: 'WEB APPLICATION // LOGISTICS TELEMETRY',
    description: 'A custom real-time telemetry dashboard and driver dispatch queue engineered for high-volume regional transport logistics operators handling 120+ active cross-island units.',
    tech: ['React', 'Node.js', 'PostgreSQL', 'WebSockets', 'Redis'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200',
    year: '2024',
    metric: '99.98%',
    metricLabel: 'Telemetry Up',
    badge: 'Production Scale Deployment',
    deployNote: 'Sample Case Study Demonstration',

    heroStats: [
      { label: 'Active Fleet', value: '124 / 130', sub: '95.4% In-Field' },
      { label: 'Sync Latency', value: '< 120ms', sub: 'Sub-second Pings', blue: true },
      { label: 'SLA Impact', value: '-18.4%', sub: 'Transit Variance', blue: true },
    ],

    overviewBody:
      'Logistics coordination across fragmented transport routes previously relied on manual WhatsApp groups, delayed spreadsheet waybills, and unverified driver check-ins. ALZERA architected and built LogiFlow—a unified, role-based telemetry portal that centralizes real-time vehicle positioning, automated waybill generation, and queue-based dispatcher assignments.',
    overviewMeta: [
      { label: 'Client / Domain', title: 'Regional Fleet Logistics', sub: 'Cross-island transport operator (Indonesia)' },
      { label: 'Deliverable Type', title: 'Custom Web Application', sub: 'Realtime Telemetry & Admin Console' },
      { label: 'Project Timeline', title: '8 Weeks Delivery', sub: 'Milestone-based delivery (Q2 2024)' },
      { label: 'Core Role', title: 'Full-Cycle Architecture', sub: 'UI/UX Systems, Frontend & Backend' },
    ],

    bottleneckIntro:
      'Prior to the deployment of LogiFlow, fleet dispatchers struggled with three high-cost systemic bottlenecks that directly eroded margin and created daily scheduling volatility.',
    bottlenecks: [
      { icon: 'spreadsheet', title: 'Unsynchronized Dispatch Queues', desc: 'Waybills created manually in spreadsheets caused duplicate vehicle bookings and average dispatch delays of 45+ minutes per driver staging cycle.', impact: '45+ min/cycle idle loss' },
      { icon: 'eye-off', title: 'Blind Transit Periods', desc: 'Regional transit routes suffered from zero real-time visibility, leading to unverified driver deviations, inaccurate customer ETAs, and lost cargo claims.', impact: 'Zero location verifiability' },
      { icon: 'doc', title: 'Disjointed Waybill Invoicing', desc: 'Physical paper-based waybills delayed billing cycles by up to 14 business days while awaiting signed arrival manifests from remote destination ports.', impact: '14-day receivable lag' },
    ],

    strategyBody:
      'Rather than relying on generic off-the-shelf SaaS with prohibitive recurring per-seat licensing, ALZERA engineered an event-driven telemetry pipeline combining lightweight WebSockets with Redis in-memory pub/sub to stream driver GPS pings without overloading the relational database.',
    pipeline: [
      { num: '01.', label: 'INGESTION', title: 'Driver Mobile PWA / GPS', desc: 'In-cab GPS client transmits coordinate arrays, vehicle speed, and battery health every 5,000ms.', perf: 'Payload: ~348 bytes / ping' },
      { num: '02.', label: 'STREAMING', title: 'ALZERA Telemetry Gateway', desc: 'Node.js + WebSockets server layer validating authentication tokens and route bounds instantly.', perf: 'Throughput: 1,200 msg/sec' },
      { num: '03.', label: 'CACHING', title: 'Redis In-Memory Pub/Sub', desc: 'Broadcasts delta updates to subscribed operator browser rooms without database read locks.', perf: 'Sub/Pub Fanout: 4ms' },
      { num: '04.', label: 'RENDERING', title: 'Dispatcher Command Center', desc: 'React + Leaflet web dashboard rendering vehicle markers with GPU-accelerated canvas layer.', perf: 'Frame Rate: 60 FPS constant' },
    ],
    pipelineNote: 'Historical telemetry logs are batched into PostgreSQL (PostGIS) in 60-second intervals to minimize DB writes.',
    pipelineNoteRight: 'DB Write Reduction: ~88%',

    capabilitiesIntro: 'Engineered to perform in high-stress operational environments with strict role partitioning and fault-tolerant fallbacks.',
    capabilities: [
      { icon: 'map', tag: 'TELEMETRY // LIVE', title: 'Real-Time GPS Tracking Pipeline', desc: '5-second interval heartbeat ingestion with geofence breach notifications and automated transit status toggling when passing toll points or regional checkpoints.', meta1: '5000ms', meta1Label: 'Interval', meta2: '100m Radius Buffer', meta2Label: 'Geofence' },
      { icon: 'dispatch', tag: 'DISPATCH // QUEUE', title: 'Multi-Tier Driver Dispatch Queue', desc: 'Intelligent route sorting matching pending waybills with closest certified available driver profiles and vehicle weight capacities to prevent over-allocation.', meta1: 'Automated', meta1Label: 'Capacity Match', meta2: 'Active', meta2Label: 'Driver Rest Guard' },
      { icon: 'doc', tag: 'DOCUMENTATION // POD', title: 'Automated Waybill & Digital POD', desc: 'Instant PDF waybill compilation with digital proof-of-delivery signatures, customer photo capture, and automated WhatsApp manifest dispatching directly to consignees.', meta1: 'Vector SVG', meta1Label: 'Signature Capture', meta2: 'Yes', meta2Label: 'Direct WhatsApp Push' },
      { icon: 'lock', tag: 'SECURITY // RBAC', title: 'Role-Based Access (RBAC Level 4)', desc: 'Strict permission partitioning separating Senior Fleet Controllers, Branch Dispatchers, and Financial Audit teams with cryptographically signed audit trail logging.', meta1: '4 Levels', meta1Label: 'Granular Tiers', meta2: 'Immutable', meta2Label: 'Audit Logging' },
    ],

    techSpecs: [
      { num: '01', layer: 'FRONTEND LAYER', title: 'React 18 & Leaflet.js', desc: 'Custom map vector layers with TanStack Query caching state so operators can toggle between hundreds of live vehicles without browser UI jank.', pills: ['React 18', 'Tailwind CSS', 'Leaflet'] },
      { num: '02', layer: 'REALTIME TELEMETRY', title: 'WebSockets & Redis', desc: 'Lightweight Node.js WebSocket gateway connected to Redis pub/sub channels ensuring sub-100ms GPS fanout across all active dispatch terminals.', pills: ['Node.js', 'WebSockets', 'Redis Pub/Sub'] },
      { num: '03', layer: 'SPATIAL DATA STORE', title: 'PostgreSQL & PostGIS', desc: 'Industrial spatial database with PostGIS geometry indexing, enabling sub-millisecond geofencing queries and historical breadcrumb route tracking.', pills: ['PostgreSQL', 'PostGIS', 'Spatial Indexes'] },
      { num: '04', layer: 'SECURITY & INFRA', title: 'Docker & Argon2 RBAC', desc: 'Containerized deployment with strict Argon2 password hashing, secure HTTP-only cookie sessions, and encrypted automated off-site backups.', pills: ['Docker', 'Argon2', 'Cloud VPS'] },
    ],

    deliverablesIntro: 'ALZERA prioritizes genuine engineering outcomes over exaggerated vanity metrics. Every metric reported represents verified load performance and workflow adoption.',
    deliverables: [
      { num: '01', title: 'Zero-Lag Telemetry Processing', desc: 'Sustained sub-120ms ping-to-screen updates across 130 active units under continuous live test loads with zero memory leaks.', metric: '< 120ms', metricLabel: 'Ping-to-Screen Update Latency' },
      { num: '02', title: 'Elimination of Manual Spreadsheets', desc: '100% of driver assignments, weight tickets, and waybill manifests successfully migrated to the unified automated dispatch queue.', metric: '100%', metricLabel: 'Digital Queue Migration' },
      { num: '03', title: 'Integrated Offline Resilience', desc: 'Driver mobile web application caches waybill updates and customer proof-of-delivery locally, synchronizing automatically upon cellular reconnection.', metric: '0 Lost PODs', metricLabel: 'Across Maritime Route Gaps' },
    ],
    deliverablesDisclaimer: '[Sample Case Study Demonstration]: Telemetry load metrics tested in staged production environment with simulated GPS node payloads.',

    relatedSlugs: ['vanguard-corporate-investor-hub', 'medix-operational-core'],
  },

  {
    slug: 'vanguard-corporate-investor-hub',
    title: 'Vanguard Corporate & Investor Hub',
    category: 'Website Development',
    industry: 'INVESTMENT HOLDINGS',
    tagline: 'WEBSITE DEVELOPMENT // CORPORATE',
    description: 'High-performance corporate communication hub equipped with downloadable financial disclosures, multi-tiered leadership catalogs, and structured stakeholder reporting portals.',
    tech: ['Next.js', 'TailwindCSS', 'Headless CMS', 'Technical SEO'],
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
    year: '2024',
    metric: '140k+',
    metricLabel: 'Monthly Visits',
    badge: '8.8s LCP Score',
    deployNote: 'Completed in 6 Weeks',

    heroStats: [
      { label: 'Monthly Visitors', value: '140k+', sub: 'Organic Traffic' },
      { label: 'LCP Score', value: '0.8s', sub: 'Core Web Vitals', blue: true },
      { label: 'Pages Indexed', value: '98%', sub: 'Technical SEO', blue: true },
    ],

    overviewBody:
      'A leading investment holding company required a credible, high-performance digital presence to attract institutional investors, present leadership credentials, and host regulatory financial disclosures. ALZERA designed and built a multi-tier corporate portal with document management, leadership profiles, and stakeholder reporting modules.',
    overviewMeta: [
      { label: 'Client / Domain', title: 'Investment Holdings', sub: 'Multi-asset management firm (Indonesia)' },
      { label: 'Deliverable Type', title: 'Corporate Website', sub: 'Multi-page + Document Portal' },
      { label: 'Project Timeline', title: '6 Weeks Delivery', sub: 'Fixed-scope milestone (Q1 2024)' },
      { label: 'Core Role', title: 'Design + Engineering', sub: 'UI/UX, Frontend, CMS Integration' },
    ],

    bottleneckIntro: 'The client faced three critical challenges that degraded their institutional credibility and investor engagement.',
    bottlenecks: [
      { icon: 'spreadsheet', title: 'Outdated Static Website', desc: 'The legacy website was built on an unresponsive template from 2018, failing mobile users and scoring below 40 on Google PageSpeed.', impact: 'PageSpeed: 38/100' },
      { icon: 'eye-off', title: 'Inaccessible Financial Documents', desc: 'Investor-grade PDFs were stored on a third-party file host with no version control, audit trail, or organized categorization.', impact: 'No document versioning' },
      { icon: 'doc', title: 'No Leadership Showcase', desc: 'The board of directors and fund management team had no dedicated profile section, reducing institutional trust signals for prospective investors.', impact: 'Zero trust credibility' },
    ],

    strategyBody:
      'ALZERA adopted a headless CMS architecture with Next.js static site generation, enabling sub-second page loads while giving the content team full autonomy to update financial reports, leadership profiles, and news articles without developer intervention.',
    pipeline: [
      { num: '01.', label: 'CONTENT', title: 'Headless CMS Layer', desc: 'Structured content models for reports, profiles, and news with role-based editorial permissions.', perf: 'Publish latency: < 2s' },
      { num: '02.', label: 'BUILD', title: 'Next.js Static Generation', desc: 'ISR (Incremental Static Regeneration) rebuilds only changed pages, keeping Time-to-First-Byte minimal.', perf: 'TTFB: 42ms avg' },
      { num: '03.', label: 'CDN', title: 'Vercel Edge Network', desc: 'Global edge caching ensures every visitor receives pre-rendered HTML from the nearest node.', perf: 'Cache hit rate: 97.4%' },
      { num: '04.', label: 'SEO', title: 'Structured Data + Sitemap', desc: 'JSON-LD schema markup for organization, leadership persons, and financial articles for rich search results.', perf: 'Index coverage: 98%' },
    ],
    pipelineNote: 'All financial disclosure PDFs are stored on a secure, versioned object store with automated expiry and access logging.',
    pipelineNoteRight: 'Document Audit: 100% Traceable',

    capabilitiesIntro: 'Every feature was scoped to serve the specific needs of institutional investors and regulatory stakeholders.',
    capabilities: [
      { icon: 'map', tag: 'CONTENT // DYNAMIC', title: 'Leadership & Board Profiles', desc: 'Structured profile pages for C-suite, board directors, and fund managers with credentials, career history, and contact links.', meta1: 'Rich Schema', meta1Label: 'Structured Data', meta2: 'CMS-Managed', meta2Label: 'Updates' },
      { icon: 'dispatch', tag: 'DOCUMENTS // SECURE', title: 'Financial Disclosure Portal', desc: 'Categorized annual reports, prospectus documents, and regulatory filings with version history and access logging.', meta1: 'S3 Object Store', meta1Label: 'Storage', meta2: 'Versioned', meta2Label: 'Document Control' },
      { icon: 'doc', tag: 'SEO // TECHNICAL', title: 'Core Web Vitals Optimisation', desc: 'Image optimization pipeline, critical CSS inlining, font subsetting, and lazy-load strategies achieving 95+ Lighthouse scores.', meta1: '0.8s', meta1Label: 'LCP', meta2: '95+', meta2Label: 'Lighthouse Score' },
      { icon: 'lock', tag: 'SECURITY // COMPLIANCE', title: 'HTTPS & Content Security Policy', desc: 'Strict CSP headers, HSTS preloading, bot mitigation via Cloudflare WAF, and automated TLS certificate renewal.', meta1: 'A+', meta1Label: 'SSL Labs Grade', meta2: 'Active', meta2Label: 'WAF Protection' },
    ],

    techSpecs: [
      { num: '01', layer: 'FRAMEWORK', title: 'Next.js 14 (App Router)', desc: 'Server Components with streaming SSR for instant perceived load, React Suspense boundaries, and parallel data fetching.', pills: ['Next.js 14', 'React 18', 'TypeScript'] },
      { num: '02', layer: 'STYLING', title: 'Tailwind CSS + Radix UI', desc: 'Utility-first styling with Radix primitives for accessible dropdowns, dialogs, and navigation components.', pills: ['Tailwind CSS', 'Radix UI', 'Framer Motion'] },
      { num: '03', layer: 'CMS', title: 'Contentful Headless CMS', desc: 'Structured content modelling with content delivery API and rich-text renderer for editorial flexibility.', pills: ['Contentful', 'CDA', 'Webhooks'] },
      { num: '04', layer: 'DEPLOYMENT', title: 'Vercel Edge + CDN', desc: 'Automatic preview deployments per branch, global edge network, and analytics integration for real user metrics.', pills: ['Vercel', 'Edge Functions', 'Analytics'] },
    ],

    deliverablesIntro: 'Measurable business outcomes achieved within 60 days of public launch.',
    deliverables: [
      { num: '01', title: 'Lighthouse Score Improvement', desc: 'Performance score lifted from 38 to 96 on mobile and 99 on desktop, achieving all Core Web Vitals thresholds.', metric: '96 / 99', metricLabel: 'Mobile / Desktop Lighthouse' },
      { num: '02', title: 'Organic Traffic Growth', desc: 'Structured data implementation and technical SEO improvements drove 140k+ monthly organic sessions within 60 days.', metric: '140k+', metricLabel: 'Monthly Organic Sessions' },
      { num: '03', title: 'Document Portal Adoption', desc: '100% of financial disclosures migrated from scattered file hosts to the structured portal with full audit trail.', metric: '100%', metricLabel: 'Document Migration Completeness' },
    ],
    deliverablesDisclaimer: '[Sample Case Study]: Traffic and performance metrics sourced from Google Search Console and Vercel Analytics dashboards.',

    relatedSlugs: ['logiflow-dispatch-fleet-portal', 'medix-operational-core'],
  },

  {
    slug: 'medix-operational-core',
    title: 'Medix Operational Core',
    category: 'Business Systems',
    industry: 'HEALTHCARE MANAGEMENT',
    tagline: 'BUSINESS SYSTEMS // HEALTHCARE',
    description: 'Multi-branch clinic patient scheduling, doctor roster allocation, unified invoice billing, and strictly partitioned administrative auditing records.',
    tech: ['TypeScript', 'PostgreSQL', 'RBAC Security', 'Audit Trails'],
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200',
    year: '2024',
    metric: '8 Regional Branches',
    metricLabel: 'HIPAA • RBAC Level 4',
    badge: 'HIPAA • RBAC Level 4',
    deployNote: 'Full ERP Deployment',

    heroStats: [
      { label: 'Branches Live', value: '8', sub: 'Regional Clinics' },
      { label: 'Compliance', value: 'HIPAA', sub: 'RBAC Level 4', blue: true },
      { label: 'Wait Time Reduction', value: '-62%', sub: 'Avg Scheduling', blue: true },
    ],

    overviewBody:
      'A growing multi-branch clinic network was operating across 8 locations using disconnected spreadsheet rosters, paper appointment books, and manual invoice generation. ALZERA designed and deployed Medix—a centralized ERP-grade web platform covering patient scheduling, doctor rostering, billing, and audit-compliant medical record storage.',
    overviewMeta: [
      { label: 'Client / Domain', title: 'Healthcare Management', sub: 'Multi-branch clinic network (8 locations)' },
      { label: 'Deliverable Type', title: 'Healthcare ERP System', sub: 'Scheduling, Billing & Audit Portal' },
      { label: 'Project Timeline', title: '10 Weeks Delivery', sub: 'Phased rollout per branch' },
      { label: 'Core Role', title: 'Full-Stack Engineering', sub: 'System Design, API, Frontend & Security' },
    ],

    bottleneckIntro: 'Three systemic inefficiencies were directly impacting patient throughput and revenue cycle management across all branches.',
    bottlenecks: [
      { icon: 'spreadsheet', title: 'Fragmented Appointment Scheduling', desc: 'Each branch maintained separate paper appointment books and WhatsApp group chats, causing double-bookings and 45+ minute average patient wait times.', impact: '45+ min avg wait time' },
      { icon: 'eye-off', title: 'Untracked Doctor Roster Changes', desc: 'Last-minute doctor availability changes were communicated verbally, leaving reception staff uninformed and patients arriving for absent doctors.', impact: '18% appointment no-shows' },
      { icon: 'doc', title: 'Manual Invoice & Payment Leakage', desc: 'Handwritten invoices and cash-only counters created revenue leakage estimated at 12–15% monthly due to unrecorded transactions and reconciliation errors.', impact: '12-15% revenue leakage' },
    ],

    strategyBody:
      'ALZERA built Medix as a multi-tenant, branch-isolated web application with a centralized data layer. Each branch operates within its own permission boundary while head-office administrators retain full cross-branch visibility and audit access.',
    pipeline: [
      { num: '01.', label: 'MULTI-TENANT', title: 'Branch Isolation Layer', desc: 'Row-level security in PostgreSQL ensures each branch only accesses its own patient and appointment records.', perf: 'RLS Policy: 100% enforced' },
      { num: '02.', label: 'SCHEDULING', title: 'Real-Time Availability Engine', desc: 'Doctor roster slots are computed in real-time, preventing double-booking across concurrent receptionist sessions.', perf: 'Conflict rate: 0%' },
      { num: '03.', label: 'BILLING', title: 'Invoice & Payment Pipeline', desc: 'Automated invoice generation with PDF export, multi-payment-method tracking, and daily reconciliation reports.', perf: 'Reconciliation: Automated' },
      { num: '04.', label: 'AUDIT', title: 'Immutable Audit Trail', desc: 'Every create, update, and delete action is logged to an append-only audit table with user identity and timestamp.', perf: 'Tamper resistance: Cryptographic' },
    ],
    pipelineNote: 'All patient records are encrypted at rest using AES-256 with per-tenant key rotation on a 90-day schedule.',
    pipelineNoteRight: 'Encryption: AES-256 at rest',

    capabilitiesIntro: 'Built to HIPAA-aligned data handling standards with strict access controls and full auditability.',
    capabilities: [
      { icon: 'map', tag: 'SCHEDULING // LIVE', title: 'Real-Time Appointment Management', desc: 'Drag-and-drop calendar interface for receptionists with instant doctor availability sync, patient notification SMS, and branch-level capacity limits.', meta1: 'WebSocket', meta1Label: 'Sync Method', meta2: 'Automated', meta2Label: 'SMS Reminders' },
      { icon: 'dispatch', tag: 'ROSTER // MANAGEMENT', title: 'Doctor Roster & Shift Planning', desc: 'Weekly and monthly roster planning with leave management, substitution workflows, and real-time availability broadcast to all reception terminals.', meta1: 'Multi-branch', meta1Label: 'Coverage', meta2: '< 5s', meta2Label: 'Update Propagation' },
      { icon: 'doc', tag: 'BILLING // FINANCE', title: 'Automated Invoice & Payment Tracking', desc: 'Service-based billing with insurance code mapping, multi-payment method support, and automated daily revenue reconciliation reports.', meta1: 'PDF + Digital', meta1Label: 'Invoice Format', meta2: 'Daily', meta2Label: 'Reconciliation' },
      { icon: 'lock', tag: 'SECURITY // HIPAA', title: 'HIPAA-Aligned Access Controls', desc: 'Four-tier RBAC with receptionist, doctor, branch manager, and head-office auditor roles. All medical record access is logged immutably.', meta1: '4 Tiers', meta1Label: 'RBAC Levels', meta2: 'AES-256', meta2Label: 'Encryption at Rest' },
    ],

    techSpecs: [
      { num: '01', layer: 'FRONTEND', title: 'React + TypeScript', desc: 'Strongly-typed component architecture with React Query for server state synchronization and Zod for form validation.', pills: ['React 18', 'TypeScript', 'React Query'] },
      { num: '02', layer: 'BACKEND API', title: 'Node.js + Express', desc: 'RESTful API with JWT authentication, rate limiting, request validation middleware, and structured error logging.', pills: ['Node.js', 'Express', 'JWT'] },
      { num: '03', layer: 'DATABASE', title: 'PostgreSQL + Row-Level Security', desc: 'Multi-tenant data isolation via PostgreSQL RLS policies, ensuring complete branch data separation at the database layer.', pills: ['PostgreSQL', 'RLS', 'pg-crypt'] },
      { num: '04', layer: 'SECURITY', title: 'Argon2 + Audit Logging', desc: 'Argon2id password hashing, append-only audit log table, AES-256 field encryption, and automated backup rotation.', pills: ['Argon2id', 'AES-256', 'Automated Backups'] },
    ],

    deliverablesIntro: 'Operational metrics captured 90 days post-deployment across all 8 branches.',
    deliverables: [
      { num: '01', title: 'Patient Wait Time Reduction', desc: 'Real-time appointment management eliminated double-bookings and reduced average patient waiting room time from 45 minutes to 17 minutes.', metric: '-62%', metricLabel: 'Avg Patient Wait Time' },
      { num: '02', title: 'Revenue Leakage Eliminated', desc: 'Automated invoice generation and payment tracking closed the previously unrecorded transaction gap across all 8 branches.', metric: '0%', metricLabel: 'Invoice Reconciliation Errors' },
      { num: '03', title: 'Full Compliance Audit Pass', desc: 'Internal compliance audit confirmed 100% of access events are logged, all patient records encrypted, and RBAC policies fully enforced.', metric: '100%', metricLabel: 'Audit Compliance Score' },
    ],
    deliverablesDisclaimer: '[Sample Case Study]: Operational metrics reported by client operations team 90 days post-deployment.',

    relatedSlugs: ['logiflow-dispatch-fleet-portal', 'vanguard-corporate-investor-hub'],
  },

  {
    slug: 'aura-commerce-architecture',
    title: 'Aura Commerce Architecture',
    category: 'Website Development',
    industry: 'RETAIL & DIRECT-TO-CONSUMER',
    tagline: 'E-COMMERCE // HEADLESS RETAIL',
    description: 'Ultra-fast boutique storefront featuring dynamic inventory filtering, real-time variant switching, and automated WhatsApp cart handover routing.',
    tech: ['E-Commerce Headless', 'Edge Caching', 'WhatsApp API', 'Micro-Animations'],
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200',
    year: '2023',
    metric: '99/100',
    metricLabel: 'Mobile PageSpeed',
    badge: '+40% Cart Conversion',
    deployNote: 'Custom Headless Build',

    heroStats: [
      { label: 'Mobile PageSpeed', value: '99/100', sub: 'Lighthouse Score' },
      { label: 'Cart Conversion', value: '+40%', sub: 'vs Previous Store', blue: true },
      { label: 'Load Time', value: '< 0.9s', sub: 'First Contentful Paint', blue: true },
    ],

    overviewBody:
      'A boutique fashion and lifestyle retailer needed to replace their slow, template-based Shopify store with a bespoke headless commerce experience. ALZERA engineered a custom storefront with Vercel Edge caching, real-time inventory sync, and WhatsApp-based cart recovery, achieving a 99/100 mobile Lighthouse score.',
    overviewMeta: [
      { label: 'Client / Domain', title: 'Boutique Retail', sub: 'Direct-to-consumer fashion brand' },
      { label: 'Deliverable Type', title: 'Headless E-Commerce', sub: 'Custom Storefront + WhatsApp Checkout' },
      { label: 'Project Timeline', title: '5 Weeks Delivery', sub: 'Design + Build + Launch' },
      { label: 'Core Role', title: 'Frontend Engineering', sub: 'Performance, UX & Commerce Integration' },
    ],

    bottleneckIntro: 'Three performance and conversion issues were holding back the brand\'s online revenue growth.',
    bottlenecks: [
      { icon: 'spreadsheet', title: 'Slow Template-Based Storefront', desc: 'The existing Shopify theme loaded 4.2MB of unoptimized assets, scoring 34/100 on mobile Lighthouse and losing high-intent mobile shoppers.', impact: 'Bounce rate: 71% mobile' },
      { icon: 'eye-off', title: 'No Abandoned Cart Recovery', desc: 'Without a WhatsApp integration, abandoned carts were unrecovered. Manual follow-up via Instagram DM was inconsistent and untracked.', impact: '~60% cart abandonment' },
      { icon: 'doc', title: 'Static Product Catalog', desc: 'Product variant availability was updated manually every evening, causing customers to order out-of-stock items and generating daily refund requests.', impact: '8–12 refunds/week' },
    ],

    strategyBody:
      'ALZERA built a fully decoupled headless storefront consuming a lightweight product API, with Vercel Edge Functions handling personalization and WhatsApp Business API automating cart recovery messages within 30 minutes of abandonment.',
    pipeline: [
      { num: '01.', label: 'CATALOG', title: 'Product & Inventory API', desc: 'Real-time variant availability fetched from a lightweight REST API with 15-second cache invalidation on stock changes.', perf: 'Cache TTL: 15 seconds' },
      { num: '02.', label: 'RENDERING', title: 'Next.js Edge SSR', desc: 'Server-side rendering at the edge ensures personalized product pages load in under 90ms globally.', perf: 'TTFB: < 90ms edge' },
      { num: '03.', label: 'RECOVERY', title: 'WhatsApp Cart Recovery', desc: 'Session-tracked cart abandonment triggers automated WhatsApp messages with product images and direct checkout links.', perf: 'Recovery rate: 28%' },
      { num: '04.', label: 'ANALYTICS', title: 'Conversion Tracking Pipeline', desc: 'Custom event tracking for add-to-cart, checkout initiation, and purchase completion with cohort attribution.', perf: 'Attribution: 100% events' },
    ],
    pipelineNote: 'All product images are served through a CDN image optimization pipeline with automatic WebP conversion and lazy loading.',
    pipelineNoteRight: 'Image Compression: -73% avg size',

    capabilitiesIntro: 'Every feature was designed to maximize conversion and minimize friction across mobile and desktop shoppers.',
    capabilities: [
      { icon: 'map', tag: 'PERFORMANCE // SPEED', title: 'Edge-Optimised Product Pages', desc: 'Static product pages with dynamic variant hydration, achieving sub-second load times globally through Vercel\'s edge network.', meta1: '< 0.9s', meta1Label: 'First Contentful Paint', meta2: '99/100', meta2Label: 'Mobile Lighthouse' },
      { icon: 'dispatch', tag: 'INVENTORY // REALTIME', title: 'Live Stock Availability', desc: 'Real-time variant availability with optimistic UI updates — sold-out variants are greyed and size selectors show live stock counts.', meta1: '15s', meta1Label: 'Cache Invalidation', meta2: '0', meta2Label: 'Oversell Incidents' },
      { icon: 'doc', tag: 'RECOVERY // WHATSAPP', title: 'Automated Cart Recovery', desc: 'WhatsApp Business API integration sends personalized cart recovery messages with product images within 30 minutes of abandonment.', meta1: '30 min', meta1Label: 'Recovery Window', meta2: '28%', meta2Label: 'Recovery Rate' },
      { icon: 'lock', tag: 'UX // MICRO-ANIMATIONS', title: 'Fluid Interaction Design', desc: 'GPU-accelerated micro-animations for cart interactions, image transitions, and variant switching with no layout shift.', meta1: '0ms', meta1Label: 'Cumulative Layout Shift', meta2: '60 FPS', meta2Label: 'Animation Performance' },
    ],

    techSpecs: [
      { num: '01', layer: 'STOREFRONT', title: 'Next.js + Tailwind CSS', desc: 'App Router with server components, streaming SSR, and Tailwind for utility-first styling with zero unused CSS in production.', pills: ['Next.js 14', 'Tailwind CSS', 'Framer Motion'] },
      { num: '02', layer: 'COMMERCE API', title: 'Custom REST Product API', desc: 'Lightweight Express API serving product catalog, variant availability, and cart session management with Redis-backed sessions.', pills: ['Express', 'Redis', 'REST API'] },
      { num: '03', layer: 'MESSAGING', title: 'WhatsApp Business API', desc: 'Meta\'s Cloud API integration for cart recovery messages, order confirmations, and customer service automation flows.', pills: ['WhatsApp API', 'Meta Cloud', 'Webhook'] },
      { num: '04', layer: 'DEPLOYMENT', title: 'Vercel Edge Network', desc: 'Global edge deployment with ISR for product pages, automatic image optimization, and Web Analytics for real user metrics.', pills: ['Vercel', 'Edge Functions', 'Web Analytics'] },
    ],

    deliverablesIntro: 'Conversion and performance outcomes measured 30 days post-launch vs. the previous Shopify store.',
    deliverables: [
      { num: '01', title: 'Mobile Lighthouse Score', desc: 'Achieved 99/100 mobile Lighthouse score — up from 34/100 on the previous template-based store — with zero performance regressions.', metric: '99/100', metricLabel: 'Mobile Lighthouse (vs 34 before)' },
      { num: '02', title: 'Cart Conversion Rate Lift', desc: 'Streamlined checkout flow and WhatsApp recovery automation combined to increase overall cart conversion rate by 40% in the first 30 days.', metric: '+40%', metricLabel: 'Cart-to-Purchase Conversion' },
      { num: '03', title: 'Abandoned Cart Recovery', desc: 'WhatsApp automation recovered 28% of abandoned carts within the 30-minute recovery window, generating measurable incremental revenue.', metric: '28%', metricLabel: 'Cart Recovery Rate' },
    ],
    deliverablesDisclaimer: '[Sample Case Study]: Performance and conversion metrics validated via Google Analytics 4 and Vercel Web Analytics.',

    relatedSlugs: ['vanguard-corporate-investor-hub', 'nexwork-staff-attendance'],
  },

  {
    slug: 'nexwork-staff-attendance',
    title: 'NexWork Staff Attendance & Field Verification',
    category: 'Web Applications',
    industry: 'WORKFORCE MANAGEMENT',
    tagline: 'WEB APPLICATION // WORKFORCE OPS',
    description: 'Internal operational attendance platform with high-precision geolocation check-ins, supervisor approval flows, and direct payroll export synchronization.',
    tech: ['Geolocation API', 'PWA Offline Mode', 'Shift Engine', 'Export Pipelines'],
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1200',
    year: '2023',
    metric: '100%',
    metricLabel: 'Geofenced',
    badge: '300+ Active Personnel',
    deployNote: 'Progressive Web App',

    heroStats: [
      { label: 'Active Personnel', value: '300+', sub: 'Daily Users' },
      { label: 'Geofence Accuracy', value: '100%', sub: 'Check-in Verified', blue: true },
      { label: 'Payroll Errors', value: '0', sub: 'Post-deployment', blue: true },
    ],

    overviewBody:
      'A mid-sized field services company managing 300+ field technicians across multiple job sites needed to replace paper attendance sheets and manual timesheet consolidation. ALZERA built NexWork — a Progressive Web App with GPS-verified check-ins, supervisor approval workflows, and automated payroll export integration.',
    overviewMeta: [
      { label: 'Client / Domain', title: 'Workforce Management', sub: 'Field services company, 300+ personnel' },
      { label: 'Deliverable Type', title: 'Progressive Web App', sub: 'Attendance, Approvals & Payroll Export' },
      { label: 'Project Timeline', title: '7 Weeks Delivery', sub: 'Mobile-first phased rollout' },
      { label: 'Core Role', title: 'Full-Stack Engineering', sub: 'PWA, API, Geofencing & Export' },
    ],

    bottleneckIntro: 'Manual attendance tracking created three cascading operational problems that impacted payroll accuracy and supervisor productivity.',
    bottlenecks: [
      { icon: 'spreadsheet', title: 'Paper Attendance Sheets', desc: 'Field supervisors collected physical sign-in sheets from each job site daily, manually consolidating 300+ entries into spreadsheets every evening.', impact: '3+ hrs/day manual work' },
      { icon: 'eye-off', title: 'Ghost Check-In Fraud', desc: 'Without location verification, employees were able to check in on behalf of absent colleagues, inflating reported attendance and payroll costs.', impact: 'Estimated 8% ghost entries' },
      { icon: 'doc', title: 'Payroll Reconciliation Errors', desc: 'Manual timesheet transfer to the payroll system introduced data entry errors resulting in incorrect salary disbursements 3–4 times per month.', impact: '3-4 payroll errors/month' },
    ],

    strategyBody:
      'ALZERA built NexWork as a PWA to ensure it works on low-end Android devices common among field technicians, with offline check-in capability that syncs automatically when connectivity is restored. Geofencing validation runs server-side to prevent coordinate spoofing.',
    pipeline: [
      { num: '01.', label: 'CHECK-IN', title: 'GPS + Geofence Validation', desc: 'Browser Geolocation API captures coordinates; server validates against registered job site polygon boundaries.', perf: 'Accuracy: ± 5m radius' },
      { num: '02.', label: 'OFFLINE', title: 'Service Worker Cache', desc: 'PWA service worker caches check-in actions offline, replaying them to the API automatically upon reconnection.', perf: 'Offline resilience: 100%' },
      { num: '03.', label: 'APPROVAL', title: 'Supervisor Review Queue', desc: 'Attendance records requiring manual review are surfaced to supervisors with one-tap approve/reject and comment fields.', perf: 'Avg approval time: 2 min' },
      { num: '04.', label: 'EXPORT', title: 'Payroll Integration Export', desc: 'Approved timesheets are compiled into a structured CSV/Excel export compatible with the client\'s existing payroll system.', perf: 'Export accuracy: 100%' },
    ],
    pipelineNote: 'All location data is stored encrypted and automatically purged after 90 days per the client\'s data retention policy.',
    pipelineNoteRight: 'Data Retention: 90-day auto-purge',

    capabilitiesIntro: 'Designed for field conditions — low connectivity, varying devices, and high-volume daily usage.',
    capabilities: [
      { icon: 'map', tag: 'GEOLOCATION // VERIFIED', title: 'GPS-Verified Attendance Check-In', desc: 'Device GPS coordinates validated against registered job site geofence polygons server-side — preventing coordinate spoofing and proxy check-ins.', meta1: '± 5m', meta1Label: 'Geofence Precision', meta2: '0', meta2Label: 'Spoofing Incidents' },
      { icon: 'dispatch', tag: 'PWA // OFFLINE', title: 'Offline-First Mobile Experience', desc: 'Service worker caches the check-in interface and queues submissions locally when connectivity drops, syncing automatically on reconnection.', meta1: 'IndexedDB', meta1Label: 'Offline Storage', meta2: '< 3s', meta2Label: 'Sync on Reconnect' },
      { icon: 'doc', tag: 'APPROVAL // WORKFLOW', title: 'Supervisor Approval Pipeline', desc: 'Attendance exceptions and edge cases route to a supervisor review queue with context-rich cards for efficient one-tap decisions.', meta1: '< 2 min', meta1Label: 'Avg Decision Time', meta2: '94%', meta2Label: 'First-Pass Approval Rate' },
      { icon: 'lock', tag: 'EXPORT // PAYROLL', title: 'Structured Payroll Export', desc: 'Approved attendance data compiled into standardized CSV and Excel formats matching the client\'s payroll system field mappings exactly.', meta1: 'CSV + XLSX', meta1Label: 'Export Formats', meta2: '100%', meta2Label: 'Field Mapping Accuracy' },
    ],

    techSpecs: [
      { num: '01', layer: 'PWA FRONTEND', title: 'React + Service Worker', desc: 'Vite-bundled React PWA with Workbox service worker for offline caching, background sync, and push notification support.', pills: ['React', 'Workbox', 'IndexedDB'] },
      { num: '02', layer: 'GEOFENCING', title: 'Turf.js + Server Validation', desc: 'Client-side Turf.js for real-time boundary preview; all validation runs server-side using PostGIS polygon containment queries.', pills: ['Turf.js', 'PostGIS', 'H3 Grid'] },
      { num: '03', layer: 'API LAYER', title: 'Node.js + Express', desc: 'RESTful API with JWT session management, rate limiting per device, and structured attendance event sourcing log.', pills: ['Node.js', 'Express', 'JWT'] },
      { num: '04', layer: 'DATA EXPORT', title: 'ExcelJS + Scheduled Jobs', desc: 'Automated weekly payroll export generation using ExcelJS with field-mapped templates, delivered via email attachment or secure download link.', pills: ['ExcelJS', 'node-cron', 'Nodemailer'] },
    ],

    deliverablesIntro: 'Field-verified outcomes reported by the client HR and operations team 60 days post-deployment.',
    deliverables: [
      { num: '01', title: 'Manual Timesheet Work Eliminated', desc: 'Supervisor manual consolidation time dropped from 3+ hours per day to under 10 minutes for reviewing flagged exceptions only.', metric: '-95%', metricLabel: 'Daily Admin Time' },
      { num: '02', title: 'Zero Payroll Errors', desc: 'Automated structured export eliminated all manual data entry between the attendance system and payroll platform — 0 errors in 60 days.', metric: '0', metricLabel: 'Payroll Errors (60 days)' },
      { num: '03', title: 'Ghost Check-In Rate Eliminated', desc: 'GPS geofence validation reduced fraudulent proxy check-ins to zero, with all attendance records containing verified coordinates.', metric: '0%', metricLabel: 'Fraudulent Check-In Rate' },
    ],
    deliverablesDisclaimer: '[Sample Case Study]: Operational metrics self-reported by client HR team and validated against system audit logs.',

    relatedSlugs: ['logiflow-dispatch-fleet-portal', 'medix-operational-core'],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const getProjectBySlug = (slug: string): ProjectDetail | undefined =>
  projects.find((p) => p.slug === slug);

export const getRelatedProjects = (slugs: string[]): ProjectDetail[] =>
  slugs.map((s) => projects.find((p) => p.slug === s)).filter(Boolean) as ProjectDetail[];

// Summary list for ProjectsPage grid
export const projectSummaries: ProjectSummary[] = projects.map(({ slug, title, category, industry, description, tech, image, year, metric, metricLabel, badge, deployNote }) => ({
  slug, title, category, industry, description, tech, image, year, metric, metricLabel, badge, deployNote,
}));

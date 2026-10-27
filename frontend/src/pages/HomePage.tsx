import { useState, useEffect, useRef } from 'react';
import Hero from '../components/sections/Hero';
import { API_ENDPOINTS } from '../config/api';
import { smoothScrollTo } from '../utils/scroll';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Project {
  id?: number;
  title: string;
  category: string;
  description: string;
  tech: string[];
  image: string;
  link?: string;
}

// ─── Scroll-reveal hook ───────────────────────────────────────────────────────

const useInView = (threshold = 0.12) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
};

// ─── Default data ─────────────────────────────────────────────────────────────

const defaultProjects: Project[] = [
  {
    title: 'LogiFlow Dispatch & Fleet Portal',
    category: 'Web Application',
    description: 'Real-time dispatch dashboard and route coordination system engineered for regional logistics operators managing 120+ active fleet units.',
    tech: ['Next.js', 'Node.js', 'PostgreSQL'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    link: '#',
  },
  {
    title: 'Vanguard Corporate & Investor Hub',
    category: 'Website Development',
    description: 'High-performance marketing website with multi-tier service catalog, downloadable financial disclosures, and stakeholder reporting portals.',
    tech: ['Tailwind', 'Astro', 'Headless CMS'],
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
    link: '#',
  },
  {
    title: 'Medix Operational Core',
    category: 'Business System',
    description: 'Multi-branch clinic patient scheduling, billing management, and confidential medical administrative system deployed across 8 locations.',
    tech: ['TypeScript', 'PostgreSQL', 'Docker'],
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
    link: '#',
  },
];

// ─── WorkCard ─────────────────────────────────────────────────────────────────

const WorkCard = ({ project, index }: { project: Project; index: number }) => {
  const { ref, visible } = useInView(0.08);
  return (
    <article
      ref={ref}
      className="flex flex-col border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-white dark:bg-slate-900 hover:shadow-lg transition-shadow duration-300"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(22px)',
        transition: `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`,
      }}
    >
      {/* Screenshot mockup */}
      <div className="relative h-52 bg-slate-100 dark:bg-slate-800 overflow-hidden">
        {/* Category badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2.5 py-1 rounded text-[11px] font-semibold bg-slate-900/80 text-white backdrop-blur-sm">
            {project.category}
          </span>
        </div>
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 leading-snug">
          {project.title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-5 flex-1">
          {project.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex flex-wrap gap-1.5">
            {project.tech.slice(0, 3).map((t, i) => (
              <span key={i} className="text-[11px] text-slate-500 dark:text-slate-400">
                {t}{i < Math.min(project.tech.length, 3) - 1 ? ' •' : ''}
              </span>
            ))}
          </div>
          {project.link && project.link !== '#' ? (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap"
            >
              View Case Study
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 whitespace-nowrap">
              View Case Study
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

// ─── FAQItem ──────────────────────────────────────────────────────────────────

const FAQItem = ({ q, a, index }: { q: string; a: string; index: number }) => {
  const [open, setOpen] = useState(false);
  const { ref, visible } = useInView(0.08);
  return (
    <div
      ref={ref}
      className="border-b border-slate-200 dark:border-slate-800"
      style={{
        opacity: visible ? 1 : 0,
        transition: `opacity 0.4s ease ${index * 0.06}s`,
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left gap-4 group"
      >
        <span className="text-sm text-slate-800 dark:text-slate-200 font-medium group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
          {q}
        </span>
        <svg
          className="w-4 h-4 flex-shrink-0 text-slate-400 transition-transform duration-300"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? '300px' : '0px' }}
      >
        <p className="pb-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{a}</p>
      </div>
    </div>
  );
};

// ─── HomePage ─────────────────────────────────────────────────────────────────

const HomePage = () => {
  const [projects, setProjects] = useState<Project[]>(defaultProjects);

  useEffect(() => {
    fetch(API_ENDPOINTS.projects)
      .then((r) => r.json())
      .then((res) => {
        if (res.status === 'success' && Array.isArray(res.data) && res.data.length >= 3) {
          setProjects(res.data.slice(0, 3));
        }
      })
      .catch(() => {});
  }, []);

  // Section-level scroll refs
  const workSec = useInView(0.1);
  const buildSec = useInView(0.1);
  const builtSec = useInView(0.1);
  const processSec = useInView(0.1);
  const faqSec = useInView(0.1);
  const ctaSec = useInView(0.15);

  const reveal = (visible: boolean, delay = 0): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(20px)',
    transition: `opacity 0.55s ease ${delay}s, transform 0.55s ease ${delay}s`,
  });

  // Profile data for WhatsApp link
  const [whatsapp, setWhatsapp] = useState('081234567890');
  useEffect(() => {
    fetch(API_ENDPOINTS.profile)
      .then((r) => r.json())
      .then((res) => { if (res.data?.whatsapp) setWhatsapp(res.data.whatsapp); })
      .catch(() => {});
  }, []);

  return (
    <>
      <Hero />

      {/* ────────────────────────────────────────────────────────────────────
          STRIP — SERVICE TEASER (between Hero and Selected Work)
      ──────────────────────────────────────────────────────────────────── */}
      <ServiceTeaserStrip />

      {/* ────────────────────────────────────────────────────────────────────
          SECTION 1 — SELECTED WORK
      ──────────────────────────────────────────────────────────────────── */}
      <section
        id="projects"
        className="w-full bg-white dark:bg-[#080D1D] py-20 lg:py-28 border-b border-slate-200 dark:border-slate-800/60"
      >
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">

          {/* Header row */}
          <div
            ref={workSec.ref}
            style={reveal(workSec.visible)}
            className="mb-10"
          >
            {/* Label */}
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-500">
              Portfolio
            </span>

            <div className="mt-2 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                  Selected Work
                </h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                  Digital products and websites designed to solve real business operational friction.
                </p>
              </div>
              <a
                href="/projects"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap self-start sm:self-auto"
              >
                Explore All Projects
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p, i) => (
              <WorkCard key={p.id ?? i} project={p} index={i} />
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-10 flex justify-center" style={reveal(workSec.visible, 0.3)}>
            <a
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md border border-slate-300 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200"
            >
              View Full Portfolio Directory
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────
          SECTION 2 — WHAT WE BUILD
      ──────────────────────────────────────────────────────────────────── */}
      <section
        id="services"
        className="w-full bg-slate-50 dark:bg-[#080D1D] py-20 lg:py-28 border-b border-slate-200 dark:border-slate-800/60"
      >
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">

          {/* Header */}
          <div ref={buildSec.ref} style={reveal(buildSec.visible)} className="mb-12">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-500">
              Our Services
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-slate-900 dark:text-white">
              What We Build
            </h2>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed">
              Practical digital solutions, designed around how your business works rather than force-fitting generic templates.
            </p>
          </div>

          {/* Two service cards */}
          <div className="grid md:grid-cols-2 gap-6">

            {/* Card 1 — Website Development */}
            <WhatWeBuiltCard
              delay={0}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
              title="Website Development"
              description="Purpose-built web experiences that position your organization with prestige, explain complex commercial offerings with clarity, and turn visitors into qualified leads."
              items={[
                { title: 'Corporate & Enterprise Profiles', desc: 'Architectural design layouts conveying institutional credibility, trust signals, and service depth.' },
                { title: 'High-Converting Landing Engines', desc: 'Lightning-fast static performance, semantic SEO structures, and frictionless conversion funnels.' },
                { title: 'Catalog & Interactive Showcases', desc: 'Structured asset exploration, filtered search capabilities, and rich interactive media modules.' },
              ]}
              techStack={['Next.js', 'Tailwind CSS', 'TypeScript', 'Vercel Edge']}
              ctaLabel="View Website Engineering Capabilities"
            />

            {/* Card 2 — Web Applications */}
            <WhatWeBuiltCard
              delay={0.1}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              }
              title="Web Applications & Digital Systems"
              description="Full-lifecycle engineering of bespoke cloud software that eliminates manual spreadsheet chaos, secures internal data, and automates multi-departmental operations."
              items={[
                { title: 'Custom Portals & Real-time Dashboards', desc: 'Multi-role authentication, client self-service hubs, and clean operational data visualization.' },
                { title: 'Operational & Scheduling Apps', desc: 'Inventory tracking, dispatch workflows, client booking systems, and automated status notifications.' },
                { title: 'Internal Tooling & Database Admin', desc: 'Secure administrative portals, robust audit logging, third-party API webhooks, and reporting exports.' },
              ]}
              techStack={['PostgreSQL', 'Node.js', 'REST / GraphQL', 'Docker / AWS']}
              ctaLabel="View Application Engineering Details"
            />
          </div>

          {/* Bottom CTA */}
          <div className="mt-10 flex justify-center" style={reveal(buildSec.visible, 0.35)}>
            <button
              onClick={() => smoothScrollTo('#contact')}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold text-sm tracking-wide transition-colors duration-200"
            >
              Explore All Services & Technical Capabilities
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────
          SECTION 3 — BUILT AROUND YOUR BUSINESS
      ──────────────────────────────────────────────────────────────────── */}
      <section className="w-full bg-white dark:bg-[#080D1D] py-20 lg:py-28 border-b border-slate-200 dark:border-slate-800/60">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">

          <div ref={builtSec.ref} style={reveal(builtSec.visible)} className="mb-14">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-500">
              Our Philosophy
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-slate-900 dark:text-white">
              Built Around Your Business.
            </h2>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
              A direct, pragmatic studio approach focused on clarity, technical quality, and real business utility.
            </p>
          </div>

          {/* 4-column grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            {[
              {
                num: '01', tag: 'DISCOVERY',
                title: 'Understand Before Building',
                desc: 'We uncover true operational bottlenecks and revenue objectives before writing a single line of code or designing arbitrary wireframes.',
                tagline: 'Root-cause clarity',
              },
              {
                num: '02', tag: 'TRANSPARENCY',
                title: 'Explicit Scope & Deliverables',
                desc: 'Predictable roadmaps, explicit project specifications, fixed-price milestones, and zero ambiguous billing surprises.',
                tagline: 'Transparent milestones',
              },
              {
                num: '03', tag: 'CRAFT',
                title: 'Usability & Maintainability',
                desc: 'Interfaces crafted for human cognitive ease paired with clean, modular codebases that your internal teams can effortlessly maintain.',
                tagline: 'Modular architectures',
              },
              {
                num: '04', tag: 'CONTINUITY',
                title: 'Clear Handover & Support',
                desc: 'Full documentation, total source code ownership, training recordings, and structured ongoing SLA support agreements.',
                tagline: 'Zero vendor lock-in',
              },
            ].map((item, i) => (
              <PhilosophyCard key={i} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────
          SECTION 4 — FROM IDEA TO LAUNCH (dark)
      ──────────────────────────────────────────────────────────────────── */}
      <section className="w-full bg-slate-950 dark:bg-[#04060F] py-20 lg:py-28 border-b border-slate-800/60">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">

          <div ref={processSec.ref} style={reveal(processSec.visible)} className="mb-14">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-500">
              Methodology
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-white">
              From Idea to Launch.
            </h2>
            <p className="mt-3 text-sm text-slate-400 max-w-md leading-relaxed">
              A structured, transparent delivery methodology ensuring velocity without sacrificing engineering integrity.
            </p>
          </div>

          {/* 5-step grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {[
              {
                step: 'STEP_01', title: 'Consultation',
                desc: 'Discovery conversation, operational requirement mapping, and technical feasibility appraisal.',
                icon: '◎', tagline: 'Initial Brief',
              },
              {
                step: 'STEP_02', title: 'Scope & Proposal',
                desc: 'Detailed technical specification, sprint cadence, fixed timeline, and transparent investment breakdown.',
                icon: '$', tagline: 'Fixed Quote',
              },
              {
                step: 'STEP_03', title: 'Design & Build',
                desc: 'Interactive high-fidelity prototypes, front-end architecture, database schema, and API integration.',
                icon: '<>', tagline: 'Iterative Sprints',
              },
              {
                step: 'STEP_04', title: 'Testing & QA',
                desc: 'Cross-browser testing, accessibility audit, security hardening, and rigorous client acceptance review.',
                icon: '✓', tagline: 'Zero Regression',
              },
              {
                step: 'STEP_05', title: 'Launch & Scale',
                desc: 'Production DNS deployment, cloud infrastructure provisioning, team training, and handover.',
                icon: '↑', tagline: 'Live Production',
              },
            ].map((step, i) => (
              <ProcessStepCard key={i} step={step} index={i} total={5} />
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────
          SECTION 5 — FAQ
      ──────────────────────────────────────────────────────────────────── */}
      <section
        id="faq"
        className="w-full bg-white dark:bg-[#080D1D] py-20 lg:py-28 border-b border-slate-200 dark:border-slate-800/60"
      >
        <div className="max-w-[760px] mx-auto px-6 lg:px-8">

          <div ref={faqSec.ref} style={reveal(faqSec.visible)} className="text-center mb-10">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-500">
              Common Questions
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Clear, straightforward answers regarding commissioning work with Alvaeryn.
            </p>
          </div>

          {/* Accordion */}
          <div className="border-t border-slate-200 dark:border-slate-800">
            {[
              { q: 'How much does a typical project cost?', a: 'Projects start from Rp 399K for a landing page up to Rp 3JT+ for full-stack applications. Every project receives a fixed-price proposal with milestone-based billing — no surprise invoices.' },
              { q: 'How long does development take?', a: 'Landing pages 5–7 days, multi-page business websites 10–14 days, and full-stack apps 21–30 days. We provide a detailed timeline in the proposal before work begins.' },
              { q: 'Can I request revisions during the process?', a: 'Yes. Revision rounds are built into every sprint cycle. For design, we allow up to 3 major revision rounds before final sign-off. Additional revisions are billed transparently.' },
              { q: 'Do you handle domain configuration and cloud hosting?', a: 'Absolutely. We manage DNS configuration, SSL certificates, and cloud deployment (Vercel, Railway, or VPS). Hosting recommendations are tailored to your traffic expectations and budget.' },
              { q: 'Is ongoing support and maintenance available after launch?', a: 'Yes. We offer monthly SLA packages covering security patches, performance monitoring, content updates, and priority bug resolution. Details are outlined in the proposal.' },
            ].map((item, i) => (
              <FAQItem key={i} q={item.q} a={item.a} index={i} />
            ))}
          </div>

          {/* Footer note */}
          <p className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500">
            Have an architectural or timeline question not covered here?{' '}
            <button
              onClick={() => smoothScrollTo('#contact')}
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Get in touch directly.
            </button>
          </p>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────
          SECTION 6 — CTA: LET'S BUILD SOMETHING USEFUL
      ──────────────────────────────────────────────────────────────────── */}
      <section className="w-full bg-slate-950 dark:bg-[#04060F] py-24 lg:py-32">
        <div
          ref={ctaSec.ref}
          style={reveal(ctaSec.visible)}
          className="max-w-[680px] mx-auto px-6 lg:px-8 text-center"
        >
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-500">
            Start a Collaboration
          </span>

          <h2 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08]">
            Let's Build Something Useful.
          </h2>

          <p className="mt-5 text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
            Tell us about your business and the digital solution you have in mind. We'll provide a clear scope, roadmap, and estimate within 24 business hours.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => smoothScrollTo('#contact')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm tracking-wide transition-colors duration-200 shadow-lg shadow-blue-600/25"
            >
              Discuss Your Project
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>

            <a
              href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-semibold text-sm tracking-wide transition-all duration-200"
            >
              {/* WhatsApp icon */}
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Contact via WhatsApp
            </a>
          </div>

          {/* Trust line */}
          <p className="mt-6 text-xs text-slate-600 flex items-center justify-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span>
            Direct response within 24 business hours • alzera.web.id
          </p>
        </div>
      </section>
    </>
  );
};

// ─── ServiceTeaserStrip ───────────────────────────────────────────────────────
// The 3-card horizontal strip visible just below the Hero

const teaserItems = [
  {
    title: 'Website Development',
    desc: 'High-performance corporate profiles, marketing engines, and product catalogs built for conversion and SEO.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Web Applications',
    desc: 'Custom interactive client portals, real-time analytics consoles, SaaS platforms, and internal tooling.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    title: 'Business Systems',
    desc: 'Workflow automation tools, structured database administration, role-based workflows, and legacy integrations.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12H3l9-9 9 9h-2M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7M9 21v-6a2 2 0 012-2h2a2 2 0 012 2v6" />
      </svg>
    ),
  },
];

const TeaserCard = ({ item, index }: { item: typeof teaserItems[number]; index: number }) => {
  const { ref, visible } = useInView(0.1);
  return (
    <div
      ref={ref}
      className="flex items-start gap-4 p-6 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-blue-400/40 dark:hover:border-blue-600/40 hover:shadow-md transition-all duration-300"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity 0.45s ease ${index * 0.1}s, transform 0.45s ease ${index * 0.1}s`,
      }}
    >
      {/* Icon box */}
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
        {item.icon}
      </div>
      <div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{item.title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
      </div>
    </div>
  );
};

const ServiceTeaserStrip = () => {
  const { ref, visible } = useInView(0.1);
  return (
    <div
      ref={ref}
      className="w-full bg-slate-50 dark:bg-[#0B1120] border-b border-slate-200 dark:border-slate-800/60 py-10"
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.5s ease',
      }}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {teaserItems.map((item, i) => (
          <TeaserCard key={i} item={item} index={i} />
        ))}
      </div>
    </div>
  );
};

// ─── WhatWeBuiltCard ──────────────────────────────────────────────────────────

interface WhatWeBuiltItem { title: string; desc: string; }

const WhatWeBuiltCard = ({
  delay, icon, title, description, items, techStack, ctaLabel,
}: {
  delay: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  items: WhatWeBuiltItem[];
  techStack: string[];
  ctaLabel: string;
}) => {
  const { ref, visible } = useInView(0.08);
  return (
    <div
      ref={ref}
      className="flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-8 hover:shadow-md transition-shadow duration-300"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(22px)',
        transition: `opacity 0.5s ease ${delay}s, transform 0.5s ease ${delay}s`,
      }}
    >
      {/* Icon */}
      <div className="mb-5 w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
        {icon}
      </div>

      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">{description}</p>

      {/* Feature list */}
      <ul className="space-y-4 flex-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full border-2 border-blue-500 dark:border-blue-400 flex items-center justify-center">
              <svg className="w-2 h-2 text-blue-500 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.title}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
            </div>
          </li>
        ))}
      </ul>

      {/* Tech stack */}
      <div className="mt-7 pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2">
        {techStack.map((t, i) => (
          <span key={i} className="px-2.5 py-1 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {t}
          </span>
        ))}
      </div>

      {/* CTA link */}
      <button
        onClick={() => smoothScrollTo('#contact')}
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline self-start"
      >
        {ctaLabel}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>
    </div>
  );
};

// ─── PhilosophyCard ───────────────────────────────────────────────────────────

const PhilosophyCard = ({
  item, index,
}: {
  item: { num: string; tag: string; title: string; desc: string; tagline: string };
  index: number;
}) => {
  const { ref, visible } = useInView(0.08);
  return (
    <div
      ref={ref}
      className="bg-white dark:bg-[#080D1D] p-8 flex flex-col gap-4"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(18px)',
        transition: `opacity 0.5s ease ${index * 0.08}s, transform 0.5s ease ${index * 0.08}s`,
      }}
    >
      {/* Step number + tag */}
      <div className="flex items-center gap-2">
        <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">{item.num}</span>
        <span className="text-[10px]">// </span>
        <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          {item.tag}
        </span>
      </div>

      <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">{item.title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-1">{item.desc}</p>

      {/* Tagline */}
      <p className="text-xs italic text-slate-400 dark:text-slate-500 mt-auto">{item.tagline}</p>
    </div>
  );
};

// ─── ProcessStepCard ──────────────────────────────────────────────────────────

const ProcessStepCard = ({
  step, index, total,
}: {
  step: { step: string; title: string; desc: string; icon: string; tagline: string };
  index: number;
  total: number;
}) => {
  const { ref, visible } = useInView(0.08);
  return (
    <div
      ref={ref}
      className="relative flex flex-col gap-3 px-0"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(18px)',
        transition: `opacity 0.5s ease ${index * 0.08}s, transform 0.5s ease ${index * 0.08}s`,
      }}
    >
      {/* Step label */}
      <span className="font-mono text-[10px] text-slate-500 tracking-widest">{step.step}</span>

      {/* Divider line */}
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-slate-700"></div>
        {index < total - 1 && <div className="hidden lg:block w-2 h-2 rounded-full bg-slate-600 flex-shrink-0"></div>}
      </div>

      <h3 className="text-sm font-bold text-white">{step.title}</h3>
      <p className="text-xs text-slate-400 leading-relaxed flex-1">{step.desc}</p>

      {/* Icon + tagline */}
      <div className="flex items-center gap-2 mt-2">
        <span className="font-mono text-[11px] text-slate-500">{step.icon}</span>
        <span className="text-[11px] text-slate-500 italic">{step.tagline}</span>
      </div>
    </div>
  );
};

export default HomePage;

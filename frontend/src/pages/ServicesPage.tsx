import { useState, useEffect, useRef } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { smoothScrollTo } from '../utils/scroll';

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

const reveal = (visible: boolean, delay = 0): React.CSSProperties => ({
  opacity: visible ? 1 : 0,
  transform: visible ? 'translateY(0)' : 'translateY(20px)',
  transition: `opacity 0.55s ease ${delay}s, transform 0.55s ease ${delay}s`,
});

// ─── FAQ Item ─────────────────────────────────────────────────────────────────

const FAQItem = ({ q, a, index }: { q: string; a: string; index: number }) => {
  const [open, setOpen] = useState(index === 0);
  const { ref, visible } = useInView(0.08);
  return (
    <div
      ref={ref}
      className="border-b border-slate-200 dark:border-slate-800"
      style={reveal(visible, index * 0.06)}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left gap-4 group"
      >
        <span className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
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

// ─── ServicesPage ─────────────────────────────────────────────────────────────

const ServicesPage = () => {
  const [whatsapp, setWhatsapp] = useState('628818411915');
  const [email, setEmail] = useState('contact@alzera.web.id');

  useEffect(() => {
    window.scrollTo({ top: 0 });
    fetch(API_ENDPOINTS.profile)
      .then((r) => r.json())
      .then((res) => {
        if (res.data?.whatsapp) setWhatsapp(res.data.whatsapp.replace(/\D/g, ''));
        if (res.data?.email) setEmail(res.data.email);
      })
      .catch(() => {});
  }, []);

  const heroSec = useInView(0.1);
  const capSec = useInView(0.1);
  const pillar1 = useInView(0.08);
  const pillar2 = useInView(0.08);
  const triageSec = useInView(0.1);
  const scopeSec = useInView(0.1);
  const techSec = useInView(0.1);
  const faqSec = useInView(0.1);
  const ctaSec = useInView(0.15);

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────────
          HERO
      ───────────────────────────────────────────────────────────────── */}
      <section className="w-full bg-[#080D1D] pt-28 pb-16 lg:pt-32 lg:pb-20 border-b border-[#1E293B]/60 overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">

            {/* Left */}
            <div
              ref={heroSec.ref}
              className="lg:col-span-6"
              style={reveal(heroSec.visible)}
            >
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 mb-5">
                <span className="font-mono text-[10px] text-blue-500 tracking-widest uppercase">✦ Our Services</span>
                <span className="text-slate-700 text-[10px]">/</span>
                <span className="font-mono text-[10px] text-slate-500 tracking-widest uppercase">ALZERA Digital Studio</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold tracking-tight text-white leading-[1.06] mb-5">
                Digital Solutions for the Way You Work.
              </h1>
              <p className="text-[15px] text-[#8E9DB5] leading-relaxed max-w-lg mb-8">
                From high-conversion business websites to bespoke operational web applications, we construct practical digital products aligned with your goals, operational workflows, and end customers.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => smoothScrollTo('#contact')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm tracking-wide transition-colors shadow-lg shadow-blue-600/25"
                >
                  Discuss Your Project
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <button
                  onClick={() => smoothScrollTo('#capabilities')}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Explore Our Services
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Stats */}
              <div className="mt-10 flex flex-wrap gap-8 pt-8 border-t border-[#1E293B]/60">
                {[
                  { value: '100%', label: 'Engineered to Scope' },
                  { value: '2–8 Wks', label: 'Average Delivery' },
                  { value: '0 Bloat', label: 'Clean Architecture' },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="text-2xl font-bold text-white">{s.value}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — system card mockup */}
            <div
              className="lg:col-span-6 flex justify-end"
              style={reveal(heroSec.visible, 0.15)}
            >
              <div className="w-full max-w-[440px] rounded-xl border border-[#1E293B] bg-[#0D1526] p-5 shadow-2xl">
                {/* Top bar */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                  </div>
                  <span className="font-mono text-[10px] text-slate-500">alzera.system/v2.4</span>
                </div>

                {/* Rows */}
                {[
                  {
                    icon: (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    ),
                    title: 'Web Presence Layer',
                    desc: 'Profile websites, responsive layout systems & high-speed...',
                    tags: ['SSR', 'SEO'],
                  },
                  {
                    icon: (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    ),
                    title: 'Custom Web Systems',
                    desc: 'Operational backends, booking pipelines & role-based...',
                    tags: ['CRUD', 'Auth'],
                  },
                ].map((row, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-[#111827] mb-2">
                    <div className="w-8 h-8 rounded-md bg-blue-600/20 border border-blue-600/30 flex items-center justify-center text-blue-400 flex-shrink-0">
                      {row.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-white">{row.title}</span>
                        <div className="flex gap-1">
                          {row.tags.map((tag) => (
                            <span key={tag} className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-600/20 text-blue-400 border border-blue-600/20">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate">{row.desc}</p>
                    </div>
                  </div>
                ))}

                {/* Metrics */}
                <div className="mt-4 grid grid-cols-2 gap-3 pt-4 border-t border-[#1E293B]">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Latency Target</p>
                    <p className="text-sm font-bold text-white">&lt; 350ms TTFB</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Design Cohesion</p>
                    <p className="text-sm font-bold text-white">100% Bespoke</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          CAPABILITIES MATRIX
      ───────────────────────────────────────────────────────────────── */}
      <section id="capabilities" className="w-full bg-white dark:bg-[#080D1D] py-20 lg:py-28 border-b border-slate-200 dark:border-slate-800/60">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">

          <div ref={capSec.ref} style={reveal(capSec.visible)} className="mb-14">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-500">
              Capabilities Matrix
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-slate-900 dark:text-white">
              What Can We Build for You?
            </h2>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed">
              Choose a foundational starting point. Every solution is architected from clean slate principles and configured to your exact enterprise requirements.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">

            {/* Pillar 1 — Website Development */}
            <ServicePillarCard
              inViewRef={pillar1.ref}
              visible={pillar1.visible}
              delay={0}
              num="SERVICE PILLAR 01"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
              title="Website Development"
              description="Build a credible, high-performing online presence that clearly introduces your business, showcases catalog offerings, and transforms passive visitors into committed inquiries."
              items={[
                {
                  num: '1',
                  title: 'Company Profile Website',
                  desc: 'Modern brand introduction, narrative storytelling, dynamic team information, certified credibility blocks, and responsive typography layouts across all viewport sizes.',
                },
                {
                  num: '2',
                  title: 'Campaign & Product Landing Pages',
                  desc: 'Laser-focused service or product launch decks; frictionless call-to-action touchpoints, data-backed visual hierarchy engineered to convert inbound marketing traffic.',
                },
                {
                  num: '3',
                  title: 'Product & Business Catalogs',
                  desc: 'Structured catalog views, multi-tier categories, product spec sheets, rapid filtering, and automated one-tap WhatsApp / direct quotation lead capture.',
                },
              ]}
              deliverables={[
                'Responsive UI templates', 'Reusable component library',
                'Interactive contact forms', 'Technical on-page SEO',
                'SSL, Domain routing & Production deployment',
              ]}
              ctaLabel="Discuss a Website Project"
            />

            {/* Pillar 2 — Web Applications */}
            <ServicePillarCard
              inViewRef={pillar2.ref}
              visible={pillar2.visible}
              delay={0.1}
              num="SERVICE PILLAR 02"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              }
              title="Web Applications & Systems"
              description="Turn error-prone spreadsheets and manual procedures into deterministic, high-throughput digital systems engineered directly around your operational mechanics."
              items={[
                {
                  num: '1',
                  title: 'Custom Web Applications',
                  desc: 'Interactive multi-tier interfaces tailored to discrete business requirements, strict user privileges, and reliable relational data stores.',
                },
                {
                  num: '2',
                  title: 'Booking & Operational Systems',
                  desc: 'Frictionless calendar scheduling, real-time inventory locking, dynamic status updates, administrative dispatch consoles, and notification feeds.',
                },
                {
                  num: '3',
                  title: 'Dashboards & Data Management',
                  desc: 'High-density KPI monitors, full CRUD interfaces, dynamic CSV/PDF reporting, robust search filters, and unified operational audit logging.',
                },
              ]}
              deliverables={[
                'Engineered UI/UX application flows', 'Custom backend API & DB schemas',
                'Role-based access & auth systems', 'Automated validation & sanitization',
                'Integration testing, deployment & runbook',
              ]}
              ctaLabel="Discuss an Application Project"
            />

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          TRIAGE — NOT SURE WHAT YOU NEED?
      ───────────────────────────────────────────────────────────────── */}
      <section className="w-full bg-slate-50 dark:bg-[#080D1D] py-20 lg:py-28 border-b border-slate-200 dark:border-slate-800/60">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">

          <div ref={triageSec.ref} className="mb-12">
            <div style={reveal(triageSec.visible)} className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
              <div>
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-500">
                  Triage &amp; Orientation
                </span>
                <h2 className="mt-2 text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-slate-900 dark:text-white">
                  Not Sure What You Need?
                </h2>
                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed">
                  Tell us what bottleneck you are facing. We assist in determining a lean, practical entry point.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </span>
                Studio Advisory: Fast direct consultation without jargon
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                num: '01',
                title: '"I Need a Professional Online Presence"',
                desc: 'Best for companies needing an authoritative digital footprint to present core credentials, validate marketing campaigns, and capture direct client inquiries.',
                path: 'Website Development',
                cta: 'Discuss Online Presence',
              },
              {
                num: '02',
                title: '"My Business Needs a Better Workflow"',
                desc: 'Best for teams drowning in spreadsheets, fragmented WhatsApp messages, or outgrown tools needing centralized booking, task pipelines, or client portals.',
                path: 'Web Applications & Digital Systems',
                cta: 'Discuss Workflow System',
              },
              {
                num: '03',
                title: '"I Have a Specific Custom Idea"',
                desc: 'For ambitious concepts with specialized parameters, multi-tenant requirements, or external hardware/API integrations requiring discovery engineering.',
                path: 'Studio Architectural Discovery',
                cta: 'Book Studio Consultation',
                dark: true,
              },
            ].map((card, i) => {
              const { ref: cRef, visible: cVis } = useTriageCard(i);
              return (
                <div
                  key={i}
                  ref={cRef}
                  className={`flex flex-col rounded-xl border p-7 ${card.dark
                    ? 'bg-slate-900 dark:bg-slate-900 border-slate-700'
                    : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                  }`}
                  style={reveal(cVis, i * 0.08)}
                >
                  <span className="font-mono text-xs font-bold text-slate-400 mb-4">{card.num}</span>
                  <h3 className={`text-base font-bold leading-snug mb-3 ${card.dark ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                    {card.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-1 mb-5">{card.desc}</p>
                  <div className="mt-auto">
                    <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">Recommended Path</p>
                    <p className={`text-sm font-bold mb-4 ${card.dark ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{card.path}</p>
                    <button
                      onClick={() => smoothScrollTo('#contact')}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-500 hover:text-blue-400 transition-colors"
                    >
                      {card.cta}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          SCOPE & DELIVERABLES
      ───────────────────────────────────────────────────────────────── */}
      <section className="w-full bg-white dark:bg-[#080D1D] py-20 lg:py-28 border-b border-slate-200 dark:border-slate-800/60">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">

          <div className="grid lg:grid-cols-12 gap-10 items-start mb-16">
            {/* Left */}
            <div ref={scopeSec.ref} className="lg:col-span-7" style={reveal(scopeSec.visible)}>
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-500">
                Methodical Precision
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-slate-900 dark:text-white">
                Clear Scope. Practical Deliverables.
              </h2>
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed">
                Every ALZERA engagement is executed with zero ambiguity. The exact deliverables, interface states, and technical boundaries are documented and agreed upon prior to code execution.
              </p>
            </div>

            {/* Right — commitment box */}
            <div
              className="lg:col-span-5 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-950/30 p-6"
              style={reveal(scopeSec.visible, 0.15)}
            >
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">Commitment to Scope Integrity</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                No surprise invoices. Integrations, ongoing maintenance, domain acquisitions, and third-party SaaS licenses are defined clearly in written milestone schedules.
              </p>
            </div>
          </div>

          {/* 4-step process */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                num: '01', title: 'Requirements',
                desc: 'In-depth analysis of the core business problem, user profile personas, and the non-negotiable functional requirements for project viability.',
                output: 'Business Specification Document',
                icon: '◎',
              },
              {
                num: '02', title: 'Scope Architecture',
                desc: 'Explicit mapping of pages, component contracts, relational database schemas, external API touchpoints, and timeline milestones.',
                output: 'Sprint & Deliverables Checklist',
                icon: 'Λ',
              },
              {
                num: '03', title: 'Implementation',
                desc: 'Iterative, high-fidelity development. Codebase builds undergo end-to-end performance testing, responsive tests, and client staging previews.',
                output: 'Functional Staging Environment',
                icon: '</>',
              },
              {
                num: '04', title: 'Handover & Launch',
                desc: 'Production infrastructure setup, SSL hardening, DNS propagation, administrator training, and transition to maintenance support.',
                output: 'Live System & Source Access',
                icon: '↑',
              },
            ].map((step, i) => {
              const { ref: sRef, visible: sVis } = useScopeStep(i);
              return (
                <div
                  key={i}
                  ref={sRef}
                  className="flex flex-col gap-3"
                  style={reveal(sVis, i * 0.09)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{step.num}</span>
                    <span className="font-mono text-sm text-slate-400">{step.icon}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{step.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-1">{step.desc}</p>
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Key Output</p>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{step.output}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          TECH STACK
      ───────────────────────────────────────────────────────────────── */}
      <section className="w-full bg-slate-50 dark:bg-[#080D1D] py-20 lg:py-24 border-b border-slate-200 dark:border-slate-800/60">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">

          <div ref={techSec.ref} style={reveal(techSec.visible)} className="mb-12">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-500">
              Engineered for Durability
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Technology That Fits the Project
            </h2>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed">
              We reject bloated frameworks and hype-driven architectural churn. We select implementation stacks based strictly on performance, long-term maintainability, team velocity, and verifiable security benchmarks.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              {
                label: 'Responsive Web', sub: 'Adaptive layouts',
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
              },
              {
                label: 'Frontend Dev', sub: 'Zero-lag render',
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
              },
              {
                label: 'Backend Dev', sub: 'Robust logic engines',
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" /></svg>,
              },
              {
                label: 'Database Setup', sub: 'Relational Integrity',
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" /></svg>,
              },
              {
                label: 'Auth & Access', sub: 'RBAC & Session flow',
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
              },
              {
                label: 'Deploy & Test', sub: 'CI/CD pipelines',
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>,
              },
            ].map((item, i) => {
              const { ref: tRef, visible: tVis } = useTechCard(i);
              return (
                <div
                  key={i}
                  ref={tRef}
                  className="flex flex-col items-center text-center gap-3 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60"
                  style={reveal(tVis, i * 0.07)}
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{item.label}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-xs text-slate-400 flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            All codebases crafted to standard OWASP Top-10 & Core Web Vitals guidelines.
            <span className="ml-auto text-slate-500">v2025.1 Production Baseline</span>
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          FAQ
      ───────────────────────────────────────────────────────────────── */}
      <section className="w-full bg-white dark:bg-[#080D1D] py-20 lg:py-28 border-b border-slate-200 dark:border-slate-800/60">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12">

            {/* Left */}
            <div ref={faqSec.ref} className="lg:col-span-4" style={reveal(faqSec.visible)}>
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-500">FAQ</span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
                Common questions regarding ALZERA's development process, timelines, cost estimations, and post-launch guarantees.
              </p>

              <div className="mt-8 p-5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50">
                <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">Have an unconventional question?</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
                  We provide direct engineering counsel without high-pressure sales reps.
                </p>
                <button
                  onClick={() => smoothScrollTo('#contact')}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Send direct question
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right */}
            <div className="lg:col-span-8 border-t border-slate-200 dark:border-slate-800">
              {[
                { q: 'How much does a website or web application cost?', a: 'Pricing depends strictly on agreed functional scope, integrations, and architectural complexity. Following our initial consultation, we provide a transparent, fixed-milestone proposal with zero hidden clauses so you know exactly what is included prior to kickoff.' },
                { q: 'How long does a typical project take?', a: 'Landing pages 5–7 days, multi-page business websites 10–14 days, and full-stack apps 21–30 days. Every project begins with a detailed timeline in the proposal.' },
                { q: 'Can I request modifications during development?', a: 'Yes. Revision rounds are built into every sprint cycle. For design, up to 3 major revision rounds before final sign-off. Additional revisions are billed transparently.' },
                { q: 'Do you handle domain registration and server hosting?', a: 'Absolutely. We manage DNS configuration, SSL certificates, and cloud deployment (Vercel, Railway, or VPS). Hosting recommendations are tailored to your traffic and budget.' },
                { q: 'Can you maintain the application after public launch?', a: 'Yes. Monthly SLA packages cover security patches, performance monitoring, content updates, and priority bug resolution. Details are outlined in the proposal.' },
                { q: 'What if I only have a concept and no technical specification?', a: 'That\'s the norm. We provide a discovery session to translate your business goals into a concrete technical specification before any development work begins.' },
              ].map((item, i) => (
                <FAQItem key={i} q={item.q} a={item.a} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          CTA
      ───────────────────────────────────────────────────────────────── */}
      <section className="w-full bg-slate-950 dark:bg-[#04060F] py-20 lg:py-28">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 items-center">

            {/* Left */}
            <div ref={ctaSec.ref} className="lg:col-span-6" style={reveal(ctaSec.visible)}>
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-500">
                Direct Engineering Consultation
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                Let's Find the Right Solution.
              </h2>
              <p className="mt-4 text-sm text-slate-400 leading-relaxed max-w-md">
                Share your business needs with ALZERA. We'll analyze your goals, scope out requirements, and prescribe a clear, practical roadmap to launch.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => smoothScrollTo('#contact')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm tracking-wide transition-colors shadow-lg shadow-blue-600/25"
                >
                  Discuss Your Project
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-semibold text-sm transition-all"
                >
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Contact via WhatsApp
                </a>
              </div>
            </div>

            {/* Right — status card */}
            <div className="lg:col-span-6" style={reveal(ctaSec.visible, 0.15)}>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-7">
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  <span className="text-sm font-semibold text-white">Consultation Window Open</span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed mb-5">
                  Direct inquiries receive a response with preliminary architectural feedback within 24 business hours.
                </p>
                <div className="space-y-2.5 text-sm border-t border-slate-800 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Direct Studio Desk:</span>
                    <a href={`mailto:${email}`} className="text-white font-medium hover:text-blue-400 transition-colors">{email}</a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Verified Domain:</span>
                    <span className="text-white font-medium">alzera.web.id</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

// ─── ServicePillarCard ────────────────────────────────────────────────────────

interface PillarItem { num: string; title: string; desc: string; }

const ServicePillarCard = ({
  inViewRef, visible, delay, num, icon, title, description, items, deliverables, ctaLabel,
}: {
  inViewRef: React.RefObject<HTMLDivElement>;
  visible: boolean;
  delay: number;
  num: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  items: PillarItem[];
  deliverables: string[];
  ctaLabel: string;
}) => (
  <div
    ref={inViewRef}
    className="flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden"
    style={reveal(visible, delay)}
  >
    {/* Header */}
    <div className="p-8 pb-6 border-b border-slate-100 dark:border-slate-800">
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-500 mb-3 block">{num}</span>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
    </div>

    {/* Items */}
    <div className="p-8 flex flex-col gap-5 flex-1">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="flex-shrink-0 w-5 h-5 rounded bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/40 flex items-center justify-center mt-0.5">
            <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400">{item.num}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-white mb-1">{item.title}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>

    {/* Deliverables */}
    <div className="px-8 py-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
      <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Typical Scope Deliverables:</p>
      <div className="flex flex-wrap gap-2">
        {deliverables.map((d, i) => (
          <span key={i} className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400">
            <svg className="w-3 h-3 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {d}
          </span>
        ))}
      </div>
    </div>

    {/* CTA */}
    <div className="px-8 py-5 border-t border-slate-100 dark:border-slate-800">
      <button
        onClick={() => smoothScrollTo('#contact')}
        className="w-full py-3 rounded-lg bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white font-semibold text-sm transition-colors text-center"
      >
        {ctaLabel} →
      </button>
    </div>
  </div>
);

// ─── Per-item hooks (avoid hooks-in-loops) ───────────────────────────────────

const useTriageCard = (i: number) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
};

const useScopeStep = (i: number) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
};

const useTechCard = (i: number) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
};

export default ServicesPage;

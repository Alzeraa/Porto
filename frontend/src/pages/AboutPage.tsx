import { useState, useEffect } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { API_ENDPOINTS } from '../config/api';

// ─── Icon components ──────────────────────────────────────────────────────────

const CheckIcon = () => (
  <svg className="w-4 h-4 flex-shrink-0 text-blue-500" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="7.5" stroke="currentColor" strokeOpacity="0.35" />
    <path d="M4.5 8l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    className={`w-5 h-5 transition-transform duration-300 flex-shrink-0 ${open ? 'rotate-180' : ''}`}
    viewBox="0 0 20 20" fill="none"
  >
    <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

// ─── Type Definitions ─────────────────────────────────────────────────────────

interface AboutSection {
  id: number;
  type: string;
  title: string;
  subtitle: string;
  items: any[];
  order_index: number;
}

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  order_index: number;
}

interface CoreFoundation {
  num: string;
  title: string;
  desc: string;
  bullets: string[];
  icon: React.ReactNode;
}

interface ProcessStage {
  stage: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
}

interface StudioEthics {
  title: string;
  desc: string;
  icon: React.ReactNode;
}

interface ServiceCap {
  title: string;
  desc: string;
  deliverables: string[];
  cta: string;
  href: string;
  icon: React.ReactNode;
}

interface PragmaticPoint {
  num: number;
  title: string;
  desc: string;
}

interface ClientSegment {
  title: string;
  desc: string;
  outcome: string;
  icon: React.ReactNode;
}

// ─── Main Component ───────────────────────────────────────────────────────────

const AboutPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [aboutSections, setAboutSections] = useState<AboutSection[]>([]);
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentLang, setCurrentLang] = useState('id');

  // Get language from localStorage or default to 'id'
  useEffect(() => {
    const storedLang = localStorage.getItem('alzera_language');
    if (storedLang) {
      setCurrentLang(storedLang);
    }
  }, []);

  // Scroll animations
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation(0.05);
  const { ref: originsRef, isVisible: originsVisible } = useScrollAnimation(0.05);
  const { ref: foundationsRef, isVisible: foundationsVisible } = useScrollAnimation(0.05);
  const { ref: processRef, isVisible: processVisible } = useScrollAnimation(0.05);
  const { ref: ethicsRef, isVisible: ethicsVisible } = useScrollAnimation(0.05);
  const { ref: servicesRef, isVisible: servicesVisible } = useScrollAnimation(0.05);
  const { ref: pragmaticRef, isVisible: pragmaticVisible } = useScrollAnimation(0.05);
  const { ref: clientRef, isVisible: clientVisible } = useScrollAnimation(0.05);
  const { ref: founderRef, isVisible: founderVisible } = useScrollAnimation(0.05);
  const { ref: faqRef, isVisible: faqVisible } = useScrollAnimation(0.05);
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation(0.05);

  useEffect(() => {
    // Fetch About Sections
    fetch(`${API_ENDPOINTS.aboutSections}?lang=${currentLang}`)
      .then(r => r.json())
      .then(res => {
        if (res.status === 'success' && Array.isArray(res.data)) {
          setAboutSections(res.data);
        }
      })
      .catch(err => console.error('Fetch about sections error:', err));

    // Fetch FAQ Items
    fetch(`${API_ENDPOINTS.faq}?lang=${currentLang}`)
      .then(r => r.json())
      .then(res => {
        if (res.status === 'success' && Array.isArray(res.data)) {
          setFaqItems(res.data);
        }
      })
      .catch(err => console.error('Fetch FAQ error:', err))
      .finally(() => setLoading(false));
  }, [currentLang]);

  // Parse dynamic data into component-friendly format
  const CORE_FOUNDATIONS: CoreFoundation[] = aboutSections
    .find(s => s.type === 'core_foundations')?.items || [
      { num: '01', title: 'Understand Before Building', desc: 'Start by understanding the business...', bullets: ['Root workflow analysis'], icon: <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10" cy="10" r="7" /><path d="M10 6v4l3 2" strokeLinecap="round" strokeLinejoin="round" /></svg> },
      { num: '02', title: 'Keep It Practical', desc: 'Choose features that serve a clear purpose...', bullets: ['Lean, dependency-conscious architecture'], icon: <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 6h12M4 10h8M4 14h5" strokeLinecap="round" /></svg> },
      { num: '03', title: 'Build for Real Use', desc: 'Create digital experiences that are immediately understandable...', bullets: ['Human-centered UI workflows'], icon: <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" /><path d="M4 4h12a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z" /></svg> },
    ];

  const PROCESS_STAGES: ProcessStage[] = aboutSections
    .find(s => s.type === 'process_stages')?.items || [
      { stage: 'STAGE 01', title: 'Listen & Understand', desc: 'Discuss operational goals...', icon: <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 2a4 4 0 014 4v1.5A2.5 2.5 0 019.5 10H8a4 4 0 01-4-4V6a4 4 0 014-4z" strokeLinecap="round" /><path d="M5 14a3 3 0 006 0" strokeLinecap="round" /></svg> },
      { stage: 'STAGE 02', title: 'Define the Scope', desc: 'Specify essential deliverables...', icon: <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="12" height="12" rx="1.5" /><path d="M5 8h6M8 5v6" strokeLinecap="round" /></svg> },
      { stage: 'STAGE 03', title: 'Design the UX', desc: 'Organize site architecture...', icon: <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="3" width="14" height="10" rx="1.5" /><path d="M5 6h6M5 9h4" strokeLinecap="round" /></svg> },
      { stage: 'STAGE 04', title: 'Build & Refine', desc: 'Implement production-grade code...', icon: <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 13l3-3 2 2 5-6" strokeLinecap="round" strokeLinejoin="round" /></svg> },
      { stage: 'STAGE 05', title: 'Launch & Handover', desc: 'Execute secure deployment...', icon: <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 2l1.5 4.5H14l-3.75 2.75 1.5 4.5L8 11.25 4.25 13.75l1.5-4.5L2 6.5h4.5L8 2z" strokeLinecap="round" strokeLinejoin="round" /></svg> },
    ];

  const STUDIO_ETHICS: StudioEthics[] = aboutSections
    .find(s => s.type === 'studio_ethics')?.items || [
      { title: 'Clear Communication', desc: 'We discuss technical trade-offs...', icon: <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H6l-4 3V5z" strokeLinecap="round" strokeLinejoin="round" /></svg> },
      { title: 'Defined Expectations', desc: 'Scope boundaries...', icon: <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" /><rect x="3" y="3" width="14" height="14" rx="2" /></svg> },
      { title: 'Thoughtful Execution', desc: 'We hold an uncompromising attitude...', icon: <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="16" height="13" rx="2" /><path d="M6 7h8M6 11h5" strokeLinecap="round" /></svg> },
      { title: 'Honest Collaboration', desc: 'If an idea is over-engineered...', icon: <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 10s1-6 6-6 6 6 6 6-1 6-6 6-6-6-6-6z" /><circle cx="10" cy="10" r="2" /></svg> },
    ];

  const FAQ_ITEMS = faqItems.map(f => ({ q: f.question, a: f.answer }));

  return (
    <div className="bg-white dark:bg-[#060C1A]">
      {/* Loading state */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-[#060C1A]">
          <div className="text-blue-500 animate-pulse">Loading content...</div>
        </div>
      )}

      {/* Language Switcher */}
      <div className="fixed top-4 right-4 z-50">
        <div className="flex items-center gap-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-full shadow-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => {
              localStorage.setItem('alzera_language', 'id');
              setCurrentLang('id');
            }}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              currentLang === 'id' 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            ID
          </button>
          <button
            onClick={() => {
              localStorage.setItem('alzera_language', 'en');
              setCurrentLang('en');
            }}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              currentLang === 'en' 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            EN
          </button>
        </div>
      </div>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="pt-28 pb-0 bg-[#07112A] dark:bg-[#04091A] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(to right, #60a5fa 1px, transparent 1px), linear-gradient(to bottom, #60a5fa 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

        <div ref={heroRef} className={`max-w-6xl mx-auto px-6 animate-on-scroll animate-fade-down ${heroVisible ? 'visible' : ''}`}>
          <div className="grid lg:grid-cols-2 gap-10 items-end pb-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-blue-500/15 border border-blue-500/25 text-blue-400 text-xs font-semibold tracking-widest uppercase rounded-sm">ABOUT ALZERA</span>
                <span className="text-slate-500 text-xs">//</span>
                <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400/80 text-xs font-semibold tracking-widest uppercase rounded-sm">DIGITAL STUDIO</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.05] mb-6">Technology With a Purpose.</h1>
              <p className="text-slate-400 text-base leading-relaxed mb-8 max-w-md">We build digital experiences and practical software solutions around real needs, helping businesses turn ideas into something durable, intuitive, and genuinely useful.</p>

              <div className="flex flex-wrap gap-4 mb-10">
                <a href="/contact" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-all shadow-lg hover:shadow-blue-500/25">Let's Work Together</a>
                <a href="/projects" className="px-6 py-3 bg-white/8 hover:bg-white/12 border border-white/20 text-white text-sm font-semibold rounded-lg transition-all">Explore Our Projects →</a>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-400">
                <span><span className="font-semibold text-slate-500 uppercase tracking-widest mr-1.5">LOC:</span> Indonesia / Global Async</span>
                <span className="text-slate-600">◆</span>
                <span><span className="font-semibold text-slate-500 uppercase tracking-widest mr-1.5">STATUS:</span><span className="text-green-400">Accepting Q2/Q3 Projects</span></span>
                <span className="text-slate-600">◆</span>
                <span><span className="font-semibold text-slate-500 uppercase tracking-widest mr-1.5">MODALITY:</span> Direct Senior Execution</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Studio Origins ───────────────────────────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-[#060C1A]">
        <div ref={originsRef} className={`max-w-6xl mx-auto px-6 animate-on-scroll animate-fade-up ${originsVisible ? 'visible' : ''}`}>
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-14 items-start">
            <div>
              <p className="text-xs font-semibold tracking-widest text-blue-500 uppercase mb-2">STUDIO ORIGINS & PURPOSE</p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">Built on the premise that digital solutions should solve real problems, not simply look impressive.</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">ALZERA was created around an uncompromising realization: the digital landscape is saturated with bloated software and hyper-styled websites that fail to address fundamental operational realities.</p>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">From direct business websites to mission-critical custom web applications, our approach starts with understanding what people need, how their work actually happens, and what a practical solution must accomplish to deliver genuine return.</p>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-8">We believe exceptional digital products combine clear design, robust implementation, and honest collaboration. Every line of code, database schema, and micro-interaction is deliberately engineered for measurable longevity.</p>

              <div className="flex items-start gap-4 p-5 border border-slate-200 dark:border-slate-700/60 rounded-xl bg-slate-50 dark:bg-[#0C1628]">
                <span className="text-3xl font-black text-blue-500 leading-none select-none mt-0.5">99</span>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">Zero vanity bloat. Measurable utility and deterministic execution.</p>
                  <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">THE ALZERA OPERATING MANDATE</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Core Foundations ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50 dark:bg-[#080E1E]">
        <div ref={foundationsRef} className={`max-w-6xl mx-auto px-6 animate-on-scroll animate-fade-up ${foundationsVisible ? 'visible' : ''}`}>
          <p className="text-xs font-semibold tracking-widest text-blue-500 uppercase mb-2">CORE FOUNDATIONS</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3 max-w-2xl leading-tight">Good Technology Starts With the Right Questions.</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl mb-12 leading-relaxed">Software fails when developers optimize for trends rather than utility. We structure our design engineering around three non-negotiable principles.</p>

          <div className="grid md:grid-cols-3 gap-6">
            {CORE_FOUNDATIONS.map((f) => (
              <div key={f.num} className="bg-white dark:bg-[#0C1628] border border-slate-200 dark:border-slate-700/60 rounded-xl p-7">
                <div className="flex items-start justify-between mb-5">
                  <span className="text-5xl font-black text-slate-100 dark:text-slate-800 leading-none select-none">{f.num}</span>
                  <div className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-blue-500">{f.icon}</div>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-5">{f.desc}</p>
                <ul className="space-y-2">
                  {f.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400"><CheckIcon />{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ──────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-[#060C1A]">
        <div ref={processRef} className={`max-w-6xl mx-auto px-6 animate-on-scroll animate-fade-up ${processVisible ? 'visible' : ''}`}>
          <div className="grid lg:grid-cols-[1fr_1fr] gap-10 mb-10">
            <div>
              <p className="text-xs font-semibold tracking-widest text-blue-500 uppercase mb-2">DETERMINISTIC PROCESS</p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight">A Clear Process. From Start to Launch.</h2>
            </div>
            <div className="flex items-end">
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Predictability over chaos. Every project follows a milestone-driven trajectory designed to give stakeholders total transparency.</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {PROCESS_STAGES.map((s) => (
              <div key={s.stage} className="bg-slate-50 dark:bg-[#0C1628] border border-slate-200 dark:border-slate-700/60 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20 tracking-widest">{s.stage}</span>
                  <div className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400">{s.icon}</div>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">{s.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 border border-slate-200 dark:border-slate-700/60 rounded-xl bg-slate-50 dark:bg-[#0C1628]">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full border border-blue-400/40 flex items-center justify-center flex-shrink-0 mt-0.5"><CheckIcon /></div>
              <p className="text-xs text-slate-500 dark:text-slate-400"><span className="font-semibold text-slate-700 dark:text-slate-300">Scope Integrity: </span>All deliverables, review cycles, and maintenance windows are codified in upfront contracts. No unexpected invoices or ambiguous handoffs.</p>
            </div>
            <a href="/contact" className="text-xs font-semibold text-blue-500 hover:text-blue-400 transition-colors flex-shrink-0">Read Project Terms →</a>
          </div>
        </div>
      </section>

      {/* ── Studio Ethics ────────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#07112A] dark:bg-[#04091A]">
        <div ref={ethicsRef} className={`max-w-6xl mx-auto px-6 animate-on-scroll animate-fade-up ${ethicsVisible ? 'visible' : ''}`}>
          <p className="text-xs font-semibold tracking-widest text-blue-400 uppercase mb-2">STUDIO ETHICS</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">What You Can Expect From Us</h2>
          <p className="text-slate-400 text-sm max-w-xl mb-12 leading-relaxed">Professional standards of conduct designed around clarity, mutual respect, and engineering integrity.</p>

          <div className="grid sm:grid-cols-2 gap-8">
            {STUDIO_ETHICS.map((e) => (
              <div key={e.title}>
                <div className="w-10 h-10 rounded-lg border border-blue-400/20 bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4">{e.icon}</div>
                <h3 className="text-base font-bold text-white mb-2">{e.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Service Capabilities ─────────────────────────────────────────────── */ }
      <section className="py-20 bg-white dark:bg-[#060C1A]">
        <div ref={servicesRef} className={`max-w-6xl mx-auto px-6 animate-on-scroll animate-fade-up ${servicesVisible ? 'visible' : ''}`}>
          <p className="text-xs font-semibold tracking-widest text-blue-500 uppercase mb-2 text-center">SERVICE CAPABILITIES</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3 text-center">Turning Ideas Into Digital Solutions</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm text-center max-w-md mx-auto mb-12 leading-relaxed">We focus our engineering craft on two core categories where deliberate execution makes the biggest organizational difference.</p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-50 dark:bg-[#0C1628] border border-slate-200 dark:border-slate-700/60 rounded-xl p-8">
              <div className="w-10 h-10 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 mb-5"><svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="15" rx="2" /><path d="M8 21h8M12 18v3" strokeLinecap="round" /></svg></div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Website Development</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">Websites that present businesses with architectural authority, communicate value propositions with precision, and guide prospects directly into action.</p>
              <p className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase mb-3">KEY DELIVERABLES</p>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="text-xs px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/40">Bespoke Brand Sites</span>
                <span className="text-xs px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/40">Product Landing Pages</span>
                <span className="text-xs px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/40">Headless CMS Solutions</span>
                <span className="text-xs px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/40">Core Web Vitals Optimization</span>
              </div>
              <a href="/services" className="text-sm font-semibold text-blue-500 hover:text-blue-400 transition-colors">Explore Website Services →</a>
            </div>

            <div className="bg-slate-50 dark:bg-[#0C1628] border border-slate-200 dark:border-slate-700/60 rounded-xl p-8">
              <div className="w-10 h-10 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 mb-5"><svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 3H5a2 2 0 00-2 2v14a2 2 0 002 2h3M16 3h3a2 2 0 012 2v14a2 2 0 01-2 2h-3M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Web Applications & Digital Systems</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">Tailored software applications that streamline operational workflows, manage complex data structures, and automate redundant human effort.</p>
              <p className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase mb-3">KEY DELIVERABLES</p>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="text-xs px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/40">Custom Portals & Dashboards</span>
                <span className="text-xs px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/40">Internal Business Tools</span>
                <span className="text-xs px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/40">API Integrations & Workflows</span>
                <span className="text-xs px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/40">Database Architectures</span>
              </div>
              <a href="/services" className="text-sm font-semibold text-blue-500 hover:text-blue-400 transition-colors">Explore Application Services →</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pragmatic Engineering ────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50 dark:bg-[#080E1E]">
        <div ref={pragmaticRef} className={`max-w-6xl mx-auto px-6 animate-on-scroll animate-fade-up ${pragmaticVisible ? 'visible' : ''}`}>
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-14 items-start">
            <div>
              <p className="text-xs font-semibold tracking-widest text-blue-500 uppercase mb-2">PRAGMATIC ENGINEERING</p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">Technology Is a Tool. The Solution Comes First.</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">We choose implementation approaches based strictly on project scale, user capabilities, and the realistic cost of maintaining the solution over years, not months.</p>
            </div>

            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex gap-5 p-5 bg-white dark:bg-[#0C1628] border border-slate-200 dark:border-slate-700/60 rounded-xl">
                  <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">{n}</div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                      {n === 1 ? 'Fit the Requirements' : n === 2 ? 'Keep the Experience Usable' : 'Long-Term Maintainability'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {n === 1 ? "We avoid over-engineering. If a lightweight static framework serves your business model better than an enterprise distributed cluster, we build the former and save you ongoing infrastructure capital." : 
                       n === 2 ? 'High responsiveness, instant feedback, and accessible contrast. Beautiful software that stutters or confuses users is failed software.' :
                       "Clean standard web code, semantic HTML, modular CSS, typed logic, and no proprietary vendor lock-in. Your internal team can take over our work effortlessly."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Client Alignment ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-[#060C1A]">
        <div ref={clientRef} className={`max-w-6xl mx-auto px-6 animate-on-scroll animate-fade-up ${clientVisible ? 'visible' : ''}`}>
          <p className="text-xs font-semibold tracking-widest text-blue-500 uppercase mb-2">CLIENT ALIGNMENT</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3 max-w-xl leading-tight">Built for People Moving Their Ideas Forward.</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-12 leading-relaxed">Our studio structure is optimized for founders and operators who prioritize direct execution and accountable delivery.</p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-50 dark:bg-[#0C1628] border border-slate-200 dark:border-slate-700/60 rounded-xl p-7">
              <div className="w-10 h-10 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 mb-5"><svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" strokeLinecap="round" /></svg></div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Small & Medium Businesses</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-5">Established businesses looking to upgrade their market presence or streamline manual operations into dependable automated software.</p>
              <p className="text-xs font-semibold text-blue-500">Typical Outcome: Revenue & Operational Efficiency</p>
            </div>

            <div className="bg-slate-50 dark:bg-[#0C1628] border border-slate-200 dark:border-slate-700/60 rounded-xl p-7">
              <div className="w-10 h-10 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 mb-5"><svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6l2-6z" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Startups & New Ventures</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-5">Founding teams launching an initial MVP or preparing to scale a tested business proposition with high-velocity, reliable engineering.</p>
              <p className="text-xs font-semibold text-blue-500">Typical Outcome: Rapid Speed-to-Market</p>
            </div>

            <div className="bg-slate-50 dark:bg-[#0C1628] border border-slate-200 dark:border-slate-700/60 rounded-xl p-7">
              <div className="w-10 h-10 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 mb-5"><svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Specialized Organizations</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-5">Entities that need a custom-built solution, bespoke internal portal, or specialized workflow application off-the-shelf software cannot provide.</p>
              <p className="text-xs font-semibold text-blue-500">Typical Outcome: Tailored Architectural Fit</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Founder-Led Craftsmanship ────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50 dark:bg-[#080E1E]">
        <div ref={founderRef} className={`max-w-6xl mx-auto px-6 animate-on-scroll animate-fade-up ${founderVisible ? 'visible' : ''}`}>
          <div className="bg-white dark:bg-[#0C1628] border border-slate-200 dark:border-slate-700/60 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row gap-10 items-start justify-between">
            <div className="max-w-lg">
              <p className="text-xs font-semibold tracking-widest text-blue-500 uppercase mb-2">FOUNDER-LED CRAFTSMANSHIP</p>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">Direct collaboration with practitioners, not account middlemen.</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">ALZERA is deliberately independent. We do not maintain bloated layers of project delegates or use stock photos of pretend office campuses. When you work with ALZERA, you communicate directly with senior software architects and designers who understand every line of your implementation.</p>
            </div>
            <div className="flex-shrink-0 text-center">
              <p className="text-6xl font-black text-blue-600 leading-none">1:1</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-2">Direct Access</p>
              <p className="text-xs text-slate-400 mt-1">Zero agency hierarchy bloat</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-[#060C1A]">
        <div ref={faqRef} className={`max-w-3xl mx-auto px-6 animate-on-scroll animate-fade-up ${faqVisible ? 'visible' : ''}`}>
          <p className="text-xs font-semibold tracking-widest text-blue-500 uppercase mb-2 text-center">TRANSPARENCY & CLARIFICATIONS</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3 text-center">Frequently Asked Questions</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm text-center mb-12 leading-relaxed">Clear answers about how we engage, deliver, and support projects.</p>

          <div className="space-y-2">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="border border-slate-200 dark:border-slate-700/60 rounded-xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 pr-4">{item.q}</span>
                  <ChevronIcon open={openFaq === i} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 border-t border-slate-100 dark:border-slate-700/40">
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed pt-4">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Footer ───────────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#07112A] dark:bg-[#04091A]">
        <div ref={ctaRef} className={`max-w-6xl mx-auto px-6 text-center animate-on-scroll animate-fade-up ${ctaVisible ? 'visible' : ''}`}>
          <p className="text-xs font-semibold tracking-widest text-blue-400 uppercase mb-4">✦ INITIATE COLLABORATION</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-5 leading-tight">Let's Build Something<br />That Matters.</h2>
          <p className="text-slate-400 text-sm max-w-sm mx-auto mb-10 leading-relaxed">Have an operational challenge, a digital product concept, or a brand experience you need engineered with precision? Let's talk through the details.</p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="/contact" className="px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-all shadow-lg hover:shadow-blue-500/25">Discuss Your Project</a>
            <a href="/projects" className="px-7 py-3.5 bg-white/8 hover:bg-white/12 border border-white/20 text-white text-sm font-bold rounded-lg transition-all">View Our Work</a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs text-slate-400">
            <span className="flex items-center gap-2 text-green-400"><WhatsAppIcon />WhatsApp Quick Connect Available</span>
            <span className="text-slate-600">·</span>
            <span>Verified response within 24 business hours</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
import { useState } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { API_ENDPOINTS } from '../config/api';

// ─── Types ────────────────────────────────────────────────────────────────────
interface FormData {
  fullName: string;
  businessOrg: string;
  workEmail: string;
  whatsappNumber: string;
  serviceNeeded: string;
  budgetRange: string;
  timeline: string;
  description: string;
  referenceUrl: string;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const CheckIcon = () => (
  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="7.5" stroke="currentColor" strokeOpacity="0.4" />
    <path d="M4.5 8l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    className={`w-5 h-5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
    viewBox="0 0 20 20" fill="none"
  >
    <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const EmailIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 7l10 7 10-7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2l7 3v6c0 5-3.5 9.74-7 11C8.5 20.74 5 16 5 11V5l7-3z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const InfoIcon = () => (
  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="8" cy="8" r="6.5" />
    <path d="M8 7v5" strokeLinecap="round" />
    <circle cx="8" cy="5" r="0.75" fill="currentColor" stroke="none" />
  </svg>
);

const LinkIcon = () => (
  <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M6 10.5l4-4m-2 6l-1.5 1.5a3.5 3.5 0 01-4.95-4.95l2-2a3.5 3.5 0 014.95 4.95" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 5.5l1.5-1.5a3.5 3.5 0 014.95 4.95l-2 2a3.5 3.5 0 01-4.95-4.95" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── FAQ Data ─────────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    question: 'Do I need a complete technical specification before contacting you?',
    answer: `No. You can start with a general business concept, an operational challenge, or rough notes. One of ALZERA's core strengths is engineering discovery — we help translate your business objectives into structured specifications and clear architecture.`,
  },
  {
    question: 'How is project pricing determined?',
    answer: `Pricing is milestone-based and tied to deliverables, not hourly rates. After the initial scope assessment, we provide a fixed-price milestone specification that outlines cost, timeline, and expected outputs for each phase.`,
  },
  {
    question: 'Can I request a website redesign or legacy system refactor?',
    answer: `Yes. We handle both greenfield builds and refactoring engagements. For refactors, we begin with a technical audit to assess complexity and risk before committing to a scope.`,
  },
  {
    question: 'Do you work with small businesses and solo founders?',
    answer: `Absolutely. Many of our engagements are with early-stage founders who need senior-level engineering without hiring full-time. We scale our involvement to match your project's stage.`,
  },
  {
    question: 'Is contacting ALZERA a commitment to hire?',
    answer: `Not at all. The initial consultation is zero-obligation. We explore your needs, assess feasibility, and propose a path forward. You decide if and when to proceed — no pressure, no sales cycle.`,
  },
];

// ─── Onboarding Steps ────────────────────────────────────────────────────────
const ONBOARDING_STEPS = [
  {
    num: '01',
    title: 'We Review Your Needs',
    desc: 'We review the information you share, conduct an initial technical feasibility scan, and identify any details that need clarification before taking.',
    meta: 'Turnaround: ~24 Hours',
  },
  {
    num: '02',
    title: 'We Discuss the Scope',
    desc: 'We talk through your business goals, explore possible engineering solutions, weigh trade-offs, and clarify operational expectations in an open discussion.',
    meta: 'Format: 30-min Google Meet / Async',
  },
  {
    num: '03',
    title: 'We Define the Next Step',
    desc: 'If the project is a mutual fit, we provide a deterministic scope specification, deliverable checklist, timeline, and fixed-milestone pricing.',
    meta: 'Fixed-Price Milestone Spec',
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────
const ContactPage = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    businessOrg: '',
    workEmail: '',
    whatsappNumber: '',
    serviceNeeded: '',
    budgetRange: '',
    timeline: '',
    description: '',
    referenceUrl: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Scroll animations
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation(0.05);
  const { ref: channelsRef, isVisible: channelsVisible } = useScrollAnimation(0.05);
  const { ref: formRef, isVisible: formVisible } = useScrollAnimation(0.05);
  const { ref: stepsRef, isVisible: stepsVisible } = useScrollAnimation(0.05);
  const { ref: faqRef, isVisible: faqVisible } = useScrollAnimation(0.05);
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation(0.05);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        name: formData.fullName,
        email: formData.workEmail,
        whatsapp: formData.whatsappNumber,
        service: formData.serviceNeeded,
        message: formData.description,
        // Extra fields stored in message context
        businessOrg: formData.businessOrg,
        budgetRange: formData.budgetRange,
        timeline: formData.timeline,
        referenceUrl: formData.referenceUrl,
      };

      const response = await fetch(API_ENDPOINTS.contact, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.status === 'success') {
        setSubmitted(true);
        setFormData({
          fullName: '', businessOrg: '', workEmail: '', whatsappNumber: '',
          serviceNeeded: '', budgetRange: '', timeline: '', description: '', referenceUrl: '',
        });
      } else {
        alert('Something went wrong. Please try again or reach out via WhatsApp.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Connection error. Please check your internet and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputBase =
    'w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all';

  const selectBase =
    'w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none';

  return (
    <div className="bg-white dark:bg-[#060C1A]">

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="pt-28 pb-16 bg-[#07112A] dark:bg-[#04091A] relative overflow-hidden">
        {/* Subtle grid bg */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #60a5fa 1px, transparent 1px), linear-gradient(to bottom, #60a5fa 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div
          ref={heroRef}
          className={`max-w-6xl mx-auto px-6 animate-on-scroll animate-fade-down ${heroVisible ? 'visible' : ''}`}
        >
          {/* Badge */}
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-blue-500/15 border border-blue-500/25 text-blue-400 text-xs font-semibold tracking-widest uppercase rounded-sm">
              GET IN TOUCH
            </span>
            <span className="text-slate-500 text-xs tracking-widest">//</span>
            <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400/80 text-xs font-semibold tracking-widest uppercase rounded-sm">
              DIRECT STUDIO CONSULTATION
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6 max-w-3xl">
            Let's Talk About<br />Your Project.
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-xl mb-10 leading-relaxed">
            Have an idea, a business challenge, or a digital product that needs improvement?
            Tell us what you're working on, and let's explore the right next architectural step together.
          </p>

          {/* Meta badges */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <CheckIcon />
              Response Window: <span className="text-slate-200 font-medium">Within 24 Hours</span>
            </span>
            <span className="flex items-center gap-2">
              <CheckIcon />
              Format: <span className="text-slate-200 font-medium">Direct Architect Consultation</span>
            </span>
            <span className="flex items-center gap-2">
              <CheckIcon />
              Location: <span className="text-slate-200 font-medium">Indonesia / Global Async</span>
            </span>
          </div>
        </div>
      </section>

      {/* ── Channels + Form ───────────────────────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-[#060C1A]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-14 items-start">

            {/* Left — Communication Channels */}
            <div
              ref={channelsRef}
              className={`animate-on-scroll animate-fade-right ${channelsVisible ? 'visible' : ''}`}
            >
              <p className="text-xs font-semibold tracking-widest text-blue-500 uppercase mb-2">
                ZERO SALES PRESSURE
              </p>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Start a Conversation
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
                Choose the communication channel that fits your preferred workflow. You talk straight with engineers, product builders, and designers — no sales reps or commission layers.
              </p>

              {/* WhatsApp */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 mb-4 hover:border-green-400/50 transition-colors group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
                      <WhatsAppIcon />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Chat on WhatsApp</h3>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
                    Instant Feasibility
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
                  Discuss your idea directly with ALZERA engineers. Quick scope feasibility, ballpark questions, and rapid responses.
                </p>
                <a
                  href="https://wa.me/628818411915?text=Hi%2C%20I%27d%20like%20to%20discuss%20a%20project%20with%20ALZERA."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-blue-500 hover:text-blue-400 transition-colors"
                >
                  Open WhatsApp Thread →
                </a>
              </div>

              {/* Email */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 mb-4 hover:border-blue-400/50 transition-colors group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <EmailIcon />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Send an Email</h3>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                    RFP / Briefs
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
                  Share project briefs, RFP specifications, design guides, or detailed documents directly with our studio inbox.
                </p>
                <a
                  href="mailto:contact@alzera.web.id"
                  className="text-xs font-semibold text-blue-500 hover:text-blue-400 transition-colors"
                >
                  contact@alzera.web.id
                </a>
              </div>

              {/* Studio Verification */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-slate-400/50 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                    <ShieldIcon />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">ALZERA Studio Verification</h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Official studio repository and verified engineering hub operating at{' '}
                  <a
                    href="https://alzera.web.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    alzera.web.id
                  </a>
                </p>
              </div>

              {/* Consultation Standards */}
              <div className="mt-10">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-5">
                  Consultation Standards
                </h3>
                <ul className="space-y-4">
                  {[
                    {
                      title: 'Direct Senior Execution',
                      desc: 'Every inquiry is reviewed directly by software architects and lead designers.',
                    },
                    {
                      title: 'Zero Sales Pitch',
                      desc: 'Expect practical architectural feasibility, technical honesty, and milestone recommendations.',
                    },
                    {
                      title: 'Confidentiality Assured',
                      desc: 'Mutual NDA provided upon request for proprietary ideas and early-stage IP.',
                    },
                  ].map((item) => (
                    <li key={item.title} className="flex items-start gap-3">
                      <span className="mt-0.5 w-5 h-5 rounded-full border border-blue-400/40 flex items-center justify-center flex-shrink-0">
                        <CheckIcon />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right — Project Inquiry Form */}
            <div
              ref={formRef}
              className={`animate-on-scroll animate-fade-left ${formVisible ? 'visible' : ''}`}
            >
              <div className="bg-white dark:bg-[#0C1628] border border-slate-200 dark:border-slate-700/60 rounded-2xl p-8 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold tracking-widest text-blue-500 uppercase">
                    ✦ SCOPE ASSESSMENT
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                  Tell Us About Your Project
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-7">
                  A few deliberate details will help our engineering team prepare actionable suggestions before our first call.
                </p>

                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      Inquiry Received
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto mb-6">
                      We'll review your project details and get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="text-sm font-semibold text-blue-500 hover:text-blue-400 transition-colors"
                    >
                      Submit another inquiry →
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Row 1 */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                          Full Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          required
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="e.g. Raden Arya"
                          className={inputBase}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                          Business / Organization{' '}
                          <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          name="businessOrg"
                          value={formData.businessOrg}
                          onChange={handleChange}
                          placeholder="Company, startup, or brand"
                          className={inputBase}
                        />
                      </div>
                    </div>

                    {/* Row 2 */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                          Work Email Address <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="email"
                          name="workEmail"
                          required
                          value={formData.workEmail}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          className={inputBase}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                          WhatsApp Number{' '}
                          <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <input
                          type="tel"
                          name="whatsappNumber"
                          value={formData.whatsappNumber}
                          onChange={handleChange}
                          placeholder="+62 812-xxxx-xxxx"
                          className={inputBase}
                        />
                      </div>
                    </div>

                    {/* Service */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                        Service Needed <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <select
                          name="serviceNeeded"
                          required
                          value={formData.serviceNeeded}
                          onChange={handleChange}
                          className={selectBase}
                        >
                          <option value="">Select the type of work needed...</option>
                          <option value="web-design">Web Design & Development</option>
                          <option value="mobile-app">Mobile App (Flutter / React Native)</option>
                          <option value="uiux">UI/UX Design</option>
                          <option value="ecommerce">E-Commerce Platform</option>
                          <option value="dashboard">Dashboard / Admin System</option>
                          <option value="api-backend">API & Backend Engineering</option>
                          <option value="system-refactor">System Refactor / Legacy Migration</option>
                          <option value="branding">Brand Identity & Logo</option>
                          <option value="consultation">Technical Consultation</option>
                          <option value="other">Other / Not Sure Yet</option>
                        </select>
                        <ChevronIcon open={false} />
                      </div>
                    </div>

                    {/* Row 3 — Budget + Timeline */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                          Estimated Budget Range{' '}
                          <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <div className="relative">
                          <select
                            name="budgetRange"
                            value={formData.budgetRange}
                            onChange={handleChange}
                            className={selectBase}
                          >
                            <option value="">Not sure yet (Need Estimation)</option>
                            <option value="under-5k">Under $500</option>
                            <option value="5k-15k">$500 – $2,000</option>
                            <option value="15k-50k">$2,000 – $10,000</option>
                            <option value="50k-plus">$10,000+</option>
                          </select>
                          <ChevronIcon open={false} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                          Expected Timeline{' '}
                          <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <div className="relative">
                          <select
                            name="timeline"
                            value={formData.timeline}
                            onChange={handleChange}
                            className={selectBase}
                          >
                            <option value="">Flexible / Ongoing discovery</option>
                            <option value="asap">ASAP (within 2 weeks)</option>
                            <option value="1-month">Within 1 month</option>
                            <option value="1-3-months">1–3 months</option>
                            <option value="3-6-months">3–6 months</option>
                            <option value="6-plus">6 months+</option>
                          </select>
                          <ChevronIcon open={false} />
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                          Tell us what you want to build <span className="text-red-400">*</span>
                        </label>
                        <span className="text-[10px] text-slate-400">Plain language is welcome</span>
                      </div>
                      <textarea
                        name="description"
                        required
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Describe your business, the operational problem you want to solve, or the features you have in mind. What does success look like for this release?"
                        className={`${inputBase} resize-none`}
                      />
                    </div>

                    {/* Reference URL */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                        Reference website or inspiration{' '}
                        <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <div className="relative">
                        <LinkIcon />
                        <input
                          type="url"
                          name="referenceUrl"
                          value={formData.referenceUrl}
                          onChange={handleChange}
                          placeholder="https://example.com or competitor benchmark"
                          className={`${inputBase} pl-9`}
                        />
                      </div>
                    </div>

                    {/* Disclaimer */}
                    <div className="flex items-start gap-2.5 p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-lg">
                      <InfoIcon />
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        By submitting this form, you acknowledge that your project details will remain strictly confidential and will be utilized solely by ALZERA to prepare an initial consultation and scope estimate.
                      </p>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full py-3.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                        isLoading
                          ? 'bg-blue-400 cursor-not-allowed text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-blue-500/25'
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          Sending Inquiry...
                        </>
                      ) : (
                        'Send Project Inquiry →'
                      )}
                    </button>

                    <p className="text-center text-[11px] text-slate-400">
                      Sharing your requirements does not commit you to a project. Zero obligations.
                    </p>

                    {/* WhatsApp fallback */}
                    <div className="flex items-center justify-center gap-2 pt-1">
                      <span className="text-xs text-slate-400">Prefer an immediate direct conversation?</span>
                      <a
                        href="https://wa.me/628818411915?text=Hi%2C%20I%27d%20like%20to%20discuss%20a%20project%20with%20ALZERA."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-semibold text-green-600 hover:text-green-500 transition-colors"
                      >
                        <WhatsAppIcon />
                        Continue on WhatsApp
                      </a>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Onboarding Steps ──────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50 dark:bg-[#080E1E]">
        <div
          ref={stepsRef}
          className={`max-w-6xl mx-auto px-6 animate-on-scroll animate-fade-up ${stepsVisible ? 'visible' : ''}`}
        >
          <p className="text-xs font-semibold tracking-widest text-blue-500 uppercase mb-2">
            STRUCTURED ONBOARDING SEQUENCE
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
            What Happens After You Reach Out?
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl mb-12 leading-relaxed">
            A predictable, transparent onboarding progression designed to respect your time and provide engineering clarity before any commitment.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {ONBOARDING_STEPS.map((step) => (
              <div
                key={step.num}
                className="bg-white dark:bg-[#0C1628] border border-slate-200 dark:border-slate-700/60 rounded-xl p-7 relative"
              >
                <div className="flex items-start justify-between mb-5">
                  <span className="text-5xl font-black text-slate-100 dark:text-slate-800 leading-none select-none">
                    {step.num}
                  </span>
                  <div className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                    <svg className="w-4 h-4 text-slate-400" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="2" y="2" width="12" height="12" rx="2" />
                      <path d="M5 8h6M8 5v6" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                  {step.desc}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="7" cy="7" r="5.5" />
                    <path d="M7 4.5v3l2 1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {step.meta}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-[#060C1A]">
        <div
          ref={faqRef}
          className={`max-w-3xl mx-auto px-6 animate-on-scroll animate-fade-up ${faqVisible ? 'visible' : ''}`}
        >
          <p className="text-xs font-semibold tracking-widest text-blue-500 uppercase mb-2 text-center">
            INQUIRIES & CLARIFICATIONS
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3 text-center">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm text-center mb-12 leading-relaxed">
            Everything you need to know about initiating a collaboration, project billing, and technical consultation with ALZERA.
          </p>

          <div className="space-y-2">
            {FAQ_ITEMS.map((item, i) => (
              <div
                key={i}
                className="border border-slate-200 dark:border-slate-700/60 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 pr-4">
                    {item.question}
                  </span>
                  <ChevronIcon open={openFaq === i} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 border-t border-slate-100 dark:border-slate-700/40">
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed pt-4">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Unusual requirement CTA */}
          <div className="mt-6 flex items-center justify-between px-6 py-4 border border-slate-200 dark:border-slate-700/60 rounded-xl bg-slate-50/50 dark:bg-slate-800/20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-500">
                <InfoIcon />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Have a specific or unusual project requirement?
                </p>
                <p className="text-xs text-slate-400">We're glad to evaluate unique custom integrations.</p>
              </div>
            </div>
            <a
              href="mailto:contact@alzera.web.id"
              className="flex-shrink-0 ml-4 text-xs font-semibold text-blue-500 hover:text-blue-400 border border-blue-300 dark:border-blue-700 hover:border-blue-400 px-3 py-2 rounded-lg transition-all"
            >
              Email Us Directly
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA Footer ───────────────────────────────────────────────────── */}
      <section className="py-16 bg-[#07112A] dark:bg-[#04091A]">
        <div
          ref={ctaRef}
          className={`max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 animate-on-scroll animate-fade-up ${ctaVisible ? 'visible' : ''}`}
        >
          <div>
            <p className="text-xs font-semibold tracking-widest text-blue-400 uppercase mb-2">
              IMMEDIATE NEXT ACTION
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Your Next Digital Project Starts Here.
            </h2>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              Share your idea with ALZERA and let's explore a practical, high-impact way to bring it to life.
            </p>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <a
              href="#form"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-all shadow-lg hover:shadow-blue-500/25"
            >
              Send an Inquiry ↑
            </a>
            <a
              href="/services"
              className="px-6 py-3 bg-white/10 hover:bg-white/15 border border-white/20 text-white text-sm font-bold rounded-lg transition-all"
            >
              Explore Our Services
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ContactPage;

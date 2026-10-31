import { useState, useEffect } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { API_ENDPOINTS } from '../config/api';
import { navigateTo } from '../utils/navigation';

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    className={`w-5 h-5 transition-transform duration-300 ${open ? 'rotate-45' : ''}`}
    viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"
  >
    <path d="M5 7.5l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  order_index: number;
}

const FAQPage = ({ darkMode }: { darkMode: boolean }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
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

  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation(0.2);
  const { ref: listRef, isVisible: listVisible } = useScrollAnimation(0.15);
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation(0.2);

  useEffect(() => {
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

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-20">
      <section className="max-w-6xl mx-auto px-6">
        <div ref={headerRef} className={`max-w-3xl mb-14 animate-on-scroll animate-fade-right ${headerVisible ? 'visible' : ''}`}>
          <button
            type="button"
            onClick={() => navigateTo('/')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition mb-6"
          >
            <span aria-hidden="true">←</span>
            Kembali ke Home
          </button>
          <div className="flex items-center justify-between mb-6">
            <span className="inline-block px-5 py-2 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 text-sm font-semibold uppercase tracking-wide">FAQ</span>
            {/* Language Switcher */}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg px-2 py-1">
              <button
                onClick={() => {
                  localStorage.setItem('alzera_language', 'id');
                  setCurrentLang('id');
                }}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  currentLang === 'id' 
                    ? 'bg-cyan-500 text-white shadow-md' 
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
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  currentLang === 'en' 
                    ? 'bg-cyan-500 text-white shadow-md' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                EN
              </button>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            {currentLang === 'id' ? 'Pertanyaan yang Paling Sering Ditanyakan' : 'Frequently Asked Questions'}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            {currentLang === 'id' 
              ? 'Halaman ini berisi jawaban cepat seputar layanan, proses kerja, revisi, dan cara memulai project bersama ALZERA.' 
              : 'This page contains quick answers about services, work process, revisions, and how to start a project with ALZERA.'}
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-start">
          <div ref={listRef} className={`space-y-4 animate-on-scroll stagger-children ${listVisible ? 'visible' : ''}`}>
            {faqItems.map((item) => {
              const isOpen = openIndex === item.id;

              return (
                <div key={item.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                  <button type="button" onClick={() => setOpenIndex(isOpen ? null : item.id)} className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left">
                    <span className="text-base md:text-lg font-semibold text-slate-900 dark:text-white">{item.question}</span>
                    <ChevronIcon open={isOpen} />
                  </button>
                  {isOpen && <div className="px-6 pb-6 text-slate-600 dark:text-slate-400 leading-7">{item.answer}</div>}
                </div>
              );
            })}
          </div>

          <aside ref={ctaRef} className={`animate-on-scroll animate-scale-up ${ctaVisible ? 'visible' : ''}`}>
            <div className="sticky top-32 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-cyan-600 dark:to-teal-500 rounded-3xl p-8 text-white shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-3xl mb-6">?</div>
              <h2 className="text-2xl font-bold mb-4">Masih Ada Pertanyaan?</h2>
              <p className="text-sm md:text-base text-slate-200 dark:text-cyan-50 mb-8 leading-7">
                Kalau kebutuhan project Anda belum terjawab di sini, langsung konsultasi saja. Saya bisa bantu arahkan solusi, estimasi, dan langkah pengerjaannya.
              </p>
              <div className="space-y-4">
                <button type="button" onClick={() => navigateTo('/contact')} className="w-full px-6 py-4 rounded-full bg-white text-slate-900 dark:text-cyan-700 font-semibold hover:scale-[1.02] transition">Konsultasi Gratis</button>
                <button type="button" onClick={() => navigateTo('/services')} className="w-full px-6 py-4 rounded-full border border-white/30 text-white font-semibold hover:bg-white/10 transition">Lihat Paket Harga</button>
              </div>
              <div className="mt-8 pt-6 border-t border-white/15 text-sm text-slate-200 dark:text-cyan-50">
                <p>Mode saat ini: {darkMode ? 'Dark mode' : 'Light mode'}</p>
                <p className="mt-2">Respon konsultasi secepat mungkin melalui WhatsApp atau email.</p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default FAQPage;
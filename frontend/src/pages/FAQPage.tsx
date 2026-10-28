import { useState } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { navigateToSection } from '../utils/navigation';

interface FAQPageProps {
  darkMode: boolean;
}

const faqItems = [
  {
    question: 'Berapa lama proses pembuatan website atau aplikasi?',
    answer:
      'Tergantung scope project. Landing page biasanya 3-7 hari, company profile sekitar 1-2 minggu, dan aplikasi custom bisa 3-8 minggu tergantung fitur.',
  },
  {
    question: 'Apakah saya bisa request desain yang sesuai brand saya?',
    answer:
      'Bisa. Warna, gaya visual, tipografi, sampai struktur halaman bisa disesuaikan dengan brand bisnis Anda agar terlihat lebih profesional dan konsisten.',
  },
  {
    question: 'Apakah website bisa dibuka di HP dan laptop?',
    answer:
      'Bisa. Semua website dibuat responsif sehingga tetap nyaman dipakai di mobile, tablet, maupun desktop.',
  },
  {
    question: 'Apakah ada revisi setelah project selesai?',
    answer:
      'Ada. Saya biasanya menyediakan sesi revisi sesuai paket atau kesepakatan awal agar hasil akhir benar-benar sesuai kebutuhan Anda.',
  },
  {
    question: 'Kalau belum punya hosting dan domain, apakah bisa dibantu?',
    answer:
      'Bisa. Saya bisa bantu rekomendasi, setup, sampai proses deploy agar website siap online tanpa Anda perlu ribet teknis.',
  },
  {
    question: 'Bagaimana cara mulai konsultasi project?',
    answer:
      'Tinggal hubungi lewat WhatsApp atau form kontak. Kirim gambaran kebutuhan project, target bisnis, dan referensi jika ada, lalu saya bantu arahkan solusi yang paling cocok.',
  },
];

const FAQPage = ({ darkMode }: FAQPageProps) => {
  const [openIndex, setOpenIndex] = useState<number>(0);
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation(0.2);
  const { ref: listRef, isVisible: listVisible } = useScrollAnimation(0.15);
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation(0.2);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-20">
      <section className="max-w-6xl mx-auto px-6">
        <div
          ref={headerRef}
          className={`max-w-3xl mb-14 animate-on-scroll animate-fade-right ${headerVisible ? 'visible' : ''}`}
        >
          <button
            type="button"
            onClick={() => navigateToSection('#home')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition mb-6"
          >
            <span aria-hidden="true">←</span>
            Kembali ke Home
          </button>
          <span className="inline-block px-5 py-2 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 text-sm font-semibold uppercase tracking-wide mb-6">
            FAQ
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            Pertanyaan yang Paling Sering Ditanyakan
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Halaman ini berisi jawaban cepat seputar layanan, proses kerja, revisi,
            dan cara memulai project bersama ALZERA.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-start">
          <div
            ref={listRef}
            className={`space-y-4 animate-on-scroll stagger-children ${listVisible ? 'visible' : ''}`}
          >
            {faqItems.map((item, index) => {
              const isOpen = index === openIndex;

              return (
                <div
                  key={item.question}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left"
                  >
                    <span className="text-base md:text-lg font-semibold text-slate-900 dark:text-white">
                      {item.question}
                    </span>
                    <span
                      className={`text-2xl text-cyan-600 dark:text-cyan-400 transition-transform ${isOpen ? 'rotate-45' : ''}`}
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-slate-600 dark:text-slate-400 leading-7">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <aside
            ref={ctaRef}
            className={`animate-on-scroll animate-scale-up ${ctaVisible ? 'visible' : ''}`}
          >
            <div className="sticky top-32 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-cyan-600 dark:to-teal-500 rounded-3xl p-8 text-white shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-3xl mb-6">
                ?
              </div>
              <h2 className="text-2xl font-bold mb-4">
                Masih Ada Pertanyaan?
              </h2>
              <p className="text-sm md:text-base text-slate-200 dark:text-cyan-50 mb-8 leading-7">
                Kalau kebutuhan project Anda belum terjawab di sini, langsung konsultasi saja.
                Saya bisa bantu arahkan solusi, estimasi, dan langkah pengerjaannya.
              </p>
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => navigateToSection('#contact')}
                  className="w-full px-6 py-4 rounded-full bg-white text-slate-900 dark:text-cyan-700 font-semibold hover:scale-[1.02] transition"
                >
                  Konsultasi Gratis
                </button>
                <button
                  type="button"
                  onClick={() => navigateToSection('#pricing')}
                  className="w-full px-6 py-4 rounded-full border border-white/30 text-white font-semibold hover:bg-white/10 transition"
                >
                  Lihat Paket Harga
                </button>
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

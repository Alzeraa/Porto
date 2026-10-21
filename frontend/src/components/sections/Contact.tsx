import { useState } from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { useScrollFade } from '../../hooks/useScrollFade';
import { useThemeColors } from '../../hooks/useThemeColors';
import { API_ENDPOINTS } from '../../config/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    service: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.contact, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      if (result.status === 'success') {
        alert('Pesan kamu berhasil dikirim! Kami akan segera menghubungi kamu.');
        setFormData({ name: '', email: '', whatsapp: '', service: '', message: '' });
      } else {
        alert('Terjadi kesalahan, silakan coba lagi!');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Terjadi kesalahan, silakan coba lagi!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const topContacts = [
    { icon: '📍', title: 'Lokasi', value: 'Malang, Indonesia' },
    { icon: '⏰', title: 'Jam Kerja', value: 'Senin - Jumat: 09:00 - 18:00' },
  ];

  const bottomContacts = [
    { icon: '💬', title: 'WhatsApp', value: '+62 881-8411-915', link: 'https://wa.me/628818411915?text=Halo%2C%20saya%20ingin%20konsultasi%20tentang%20layanan%20Anda.', label: 'Chat Sekarang', popular: true },
    { icon: '✉️', title: 'Email', value: 'vaeran2904@gmail.com', link: 'mailto:vaeran2904@gmail.com', label: 'Kirim Email', popular: false },
    { icon: '💻', title: 'GitHub', value: '@Alvaeryn', link: 'https://github.com/Alvaeryn', label: 'Lihat Repository', popular: false },
  ];

  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation(0.1);
  const { ref: topCardsRef, isVisible: topCardsVisible } = useScrollAnimation(0.1);
  const { ref: bottomCardsRef, isVisible: bottomCardsVisible } = useScrollAnimation(0.1);
  const { ref: formRef, isVisible: formVisible } = useScrollAnimation(0.1);
  const { ref: contentRef, opacity, scale } = useScrollFade();

  return (
    <section id="contact" className="py-24 bg-gradient-to-br from-slate-50 to-cyan-50 dark:from-slate-950 dark:to-slate-900">
      <div 
        ref={contentRef} 
        className="max-w-6xl mx-auto px-6"
        style={{ 
          opacity, 
          transform: `scale(${scale})`,
          transition: 'opacity 0.1s ease-out, transform 0.1s ease-out'
        }}
      >
        {/* Header */}
        <div ref={headerRef} className={`text-center mb-16 animate-on-scroll animate-fade-right ${headerVisible ? 'visible' : ''}`}>
          <span className="inline-block px-6 py-2 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded-full text-sm font-semibold uppercase tracking-wide mb-6">
            Hubungi Kami
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            Mari Wujudkan Proyek Anda
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Konsultasi gratis untuk membahas kebutuhan digital bisnis Anda
          </p>
        </div>

        {/* Top Info Cards */}
        <div ref={topCardsRef} className={`grid md:grid-cols-2 gap-5 mb-10 max-w-3xl mx-auto animate-on-scroll stagger-left ${topCardsVisible ? 'visible' : ''}`}>
          {topContacts.map((contact, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-7 rounded-2xl border border-slate-200 dark:border-slate-800 text-center hover:shadow-lg transition-all">
              <div className="text-3xl mb-3">{contact.icon}</div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase">{contact.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{contact.value}</p>
            </div>
          ))}
        </div>

        {/* Contact Cards */}
        <div ref={bottomCardsRef} className={`grid md:grid-cols-3 gap-5 mb-12 max-w-4xl mx-auto animate-on-scroll stagger-right ${bottomCardsVisible ? 'visible' : ''}`}>
          {bottomContacts.map((contact, i) => (
            <div
              key={i}
              className={`p-7 rounded-2xl border text-center transition-all hover:scale-105 ${
                contact.popular
                  ? 'bg-gradient-to-br from-cyan-600 to-teal-600 border-cyan-500 text-white shadow-xl'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="text-3xl mb-4">{contact.icon}</div>
              <h3 className="text-base font-bold mb-2">{contact.title}</h3>
              <p className={`text-sm mb-5 ${contact.popular ? 'text-cyan-100' : 'text-slate-600 dark:text-slate-400'}`}>{contact.value}</p>
              {contact.link && contact.label && (
                <a
                  href={contact.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-block px-8 py-3 rounded-full text-sm font-semibold transition ${
                    contact.popular
                      ? 'bg-white text-cyan-700 hover:bg-cyan-50'
                      : 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-100 dark:hover:bg-cyan-900/50'
                  }`}
                >
                  {contact.label}
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Form */}
        <div ref={formRef} className={`max-w-3xl mx-auto animate-on-scroll animate-fade-left ${formVisible ? 'visible' : ''}`}>
          <div className="bg-white dark:bg-slate-900 p-10 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg">
            <h3 className="text-center font-bold text-slate-900 dark:text-white mb-6 text-2xl">
              📩 Kirim Pesan Langsung
            </h3>
            <p className="text-center text-sm text-slate-600 dark:text-slate-400 mb-8">
              Isi form di bawah dan pesan Anda akan terkirim langsung ke kami
            </p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nama Anda"
                    className="w-full px-5 py-3 text-base text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@contoh.com"
                    className="w-full px-5 py-3 text-base text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    No. WhatsApp
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="08xx-xxxx-xxxx"
                    className="w-full px-5 py-3 text-base text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Layanan
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-5 py-3 text-base text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="">Pilih layanan...</option>
                    <option value="web-design">🌐 Web Design & Development</option>
                    <option value="flutter">📱 Flutter Mobile App (iOS + Android)</option>
                    <option value="ios">🍎 iOS App Development</option>
                    <option value="android">🤖 Android App Development</option>
                    <option value="uiux">🎨 UI/UX App Design</option>
                    <option value="ecommerce">🛒 E-Commerce Website</option>
                    <option value="dashboard">💻 Dashboard & Admin Panel</option>
                    <option value="frontend">🎯 Web Frontend Development</option>
                    <option value="logo">📝 Logo & Brand Identity</option>
                    <option value="other">✨ Lainnya</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Pesan / Detail Project *
                </label>
                <textarea
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Ceritakan kebutuhan project Anda..."
                  className="w-full px-5 py-3 text-base text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-vertical"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 rounded-full font-bold text-sm transition-all ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-slate-900 to-slate-800 dark:from-cyan-600 dark:to-teal-500 text-white hover:shadow-lg hover:scale-105'
                }`}
              >
                {isLoading ? '⏳ Mengirim...' : '✉️ Kirim Pesan'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;


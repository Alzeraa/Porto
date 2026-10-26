import { useState } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useScrollFade } from '../hooks/useScrollFade';
import { useLanguage } from '../hooks/useLanguage';
import { API_ENDPOINTS } from '../config/api';

const ContactPage = () => {
  const { t } = useLanguage();
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
        alert(t('contact.message_success'));
        setFormData({ name: '', email: '', whatsapp: '', service: '', message: '' });
      } else {
        alert(t('contact.message_error'));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert(t('contact.message_error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation(0.1);
  const { ref: formRef, isVisible: formVisible } = useScrollAnimation(0.1);
  const { ref: contentRef, opacity, scale } = useScrollFade();

  return (
    <>
      <div
        ref={contentRef}
        style={{
          opacity,
          transform: `scale(${scale})`,
          transition: 'opacity 0.1s ease-out, transform 0.1s ease-out'
        }}
      >
        {/* Header */}
        <section className="pt-32 pb-16 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900">
          <div ref={headerRef} className={`max-w-6xl mx-auto px-6 text-center animate-on-scroll animate-fade-down ${headerVisible ? 'visible' : ''}`}>
            <span className="inline-block px-6 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold uppercase tracking-wide mb-6">
              {t('contact.label')}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              {t('contact.title')}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
              {t('contact.subtitle')}
            </p>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-16 bg-white dark:bg-slate-900">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {/* WhatsApp */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-green-600 to-green-700 text-white shadow-lg hover:shadow-xl transition-all">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-2xl font-bold mb-2">WhatsApp</h3>
                <p className="text-green-100 mb-6">+62 881-8411-915</p>
                <a
                  href="https://wa.me/628818411915?text=Halo%2C%20saya%20ingin%20konsultasi%20tentang%20layanan%20Anda."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-2 bg-white text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-all"
                >
                  {t('contact.chat_now')}
                </a>
              </div>

              {/* Email */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl transition-all">
                <div className="text-4xl mb-4">✉️</div>
                <h3 className="text-2xl font-bold mb-2">Email</h3>
                <p className="text-blue-100 mb-6">vaeran2904@gmail.com</p>
                <a
                  href="mailto:vaeran2904@gmail.com"
                  className="inline-block px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all"
                >
                  {t('contact.send_email')}
                </a>
              </div>

              {/* Location */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-700 text-white shadow-lg hover:shadow-xl transition-all">
                <div className="text-4xl mb-4">📍</div>
                <h3 className="text-2xl font-bold mb-2">{t('contact.location')}</h3>
                <p className="text-purple-100 mb-6">Malang, Indonesia</p>
                <button className="px-6 py-2 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-all cursor-not-allowed opacity-70">
                  Coming Soon
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-20 bg-slate-50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
          <div ref={formRef} className={`max-w-3xl mx-auto px-6 animate-on-scroll animate-fade-up ${formVisible ? 'visible' : ''}`}>
            <div className="bg-white dark:bg-slate-900 p-10 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg">
              <h3 className="text-center font-bold text-slate-900 dark:text-white mb-6 text-2xl">
                {t('contact.send_direct_message')}
              </h3>
              <p className="text-center text-sm text-slate-600 dark:text-slate-400 mb-8">
                {t('contact.fill_this_form')}
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      {t('contact.full_name')} *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Nama Anda"
                      className="w-full px-5 py-3 text-base text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-5 py-3 text-base text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      {t('contact.whatsapp')}
                    </label>
                    <input
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      placeholder="08xx-xxxx-xxxx"
                      className="w-full px-5 py-3 text-base text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      {t('contact.service')}
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-5 py-3 text-base text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">{t('contact.choose_service')}</option>
                      <option value="web-design">{t('contact.web_design')}</option>
                      <option value="flutter">{t('contact.flutter')}</option>
                      <option value="ios">{t('contact.ios')}</option>
                      <option value="android">{t('contact.android')}</option>
                      <option value="uiux">{t('contact.uiux')}</option>
                      <option value="ecommerce">{t('contact.ecommerce')}</option>
                      <option value="dashboard">{t('contact.dashboard')}</option>
                      <option value="frontend">{t('contact.frontend')}</option>
                      <option value="logo">{t('contact.logo')}</option>
                      <option value="other">{t('contact.other')}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    {t('contact.message')} *
                  </label>
                  <textarea
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder={t('contact.tell_us_project')}
                    className="w-full px-5 py-3 text-base text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
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
                  {isLoading ? `⏳ ${t('contact.sending')}` : `✉️ ${t('contact.send_button')}`}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ContactPage;

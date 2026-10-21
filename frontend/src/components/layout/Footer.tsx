import { useState, useEffect } from 'react';
import { navigateTo, navigateToSection } from '../../utils/navigation';
import { useThemeColors } from '../../hooks/useThemeColors';
import { API_ENDPOINTS } from '../../config/api';

interface MenuItem {
  name: string;
  type: 'section' | 'page';
  target: string;
}

const Footer = () => {
  const { theme } = useThemeColors();
  const [brand, setBrand] = useState({ name: 'Alvaeryn', logo_url: '/Final-Logo.png' });

  useEffect(() => {
    fetch(API_ENDPOINTS.profile)
      .then((res) => res.json())
      .then((res) => {
        if (res.status === 'success' && res.data) {
          setBrand({
            name: res.data.name || 'Alvaeryn',
            logo_url: res.data.logo_url || '/Final-Logo.png'
          });
        }
      })
      .catch(() => {});
  }, []);

  const menuItems: MenuItem[] = [
    { name: 'Home', type: 'section', target: '#home' },
    { name: 'Layanan', type: 'section', target: '#services' },
    { name: 'Portfolio', type: 'section', target: '#projects' },
    { name: 'Testimoni', type: 'section', target: '#testimonials' },
    { name: 'Harga', type: 'section', target: '#pricing' },
    { name: 'FAQ', type: 'page', target: '/faq' },
  ];

  const contactItems = [
    { name: 'WhatsApp', href: 'https://wa.me/628818411915' },
    { name: 'Email', href: 'mailto:vaeran2904@gmail.com' },
    { name: 'Telegram', href: 'https://t.me/alvaeryn' },
    { name: 'GitHub', href: 'https://github.com/Alvaeryn' },
  ];

  const handleMenuClick = (type: 'section' | 'page', target: string) => {
    if (type === 'page') {
      navigateTo(target);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    navigateToSection(target);
  };

  return (
    <footer className="bg-white text-slate-700 py-12 border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <img src={brand.logo_url || '/Final-Logo.png'} alt={`${brand.name} Logo`} className="h-14 w-14" />
              <div className="text-xl font-bold" style={{ color: theme.primary_color }}>
                {brand.name}
              </div>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Solusi digital profesional untuk UMKM Indonesia
            </p>
          </div>

          {/* Menu */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 mb-4 uppercase">
              Halaman
            </h4>
            <ul className="space-y-2">
              {menuItems.map((item, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => handleMenuClick(item.type, item.target)}
                    className="text-xs text-slate-600 hover:transition"
                    style={{ color: 'inherit' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = theme.accent_color)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 mb-4 uppercase">
              Kontak
            </h4>
            <ul className="space-y-2">
              {contactItems.map((item, i) => (
                <li key={i}>
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-600" style={{ color: 'inherit' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = theme.accent_color)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-slate-200 text-center">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} {brand.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


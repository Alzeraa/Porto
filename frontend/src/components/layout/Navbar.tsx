import { useState, useEffect } from 'react';
import { navigateTo, navigateToSection } from '../../utils/navigation';
import { API_ENDPOINTS } from '../../config/api';
import { useThemeStore } from '../../store/themeStore';
import { useLanguage } from '../../hooks/useLanguage';
import LanguageSwitcher from '../common/LanguageSwitcher';

interface MenuItem {
  name: string;
  type: 'section' | 'page';
  target: string;
}

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [brand, setBrand] = useState({ name: 'ALVAERYN', logo_url: '/Final-Logo.png' });
  const [activeSection, setActiveSection] = useState('home');
  const { darkMode, toggleDarkMode } = useThemeStore();
  const { t } = useLanguage();

  useEffect(() => {
    fetch(API_ENDPOINTS.profile)
      .then((res) => res.json())
      .then((res) => {
        if (res.status === 'success' && res.data) {
          setBrand({
            name: (res.data.name || 'ALVAERYN').toUpperCase(),
            logo_url: res.data.logo_url || '/Final-Logo.png'
          });
        }
      })
      .catch(() => {});
  }, []);

  const menuItems: MenuItem[] = [
    { name: t('navbar.home'), type: 'page', target: '/home' },
    { name: t('navbar.services'), type: 'page', target: '/services' },
    { name: t('navbar.projects'), type: 'page', target: '/projects' },
    { name: t('navbar.about'), type: 'page', target: '/about' },
    { name: t('navbar.contact'), type: 'page', target: '/contact' },
  ];

  const handleMenuClick = (type: 'section' | 'page', target: string) => {
    if (type === 'page') {
      navigateTo(target);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigateToSection(target);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-[#0B132B]/90 backdrop-blur-md border-b border-slate-200 dark:border-[#1E293B]/40 transition-all duration-200">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 h-20 flex items-center justify-between relative">
        {/* Vertical guide lines (hidden on mobile) */}
        <div className="absolute left-[58%] top-0 bottom-0 w-[1px] bg-slate-300 dark:bg-[#1E293B]/40 pointer-events-none hidden md:block"></div>
        <div className="absolute right-[10%] top-0 bottom-0 w-[1px] bg-slate-300 dark:bg-[#1E293B]/40 pointer-events-none hidden md:block"></div>

        {/* Logo & Brand */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setActiveSection('home');
            navigateTo('/');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3.5 focus:outline-none hover:opacity-80 transition"
        >
          <div className="flex items-center justify-center w-8 h-8 select-none">
            <img src={brand.logo_url} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="font-sans font-extrabold text-slate-900 dark:text-white tracking-[0.24em] text-[14px] sm:text-[16px] leading-tight">
              {brand.name}
            </span>
            <span className="font-sans text-[7px] sm:text-[8.5px] text-slate-600 dark:text-[#8E9DB5] font-semibold tracking-[0.24em] uppercase">
              DIGITAL STUDIO
            </span>
          </div>
        </button>

        {/* Desktop Navigation Menu (Centered) */}
        <nav className="hidden md:flex items-center gap-8 text-[13.5px] font-sans font-medium absolute left-1/2 transform -translate-x-1/2">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.preventDefault();
                handleMenuClick(item.type, item.target);
              }}
              className={`relative py-1 transition-colors tracking-wide group ${
                activeSection === item.target.replace('#', '')
                  ? 'text-[#2563EB] font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {item.name}
              {activeSection === item.target.replace('#', '') && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#2563EB] rounded-full"></span>
              )}
            </button>
          ))}
        </nav>

        {/* Desktop CTA Button */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 transition-all duration-200 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            title={darkMode ? 'Light Mode' : 'Dark Mode'}
          >
            {darkMode ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/* CTA Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              handleMenuClick('page', '/contact');
            }}
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-sans text-xs font-semibold tracking-wide transition-all duration-150 active:scale-[0.98] shadow-md shadow-blue-600/25"
          >
            <span>{t('navbar.cta')}</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-white/5 transition"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg
            className="w-6 h-6 text-slate-900 dark:text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-[#1E293B]/40 bg-white dark:bg-[#0B132B] px-6 py-4">
          <div className="flex flex-col gap-3">
            {menuItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  handleMenuClick(item.type, item.target);
                }}
                className="text-left px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition font-sans text-sm"
              >
                {item.name}
              </button>
            ))}
            
            {/* Dark Mode Toggle Mobile */}
            <button
              onClick={toggleDarkMode}
              className="text-left px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition font-sans text-sm flex items-center gap-2"
            >
              {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>

            {/* Language Switcher Mobile */}
            <div className="px-4 py-2">
              <LanguageSwitcher />
            </div>

            <button
              onClick={() => {
                handleMenuClick('page', '/contact');
              }}
              className="mt-3 w-full px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-sans text-sm font-semibold transition-all"
            >
              {t('navbar.cta')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;


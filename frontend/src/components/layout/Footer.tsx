import { useState, useEffect } from 'react';
import { navigateTo } from '../../utils/navigation';
import { API_ENDPOINTS } from '../../config/api';

interface ProfileData {
  name?: string;
  logo_url?: string;
  whatsapp?: string;
  email?: string;
}

const Footer = () => {
  const [profile, setProfile] = useState<ProfileData>({
    name: 'ALZERA',
    logo_url: '/Final-Logo.png',
    whatsapp: '628818411915',
    email: 'contact@alzera.web.id',
  });

  useEffect(() => {
    fetch(API_ENDPOINTS.profile)
      .then((r) => r.json())
      .then((res) => {
        if (res.status === 'success' && res.data) {
          setProfile((prev) => ({ ...prev, ...res.data }));
        }
      })
      .catch(() => {});
  }, []);

  const brandName = (profile.name || 'ALZERA').toUpperCase();
  const waNumber = (profile.whatsapp || '628818411915').replace(/\D/g, '');
  const email = profile.email || 'contact@alzera.web.id';
  const domain = 'alzera.web.id';

  const handleNav = (path: string) => {
    navigateTo(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#0B1320] text-slate-400 border-t border-[#1E293B]/60">

      {/* ── Main footer grid ── */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

          {/* Brand column */}
          <div className="md:col-span-4 flex flex-col gap-4">
            {/* Logo + name */}
            <div className="flex items-center gap-3">
              <img
                src={profile.logo_url || '/Final-Logo.png'}
                alt={brandName}
                className="w-7 h-7 object-contain"
              />
              <span className="font-extrabold text-white tracking-[0.2em] text-[15px]">
                {brandName}
              </span>
            </div>

            {/* Tagline */}
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Digital solutions for modern businesses. Transforming ideas into high-impact web applications, websites, and business systems.
            </p>
          </div>

          {/* Spacer */}
          <div className="hidden md:block md:col-span-1" />

          {/* Services */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <h4 className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-white">
              Services
            </h4>
            <ul className="flex flex-col gap-2.5">
              {[
                'Web Engineering',
                'Cloud Architecture',
                'UI/UX System Design',
                'Enterprise Systems',
              ].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => handleNav('/services')}
                    className="text-sm text-slate-400 hover:text-white transition-colors duration-150 text-left"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <h4 className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-white">
              Company
            </h4>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: 'About Us', path: '/about' },
                { label: 'Case Studies', path: '/projects' },
                { label: 'Careers', path: '/contact' },
                { label: 'Privacy Policy', path: '/' },
              ].map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => handleNav(item.path)}
                    className="text-sm text-slate-400 hover:text-white transition-colors duration-150 text-left"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <h4 className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-white">
              Contact
            </h4>
            <div className="flex flex-col gap-3 text-sm">
              <div>
                <p className="text-slate-500 text-xs mb-0.5">WhatsApp &amp; Inquiries:</p>
                <a
                  href={`https://wa.me/${waNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-white hover:text-blue-400 transition-colors duration-150"
                >
                  +62 ({brandName}-DIGITAL)
                </a>
              </div>
              <div>
                <p className="text-slate-500 text-xs mb-0.5">Direct Support:</p>
                <a
                  href={`mailto:${email}`}
                  className="font-semibold text-white hover:text-blue-400 transition-colors duration-150"
                >
                  {email}
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-[#1E293B]/60">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} {brandName} ({domain}). All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <button
              onClick={() => handleNav('/')}
              className="text-xs text-slate-500 hover:text-white transition-colors duration-150"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => handleNav('/contact')}
              className="text-xs text-slate-500 hover:text-white transition-colors duration-150"
            >
              Contact
            </button>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;

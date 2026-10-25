import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';
import HeroCardsPage from './admin/HeroCardsPage';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  whatsapp?: string;
  service?: string;
  message: string;
  status: string;
  created_at: string;
}

interface ProjectItem {
  id?: number;
  title: string;
  category: string;
  description: string;
  tech: string[];
  image: string;
  link?: string;
}

interface ServiceItem {
  id?: number;
  icon: string;
  title: string;
  description: string;
  features: string[];
}

interface ProfileForm {
  name: string;
  badge: string;
  title: string;
  subtitle: string;
  bio?: string;
  whatsapp?: string;
  email?: string;
  github?: string;
  linkedin?: string;
  logo_url?: string;
  cta_primary_text?: string;
  cta_primary_link?: string;
  cta_secondary_text?: string;
  cta_secondary_link?: string;
  trusted_by_title?: string;
  tech_stack_title?: string;
  tech_stack?: string;
}

interface TeamItem {
  id?: number;
  name: string;
  role: string;
  bio: string;
  image: string;
}

interface TestimonialItem {
  id?: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  photo: string;
}

interface PricingItem {
  id?: number;
  name: string;
  price: string;
  popular: boolean;
  features: string[];
}

const AdminPage: React.FC = () => {
  // Auth state
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('alvaeryn_admin_token'));
  const [loginEmail, setLoginEmail] = useState('admin@gmail.com');
  const [loginPassword, setLoginPassword] = useState('admin123');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Dashboard active tab
  const [activeTab, setActiveTab] = useState<'overview' | 'inbox' | 'profile' | 'projects' | 'services' | 'team' | 'testimonials' | 'pricing' | 'hero-cards' | 'preview'>('overview');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [previewKey, setPreviewKey] = useState(0);

  // Data states
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamItem[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [pricingPackages, setPricingPackages] = useState<PricingItem[]>([]);

  // Team Modal State
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<TeamItem | null>(null);
  const [teamForm, setTeamForm] = useState({ name: '', role: '', bio: '', image: '' });

  // Testimonial Modal State
  const [isTestiModalOpen, setIsTestiModalOpen] = useState(false);
  const [editingTesti, setEditingTesti] = useState<TestimonialItem | null>(null);
  const [testiForm, setTestiForm] = useState({ name: '', role: '', content: '', rating: 5, photo: '' });

  // Pricing Modal State
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [editingPricing, setEditingPricing] = useState<PricingItem | null>(null);
  const [pricingForm, setPricingForm] = useState({ name: '', price: '', popular: false, featuresInput: '' });
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [profile, setProfile] = useState<ProfileForm>({
    name: 'Alvaeryn',
    badge: 'Jasa Pembuatan Website & Aplikasi Profesional',
    title: 'Bangun Website & Aplikasi Yang Memukau',
    subtitle: 'Alvaeryn siap membantu kamu buat website, landing page, dan aplikasi mobile modern—cepat, responsif, dan profesional!',
    whatsapp: '081234567890',
    email: 'admin@gmail.com',
    github: 'https://github.com/Alvaeryn',
    linkedin: 'https://linkedin.com',
    logo_url: '/Final-Logo.png',
    cta_primary_text: 'Konsultasi Gratis Sekarang',
    cta_primary_link: '#contact',
    cta_secondary_text: 'Lihat Proyek Kami',
    cta_secondary_link: '#projects',
    trusted_by_title: 'Dipercaya oleh Startup & UMKM Mapan',
    tech_stack_title: 'Teknologi yang Kami Gunakan',
    tech_stack: 'React, Next.js, TypeScript, JavaScript, Flutter, Node.js, Express, MySQL, PHP, Laravel, Tailwind, Figma'
  });
  const [logoUploading, setLogoUploading] = useState(false);

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Project Modal State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    category: 'Full-Stack Web',
    description: '',
    techInput: '',
    image: '',
    link: ''
  });

  // Service Modal State
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [serviceForm, setServiceForm] = useState({
    icon: '🌐',
    title: '',
    description: '',
    featuresInput: ''
  });

  const showNotice = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const res = await fetch(API_ENDPOINTS.auth.login, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      const data = await res.json();
      if (data.status === 'success' && data.data?.token) {
        localStorage.setItem('alvaeryn_admin_token', data.data.token);
        localStorage.setItem('alvaeryn_admin_user', JSON.stringify(data.data.admin));
        setToken(data.data.token);
        showNotice('Login berhasil! Selamat datang di Admin Dashboard.');
      } else {
        setLoginError(data.message || 'Login gagal, periksa email dan password.');
      }
    } catch (err) {
      setLoginError('Tidak dapat terhubung ke server backend (http://localhost:5000).');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('alvaeryn_admin_token');
    localStorage.removeItem('alvaeryn_admin_user');
    setToken(null);
  };

  // Fetch all dashboard data
  const loadDashboardData = async () => {
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    // Fetch contacts
    try {
      const res = await fetch(API_ENDPOINTS.contact, { headers });
      const data = await res.json();
      if (data.status === 'success') setMessages(data.data || []);
    } catch (e) {
      console.error(e);
    }

    // Fetch profile
    try {
      const res = await fetch(API_ENDPOINTS.profile);
      const data = await res.json();
      if (data.status === 'success' && data.data) setProfile(data.data);
    } catch (e) {
      console.error(e);
    }

    // Fetch projects
    try {
      const res = await fetch(API_ENDPOINTS.projects);
      const data = await res.json();
      if (data.status === 'success') setProjects(data.data || []);
    } catch (e) {
      console.error(e);
    }

    // Fetch services
    try {
      const res = await fetch(API_ENDPOINTS.services);
      const data = await res.json();
      if (data.status === 'success') setServices(data.data || []);
    } catch (e) {
      console.error(e);
    }

    // Fetch team
    try {
      const res = await fetch(API_ENDPOINTS.team);
      const data = await res.json();
      if (data.status === 'success') setTeamMembers(data.data || []);
    } catch (e) { console.error(e); }

    // Fetch testimonials
    try {
      const res = await fetch(API_ENDPOINTS.testimonials);
      const data = await res.json();
      if (data.status === 'success') setTestimonials(data.data || []);
    } catch (e) { console.error(e); }

    // Fetch pricing
    try {
      const res = await fetch(API_ENDPOINTS.pricing);
      const data = await res.json();
      if (data.status === 'success') setPricingPackages(data.data || []);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (token) {
      loadDashboardData();
    }
  }, [token]);

  // Contact actions
  const handleDeleteMessage = async (id: number) => {
    if (!confirm('Hapus pesan ini secara permanen?')) return;
    try {
      const res = await fetch(`${API_ENDPOINTS.contact}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.status === 'success') {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        showNotice('Pesan berhasil dihapus.');
      }
    } catch (e) {
      showNotice('Gagal menghapus pesan.', 'error');
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      const res = await fetch(`${API_ENDPOINTS.contact}/${id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.status === 'success') {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status: 'read' } : m))
        );
        showNotice('Status pesan diubah menjadi dibaca.');
      }
    } catch (e) {
      showNotice('Gagal mengupdate status.', 'error');
    }
  };

  const handleLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showNotice('Harap pilih file gambar (PNG, JPG, SVG, WebP)', 'error');
      return;
    }

    setLogoUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        const res = await fetch(API_ENDPOINTS.upload, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            imageBase64: base64,
            filename: file.name.split('.')[0]
          })
        });
        const data = await res.json();
        if (data.status === 'success' && data.data?.url) {
          setProfile((prev) => ({ ...prev, logo_url: data.data.url }));
          showNotice('Logo berhasil diunggah! Jangan lupa klik Simpan.');
        } else {
          showNotice(data.message || 'Gagal mengunggah logo', 'error');
        }
      } catch (err) {
        showNotice('Gagal menghubungkan ke server upload', 'error');
      } finally {
        setLogoUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Profile save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(API_ENDPOINTS.profile, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });
      const data = await res.json();
      if (data.status === 'success') {
        showNotice('Profil & data Hero berhasil diperbarui!');
      } else {
        showNotice(data.message || 'Gagal menyimpan profil', 'error');
      }
    } catch (e) {
      showNotice('Gagal terhubung ke server', 'error');
    }
  };

  // Project modal handlers
  const openAddProject = () => {
    setEditingProject(null);
    setProjectForm({
      title: '',
      category: 'Full-Stack Web',
      description: '',
      techInput: 'React, TypeScript, Tailwind, Node.js',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800',
      link: ''
    });
    setIsProjectModalOpen(true);
  };

  const openEditProject = (p: ProjectItem) => {
    setEditingProject(p);
    setProjectForm({
      title: p.title,
      category: p.category,
      description: p.description,
      techInput: p.tech ? p.tech.join(', ') : '',
      image: p.image,
      link: p.link || ''
    });
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const techArray = projectForm.techInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: projectForm.title,
      category: projectForm.category,
      description: projectForm.description,
      tech: techArray,
      image: projectForm.image,
      link: projectForm.link
    };

    try {
      if (editingProject && editingProject.id) {
        // Edit
        const res = await fetch(`${API_ENDPOINTS.projects}/${editingProject.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.status === 'success') {
          setProjects((prev) =>
            prev.map((item) => (item.id === editingProject.id ? data.data : item))
          );
          setIsProjectModalOpen(false);
          showNotice('Proyek berhasil diperbarui!');
        }
      } else {
        // Add
        const res = await fetch(API_ENDPOINTS.projects, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.status === 'success') {
          setProjects((prev) => [data.data, ...prev]);
          setIsProjectModalOpen(false);
          showNotice('Proyek baru berhasil ditambahkan!');
        }
      }
    } catch (e) {
      showNotice('Gagal menyimpan proyek.', 'error');
    }
  };

  const handleDeleteProject = async (id?: number) => {
    if (!id || !confirm('Hapus proyek ini?')) return;
    try {
      const res = await fetch(`${API_ENDPOINTS.projects}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.status === 'success') {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        showNotice('Proyek berhasil dihapus.');
      }
    } catch (e) {
      showNotice('Gagal menghapus proyek.', 'error');
    }
  };

  // Service modal handlers
  const openAddService = () => {
    setEditingService(null);
    setServiceForm({
      icon: '🌐',
      title: '',
      description: '',
      featuresInput: 'Responsive, Fast Loading, Modern UI'
    });
    setIsServiceModalOpen(true);
  };

  const openEditService = (s: ServiceItem) => {
    setEditingService(s);
    setServiceForm({
      icon: s.icon,
      title: s.title,
      description: s.description,
      featuresInput: s.features ? s.features.join(', ') : ''
    });
    setIsServiceModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    const featArray = serviceForm.featuresInput
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean);

    const payload = {
      icon: serviceForm.icon,
      title: serviceForm.title,
      description: serviceForm.description,
      features: featArray
    };

    try {
      if (editingService && editingService.id) {
        const res = await fetch(`${API_ENDPOINTS.services}/${editingService.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.status === 'success') {
          setServices((prev) =>
            prev.map((item) => (item.id === editingService.id ? data.data : item))
          );
          setIsServiceModalOpen(false);
          showNotice('Layanan berhasil diperbarui!');
        }
      } else {
        const res = await fetch(API_ENDPOINTS.services, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.status === 'success') {
          setServices((prev) => [...prev, data.data]);
          setIsServiceModalOpen(false);
          showNotice('Layanan baru berhasil ditambahkan!');
        }
      }
    } catch (e) {
      showNotice('Gagal menyimpan layanan.', 'error');
    }
  };

  const handleDeleteService = async (id?: number) => {
    if (!id || !confirm('Hapus layanan ini?')) return;
    try {
      const res = await fetch(`${API_ENDPOINTS.services}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.status === 'success') {
        setServices((prev) => prev.filter((s) => s.id !== id));
        showNotice('Layanan berhasil dihapus.');
      }
    } catch (e) {
      showNotice('Gagal menghapus layanan.', 'error');
    }
  };

  // --- Team CRUD ---
  const openAddTeam = () => {
    setEditingTeam(null);
    setTeamForm({ name: '', role: '', bio: '', image: '' });
    setIsTeamModalOpen(true);
  };
  const openEditTeam = (t: TeamItem) => {
    setEditingTeam(t);
    setTeamForm({ name: t.name, role: t.role, bio: t.bio, image: t.image });
    setIsTeamModalOpen(true);
  };
  const handleSaveTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTeam?.id) {
        const res = await fetch(`${API_ENDPOINTS.team}/${editingTeam.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(teamForm)
        });
        const data = await res.json();
        if (data.status === 'success') { setTeamMembers(p => p.map(m => m.id === editingTeam.id ? data.data : m)); setIsTeamModalOpen(false); showNotice('Anggota tim diperbarui!'); }
      } else {
        const res = await fetch(API_ENDPOINTS.team, {
          method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(teamForm)
        });
        const data = await res.json();
        if (data.status === 'success') { setTeamMembers(p => [...p, data.data]); setIsTeamModalOpen(false); showNotice('Anggota tim ditambahkan!'); }
      }
    } catch { showNotice('Gagal menyimpan anggota tim.', 'error'); }
  };
  const handleDeleteTeam = async (id?: number) => {
    if (!id || !confirm('Hapus anggota tim ini?')) return;
    try {
      const res = await fetch(`${API_ENDPOINTS.team}/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.status === 'success') { setTeamMembers(p => p.filter(m => m.id !== id)); showNotice('Anggota tim dihapus.'); }
    } catch { showNotice('Gagal menghapus.', 'error'); }
  };

  // --- Testimonial CRUD ---
  const openAddTesti = () => {
    setEditingTesti(null);
    setTestiForm({ name: '', role: '', content: '', rating: 5, photo: '' });
    setIsTestiModalOpen(true);
  };
  const openEditTesti = (t: TestimonialItem) => {
    setEditingTesti(t);
    setTestiForm({ name: t.name, role: t.role, content: t.content, rating: t.rating, photo: t.photo });
    setIsTestiModalOpen(true);
  };
  const handleSaveTesti = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTesti?.id) {
        const res = await fetch(`${API_ENDPOINTS.testimonials}/${editingTesti.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(testiForm)
        });
        const data = await res.json();
        if (data.status === 'success') { setTestimonials(p => p.map(t => t.id === editingTesti.id ? data.data : t)); setIsTestiModalOpen(false); showNotice('Testimoni diperbarui!'); }
      } else {
        const res = await fetch(API_ENDPOINTS.testimonials, {
          method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(testiForm)
        });
        const data = await res.json();
        if (data.status === 'success') { setTestimonials(p => [...p, data.data]); setIsTestiModalOpen(false); showNotice('Testimoni ditambahkan!'); }
      }
    } catch { showNotice('Gagal menyimpan testimoni.', 'error'); }
  };
  const handleDeleteTesti = async (id?: number) => {
    if (!id || !confirm('Hapus testimoni ini?')) return;
    try {
      const res = await fetch(`${API_ENDPOINTS.testimonials}/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.status === 'success') { setTestimonials(p => p.filter(t => t.id !== id)); showNotice('Testimoni dihapus.'); }
    } catch { showNotice('Gagal menghapus.', 'error'); }
  };

  // --- Pricing CRUD ---
  const openAddPricing = () => {
    setEditingPricing(null);
    setPricingForm({ name: '', price: '', popular: false, featuresInput: '' });
    setIsPricingModalOpen(true);
  };
  const openEditPricing = (p: PricingItem) => {
    setEditingPricing(p);
    setPricingForm({ name: p.name, price: p.price, popular: p.popular, featuresInput: p.features?.join(', ') || '' });
    setIsPricingModalOpen(true);
  };
  const handleSavePricing = async (e: React.FormEvent) => {
    e.preventDefault();
    const featArray = pricingForm.featuresInput.split(',').map(f => f.trim()).filter(Boolean);
    const payload = { name: pricingForm.name, price: pricingForm.price, popular: pricingForm.popular, features: featArray };
    try {
      if (editingPricing?.id) {
        const res = await fetch(`${API_ENDPOINTS.pricing}/${editingPricing.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.status === 'success') { setPricingPackages(p => p.map(x => x.id === editingPricing.id ? data.data : x)); setIsPricingModalOpen(false); showNotice('Paket harga diperbarui!'); }
      } else {
        const res = await fetch(API_ENDPOINTS.pricing, {
          method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.status === 'success') { setPricingPackages(p => [...p, data.data]); setIsPricingModalOpen(false); showNotice('Paket harga ditambahkan!'); }
      }
    } catch { showNotice('Gagal menyimpan paket harga.', 'error'); }
  };
  const handleDeletePricing = async (id?: number) => {
    if (!id || !confirm('Hapus paket harga ini?')) return;
    try {
      const res = await fetch(`${API_ENDPOINTS.pricing}/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.status === 'success') { setPricingPackages(p => p.filter(x => x.id !== id)); showNotice('Paket harga dihapus.'); }
    } catch { showNotice('Gagal menghapus.', 'error'); }
  };

  // -------------------------------------------------------------
  // RENDER: LOGIN VIEW (Jika Belum Login)
  // -------------------------------------------------------------
  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-6 text-white">
        <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle Glow */}
          <div className="absolute -top-20 -right-20 w-44 h-44 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="text-center mb-8 relative z-10">
            <div className="w-16 h-16 bg-gradient-to-tr from-cyan-500 to-teal-400 rounded-2xl mx-auto flex items-center justify-center text-3xl font-black shadow-lg shadow-cyan-500/30 mb-4">
              A
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Alvaeryn Admin Portal</h1>
            <p className="text-slate-400 text-sm mt-1">Masuk untuk mengelola data portofolio dinamis</p>
          </div>

          {/* Preset Helper Box */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 mb-6 text-xs text-slate-300">
            <div className="font-semibold text-cyan-400 mb-1 flex items-center gap-1.5">
              <span>🔑</span> Kredensial Admin Bawaan:
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2 font-mono bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Email:</span>
                admin@gmail.com
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Password:</span>
                admin123
              </div>
            </div>
          </div>

          {loginError && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs p-3 rounded-xl mb-4">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 relative z-10">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@gmail.com"
                className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="admin123"
                className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold rounded-xl hover:opacity-95 transition-all shadow-lg shadow-cyan-500/20 active:scale-[0.99] disabled:opacity-50 text-sm mt-2 flex items-center justify-center gap-2"
            >
              {loginLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                  Memverifikasi...
                </>
              ) : (
                'Masuk ke Dashboard'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-xs text-slate-400 hover:text-cyan-400 transition-colors inline-flex items-center gap-1.5"
            >
              <span>←</span> Kembali ke Halaman Utama Portfolio
            </a>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: ADMIN DASHBOARD (Sudah Login)
  // -------------------------------------------------------------
  const unreadCount = messages.filter((m) => m.status === 'unread').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold flex items-center gap-2 transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-500 text-slate-950'
              : 'bg-rose-500 text-white'
          }`}
        >
          <span>{notification.type === 'success' ? '✓' : '✕'}</span>
          {notification.message}
        </div>
      )}

      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-teal-400 rounded-xl flex items-center justify-center text-slate-950 font-black text-xl shadow-md shadow-cyan-500/20">
            A
          </div>
          <div>
            <h2 className="font-bold text-white text-base leading-tight">Alvaeryn Admin</h2>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              SQLite Engine (portfolio.db)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5"
          >
            <span>↗</span> Lihat Website
          </a>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold rounded-lg transition-all"
          >
            Keluar
          </button>
        </div>
      </header>

      {/* Dashboard Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto p-6 gap-8">
        {/* Sidebar Nav */}
        <aside className="w-64 flex-shrink-0 space-y-1.5">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all ${
              activeTab === 'overview'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span>📊</span>
              <span>Ringkasan</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('inbox')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all ${
              activeTab === 'inbox'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span>📩</span>
              <span>Pesan Masuk</span>
            </div>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-rose-500 text-white font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all ${
              activeTab === 'profile'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span>👤</span>
              <span>Profil & Hero</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all ${
              activeTab === 'projects'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span>💼</span>
              <span>Kelola Proyek</span>
            </div>
            <span className="text-xs opacity-60">({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all ${
              activeTab === 'services'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span>🛠️</span>
              <span>Kelola Layanan</span>
            </div>
            <span className="text-xs opacity-60">({services.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('team')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all ${
              activeTab === 'team'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span>👥</span>
              <span>Kelola Tim</span>
            </div>
            <span className="text-xs opacity-60">({teamMembers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('testimonials')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all ${
              activeTab === 'testimonials'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span>⭐</span>
              <span>Testimoni</span>
            </div>
            <span className="text-xs opacity-60">({testimonials.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('pricing')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all ${
              activeTab === 'pricing'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span>💰</span>
              <span>Harga Paket</span>
            </div>
            <span className="text-xs opacity-60">({pricingPackages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('hero-cards')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all ${
              activeTab === 'hero-cards'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span>🎨</span>
              <span>Hero Cards</span>
            </div>
            <span className="text-xs opacity-60">(Carousel)</span>
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all ${
              activeTab === 'preview'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span>📱</span>
              <span>Preview Web</span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
              Live
            </span>
          </button>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-slate-900/60 border border-slate-800 rounded-3xl p-8 backdrop-blur-md">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white">Dashboard Ringkasan</h2>
                <p className="text-slate-400 text-sm mt-1">
                  Kontrol penuh konten dinamis website portofolio Alvaeryn.
                </p>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-slate-800/80 border border-slate-700/60 p-6 rounded-2xl relative overflow-hidden">
                  <div className="text-3xl font-black text-cyan-400 mb-1">{messages.length}</div>
                  <div className="text-sm font-semibold text-slate-200">Total Pesan Kontak</div>
                  <div className="text-xs text-slate-400 mt-2">
                    <span className="text-rose-400 font-bold">{unreadCount}</span> belum dibaca
                  </div>
                  <button
                    onClick={() => setActiveTab('inbox')}
                    className="mt-4 text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    Buka Kotak Masuk →
                  </button>
                </div>

                <div className="bg-slate-800/80 border border-slate-700/60 p-6 rounded-2xl relative overflow-hidden">
                  <div className="text-3xl font-black text-teal-400 mb-1">{projects.length}</div>
                  <div className="text-sm font-semibold text-slate-200">Proyek Ditampilkan</div>
                  <div className="text-xs text-slate-400 mt-2">Tersedia di galeri portofolio</div>
                  <button
                    onClick={() => setActiveTab('projects')}
                    className="mt-4 text-xs font-semibold text-teal-400 hover:underline flex items-center gap-1"
                  >
                    Kelola Proyek →
                  </button>
                </div>

                <div className="bg-slate-800/80 border border-slate-700/60 p-6 rounded-2xl relative overflow-hidden">
                  <div className="text-3xl font-black text-indigo-400 mb-1">{services.length}</div>
                  <div className="text-sm font-semibold text-slate-200">Layanan Aktif</div>
                  <div className="text-xs text-slate-400 mt-2">Ditampilkan pada halaman utama</div>
                  <button
                    onClick={() => setActiveTab('services')}
                    className="mt-4 text-xs font-semibold text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    Kelola Layanan →
                  </button>
                </div>

                <div className="bg-slate-800/80 border border-slate-700/60 p-6 rounded-2xl relative overflow-hidden">
                  <div className="text-3xl font-black text-emerald-400 mb-1">{teamMembers.length}</div>
                  <div className="text-sm font-semibold text-slate-200">Anggota Tim</div>
                  <div className="text-xs text-slate-400 mt-2">Daftar tim profesional</div>
                  <button
                    onClick={() => setActiveTab('team')}
                    className="mt-4 text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    Kelola Tim →
                  </button>
                </div>

                <div className="bg-slate-800/80 border border-slate-700/60 p-6 rounded-2xl relative overflow-hidden">
                  <div className="text-3xl font-black text-amber-400 mb-1">{testimonials.length}</div>
                  <div className="text-sm font-semibold text-slate-200">Testimoni Klien</div>
                  <div className="text-xs text-slate-400 mt-2">Ulasan dan rating kepuasan</div>
                  <button
                    onClick={() => setActiveTab('testimonials')}
                    className="mt-4 text-xs font-semibold text-amber-400 hover:underline flex items-center gap-1"
                  >
                    Kelola Testimoni →
                  </button>
                </div>

                <div className="bg-slate-800/80 border border-slate-700/60 p-6 rounded-2xl relative overflow-hidden">
                  <div className="text-3xl font-black text-purple-400 mb-1">{pricingPackages.length}</div>
                  <div className="text-sm font-semibold text-slate-200">Paket Harga</div>
                  <div className="text-xs text-slate-400 mt-2">Daftar paket dan harga layanan</div>
                  <button
                    onClick={() => setActiveTab('pricing')}
                    className="mt-4 text-xs font-semibold text-purple-400 hover:underline flex items-center gap-1"
                  >
                    Kelola Harga Paket →
                  </button>
                </div>
              </div>

              {/* System Info Box */}
              <div className="bg-slate-800/40 border border-slate-700/40 p-6 rounded-2xl">
                <h3 className="font-bold text-white text-base mb-3 flex items-center gap-2">
                  <span>⚙️</span> Status Database & Penyimpanan Lokal
                </h3>
                <div className="text-sm text-slate-300 space-y-2">
                  <p>
                    <strong className="text-slate-400">Database Engine:</strong> SQLite 3 (High-performance WAL Mode)
                  </p>
                  <p>
                    <strong className="text-slate-400">Letak Berkas Fisik:</strong>{' '}
                    <code className="bg-slate-950 px-2 py-0.5 rounded text-cyan-300 text-xs">
                      backend/portfolio.db
                    </code>
                  </p>
                  <p>
                    <strong className="text-slate-400">Metode Backup:</strong> Cukup salin berkas{' '}
                    <code className="text-xs text-slate-200">portfolio.db</code> atau seluruh folder proyek.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INBOX */}
          {activeTab === 'inbox' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white">Pesan Masuk (Kontak)</h2>
                  <p className="text-slate-400 text-sm mt-1">
                    Daftar pesan dari formulir kontak portofolio.
                  </p>
                </div>
                <button
                  onClick={loadDashboardData}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 rounded-lg transition-all"
                >
                  Segarkan ↺
                </button>
              </div>

              {messages.length === 0 ? (
                <div className="text-center py-16 text-slate-500 text-sm">
                  Belum ada pesan kontak masuk saat ini.
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        m.status === 'unread'
                          ? 'bg-slate-800/90 border-cyan-500/40 shadow-lg shadow-cyan-500/5'
                          : 'bg-slate-800/40 border-slate-700/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <div className="flex items-center gap-3">
                            <h4 className="font-bold text-white text-base">{m.name}</h4>
                            {m.status === 'unread' && (
                              <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold rounded-full uppercase">
                                Baru
                              </span>
                            )}
                            {m.service && (
                              <span className="px-2 py-0.5 bg-slate-700 text-slate-300 text-xs rounded-full">
                                {m.service}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 mt-1 flex flex-wrap gap-4">
                            <span>📧 {m.email}</span>
                            {m.whatsapp && (
                              <a
                                href={`https://wa.me/${m.whatsapp.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-emerald-400 hover:underline"
                              >
                                💬 WhatsApp: {m.whatsapp}
                              </a>
                            )}
                            <span>🕒 {new Date(m.created_at).toLocaleString('id-ID')}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {m.status === 'unread' && (
                            <button
                              onClick={() => handleMarkAsRead(m.id)}
                              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs rounded-lg transition-all"
                            >
                              Tandai Dibaca
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteMessage(m.id)}
                            className="px-3 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs rounded-lg transition-all"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>

                      <div className="bg-slate-950/50 p-3.5 rounded-xl text-sm text-slate-300 border border-slate-800/80 whitespace-pre-line">
                        {m.message}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PROFIL & HERO */}
          {activeTab === 'profile' && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white">Edit Profil & Seluruh Bagian Hero</h2>
                <p className="text-slate-400 text-sm mt-1">
                  Semua elemen pada halaman utama (Logo, Teks Badge, Judul, Tombol CTA, Partner, dan Tech Stack) dapat kamu sesuaikan di sini secara dinamis.
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-8 max-w-4xl">
                {/* SECTION 1: LOGO & IDENTITAS */}
                <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6">
                  <h3 className="text-base font-bold text-cyan-400 mb-4 flex items-center gap-2">
                    <span>✨</span> Logo & Identitas Brand
                  </h3>

                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Logo Preview */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-28 h-28 rounded-2xl bg-slate-900 border-2 border-dashed border-slate-700 flex items-center justify-center p-2 relative overflow-hidden shadow-inner group">
                        <img
                          src={profile.logo_url || '/Final-Logo.png'}
                          alt="Logo Preview"
                          className="w-full h-full object-contain"
                        />
                        {logoUploading && (
                          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-xs text-cyan-400 font-semibold gap-1">
                            <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                            Mengunggah...
                          </div>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">Preview Logo</span>
                    </div>

                    {/* Logo Controls */}
                    <div className="flex-1 space-y-4 w-full">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                          Unggah File Logo Baru (PNG, JPG, SVG, WebP)
                        </label>
                        <div className="flex items-center gap-3">
                          <label className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center gap-2 shadow-md shadow-cyan-500/10">
                            <span>📁</span> Pilih File Gambar
                            <input
                              type="file"
                              accept="image/*"
                              disabled={logoUploading}
                              onChange={handleLogoFileUpload}
                              className="hidden"
                            />
                          </label>
                          <span className="text-xs text-slate-400">
                            Atau masukkan URL / path logo di bawah
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                          URL / Path Logo
                        </label>
                        <input
                          type="text"
                          value={profile.logo_url || ''}
                          onChange={(e) => setProfile({ ...profile, logo_url: e.target.value })}
                          placeholder="/Final-Logo.png atau https://..."
                          className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      {/* Preset Logos */}
                      <div>
                        <span className="text-[11px] text-slate-400 block mb-1.5">Pilihan Cepat Logo Proyek:</span>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { label: 'Final Logo', url: '/Final-Logo.png' },
                            { label: 'Logo 1', url: '/Logo.png' },
                            { label: 'Logo 2', url: '/logo 2.png' },
                            { label: 'Favicon SVG', url: '/favicon.svg' },
                          ].map((p, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setProfile({ ...profile, logo_url: p.url })}
                              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                                profile.logo_url === p.url
                                  ? 'bg-cyan-500 text-slate-950 font-bold'
                                  : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'
                              }`}
                            >
                              {p.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2">
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                          Nama Brand / Studio
                        </label>
                        <input
                          type="text"
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 2: TEKS UTAMA HERO & BADGE */}
                <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 space-y-5">
                  <h3 className="text-base font-bold text-teal-400 flex items-center gap-2">
                    <span>📢</span> Teks Headline & Badge Hero
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Teks Badge Atas
                    </label>
                    <input
                      type="text"
                      value={profile.badge}
                      onChange={(e) => setProfile({ ...profile, badge: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Judul Utama Headline (H1)
                    </label>
                    <input
                      type="text"
                      value={profile.title}
                      onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm font-bold focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Deskripsi Subtitle
                    </label>
                    <textarea
                      rows={3}
                      value={profile.subtitle}
                      onChange={(e) => setProfile({ ...profile, subtitle: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                {/* SECTION 3: TOMBOL CTA (CALL TO ACTION) */}
                <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 space-y-5">
                  <h3 className="text-base font-bold text-indigo-400 flex items-center gap-2">
                    <span>🔘</span> Tombol Call-To-Action (CTA)
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Primary Button */}
                    <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 space-y-3">
                      <span className="text-xs font-bold text-cyan-400 block">Tombol Utama (Gradien)</span>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Teks Tombol</label>
                        <input
                          type="text"
                          value={profile.cta_primary_text || ''}
                          onChange={(e) => setProfile({ ...profile, cta_primary_text: e.target.value })}
                          placeholder="Konsultasi Gratis Sekarang"
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Target Link / Anchor</label>
                        <input
                          type="text"
                          value={profile.cta_primary_link || ''}
                          onChange={(e) => setProfile({ ...profile, cta_primary_link: e.target.value })}
                          placeholder="#contact"
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs font-mono"
                        />
                      </div>
                    </div>

                    {/* Secondary Button */}
                    <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 space-y-3">
                      <span className="text-xs font-bold text-slate-300 block">Tombol Kedua (Border)</span>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Teks Tombol</label>
                        <input
                          type="text"
                          value={profile.cta_secondary_text || ''}
                          onChange={(e) => setProfile({ ...profile, cta_secondary_text: e.target.value })}
                          placeholder="Lihat Proyek Kami"
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Target Link / Anchor</label>
                        <input
                          type="text"
                          value={profile.cta_secondary_link || ''}
                          onChange={(e) => setProfile({ ...profile, cta_secondary_link: e.target.value })}
                          placeholder="#projects"
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 4: PARTNER & TECH STACK */}
                <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 space-y-5">
                  <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
                    <span>🛠️</span> Bagian "Dipercaya Oleh" & "Teknologi"
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Judul Bagian Partner / Dipercaya Oleh
                    </label>
                    <input
                      type="text"
                      value={profile.trusted_by_title || ''}
                      onChange={(e) => setProfile({ ...profile, trusted_by_title: e.target.value })}
                      placeholder="Dipercaya oleh Startup & UMKM Mapan"
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Judul Bagian Teknologi
                    </label>
                    <input
                      type="text"
                      value={profile.tech_stack_title || ''}
                      onChange={(e) => setProfile({ ...profile, tech_stack_title: e.target.value })}
                      placeholder="Teknologi yang Kami Gunakan"
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Daftar Teknologi yang Ditampilkan (Pisahkan dengan koma)
                    </label>
                    <textarea
                      rows={2}
                      value={profile.tech_stack || ''}
                      onChange={(e) => setProfile({ ...profile, tech_stack: e.target.value })}
                      placeholder="React, Next.js, TypeScript, JavaScript, Flutter, Node.js, Express, MySQL, PHP, Laravel, Tailwind, Figma"
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                    />
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Tersedia icon otomatis untuk: React, Next.js, TypeScript, JavaScript, Flutter, Node.js, Express, MySQL, PHP, Laravel, Tailwind, Figma, Python, Go, Docker, PostgreSQL, MongoDB, Vue.
                    </span>
                  </div>
                </div>

                {/* SECTION 5: KONTAK & MEDIA SOSIAL */}
                <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 space-y-5">
                  <h3 className="text-base font-bold text-rose-400 flex items-center gap-2">
                    <span>📱</span> Kontak & Media Sosial
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                        Nomor WhatsApp Kontak
                      </label>
                      <input
                        type="text"
                        value={profile.whatsapp || ''}
                        onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
                        placeholder="Contoh: 081234567890"
                        className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                        Email Kontak
                      </label>
                      <input
                        type="email"
                        value={profile.email || ''}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                </div>

                {/* SUBMIT BUTTON */}
                <div className="sticky bottom-6 z-20 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 shadow-2xl flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Perubahan langsung disimpan ke database SQLite (<code className="text-cyan-400">portfolio.db</code>).
                  </span>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold rounded-xl hover:opacity-95 transition-all shadow-lg shadow-cyan-500/20 text-sm active:scale-95"
                  >
                    💾 Simpan Semua Perubahan
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: PROJECTS */}
          {activeTab === 'projects' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white">Kelola Proyek Portofolio</h2>
                  <p className="text-slate-400 text-sm mt-1">
                    Tambah, perbarui, atau hapus proyek karya yang ditampilkan kepada publik.
                  </p>
                </div>
                <button
                  onClick={openAddProject}
                  className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-1.5"
                >
                  <span>+</span> Tambah Proyek
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((p) => (
                  <div
                    key={p.id}
                    className="bg-slate-800/80 border border-slate-700/60 rounded-2xl overflow-hidden flex flex-col justify-between"
                  >
                    <div className="h-44 overflow-hidden relative bg-slate-950">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-1 bg-slate-900/80 backdrop-blur text-cyan-400 text-xs font-bold rounded-lg border border-slate-700">
                        {p.category}
                      </span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-lg text-white mb-2">{p.title}</h4>
                        <p className="text-xs text-slate-400 mb-4 line-clamp-2">{p.description}</p>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {p.tech &&
                            p.tech.map((t, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 bg-slate-900 text-slate-300 text-[11px] rounded-md font-mono"
                              >
                                {t}
                              </span>
                            ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-700/60 text-xs">
                        {p.link ? (
                          <a
                            href={p.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-cyan-400 hover:underline"
                          >
                            Link Proyek ↗
                          </a>
                        ) : (
                          <span className="text-slate-500">Tanpa link</span>
                        )}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditProject(p)}
                            className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-all"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProject(p.id)}
                            className="px-3 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-all"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SERVICES */}
          {activeTab === 'services' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white">Kelola Layanan</h2>
                  <p className="text-slate-400 text-sm mt-1">
                    Atur layanan dan fitur yang kamu tawarkan kepada klien.
                  </p>
                </div>
                <button
                  onClick={openAddService}
                  className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-1.5"
                >
                  <span>+</span> Tambah Layanan
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((s) => (
                  <div
                    key={s.id}
                    className="bg-slate-800/80 border border-slate-700/60 p-6 rounded-2xl flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-4xl mb-3">{s.icon}</div>
                      <h4 className="font-bold text-lg text-white mb-2">{s.title}</h4>
                      <p className="text-xs text-slate-400 mb-4">{s.description}</p>
                      <ul className="space-y-1.5 mb-6 text-xs text-slate-300">
                        {s.features &&
                          s.features.map((f, idx) => (
                            <li key={idx} className="flex items-center gap-1.5">
                              <span className="text-cyan-400">✓</span> {f}
                            </li>
                          ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-700/60 text-xs">
                      <button
                        onClick={() => openEditService(s)}
                        className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteService(s.id)}
                        className="px-3 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-all"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: TEAM */}
          {activeTab === 'team' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white">Kelola Anggota Tim</h2>
                  <p className="text-slate-400 text-sm mt-1">Tambah, perbarui, atau hapus anggota tim yang ditampilkan.</p>
                </div>
                <button onClick={openAddTeam} className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-1.5">
                  <span>+</span> Tambah Anggota
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {teamMembers.map((t) => (
                  <div key={t.id} className="bg-slate-800/80 border border-slate-700/60 p-6 rounded-2xl flex flex-col items-center text-center gap-3">
                    <img src={t.image || '/founder.jpeg'} alt={t.name} className="w-20 h-20 rounded-full object-cover border-4 border-slate-700" />
                    <div>
                      <h4 className="font-bold text-white text-base">{t.name}</h4>
                      <p className="text-cyan-400 text-xs font-semibold mt-0.5">{t.role}</p>
                      <p className="text-slate-400 text-xs mt-2 line-clamp-2">{t.bio}</p>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => openEditTeam(t)} className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs rounded-lg transition-all">Edit</button>
                      <button onClick={() => handleDeleteTeam(t.id)} className="px-3 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs rounded-lg transition-all">Hapus</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: TESTIMONIALS */}
          {activeTab === 'testimonials' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white">Kelola Testimoni</h2>
                  <p className="text-slate-400 text-sm mt-1">Kelola ulasan dan testimoni dari klien yang ditampilkan.</p>
                </div>
                <button onClick={openAddTesti} className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-1.5">
                  <span>+</span> Tambah Testimoni
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testimonials.map((t) => (
                  <div key={t.id} className="bg-slate-800/80 border border-slate-700/60 p-6 rounded-2xl">
                    <div className="text-yellow-400 text-lg mb-3">{'⭐'.repeat(Math.min(t.rating, 5))}</div>
                    <p className="text-slate-300 text-sm italic mb-4 line-clamp-3">"{t.content}"</p>
                    <div className="flex items-center gap-3 mb-4">
                      <img src={t.photo} alt={t.name} className="w-10 h-10 rounded-full object-cover border-2 border-cyan-800" />
                      <div>
                        <p className="text-white font-bold text-sm">{t.name}</p>
                        <p className="text-slate-400 text-xs">{t.role}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 border-t border-slate-700/50 pt-4">
                      <button onClick={() => openEditTesti(t)} className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs rounded-lg transition-all">Edit</button>
                      <button onClick={() => handleDeleteTesti(t.id)} className="px-3 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs rounded-lg transition-all">Hapus</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: PRICING */}
          {activeTab === 'pricing' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white">Kelola Paket Harga</h2>
                  <p className="text-slate-400 text-sm mt-1">Atur paket harga layanan yang ditawarkan kepada calon klien.</p>
                </div>
                <button onClick={openAddPricing} className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-1.5">
                  <span>+</span> Tambah Paket
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {pricingPackages.map((pkg) => (
                  <div key={pkg.id} className={`p-6 rounded-2xl border-2 flex flex-col justify-between ${
                    pkg.popular ? 'border-cyan-500 bg-cyan-900/20' : 'border-slate-700 bg-slate-800/80'
                  }`}>
                    <div>
                      {pkg.popular && <span className="inline-block bg-cyan-500 text-slate-950 px-3 py-0.5 rounded-full text-xs font-bold mb-3">Populer</span>}
                      <h4 className="font-bold text-white text-lg mb-1">{pkg.name}</h4>
                      <p className="text-cyan-400 text-2xl font-black mb-4">{pkg.price}</p>
                      <ul className="space-y-1.5 mb-4">
                        {pkg.features?.map((f, i) => (
                          <li key={i} className="flex items-center gap-1.5 text-xs text-slate-300">
                            <span className="text-cyan-400">✓</span> {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex gap-2 pt-4 border-t border-slate-700/50">
                      <button onClick={() => openEditPricing(pkg)} className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs rounded-lg transition-all">Edit</button>
                      <button onClick={() => handleDeletePricing(pkg.id)} className="px-3 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs rounded-lg transition-all">Hapus</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: HERO CARDS */}
          {activeTab === 'hero-cards' && (
            <HeroCardsPage />
          )}

          {/* TAB 10: LIVE PREVIEW */}
          {activeTab === 'preview' && (
            <div className="flex flex-col h-full">
              {/* Header & Controls Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-white">Live Preview Website</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Real-time
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mt-1">
                    Lihat tampilan aktual website langsung dari database dalam mode Desktop atau Mobile.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Device Switcher */}
                  <div className="bg-slate-800/90 border border-slate-700/80 p-1 rounded-2xl flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setPreviewDevice('desktop')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                        previewDevice === 'desktop'
                          ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                          : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                      }`}
                    >
                      <span>💻</span>
                      <span>Desktop</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewDevice('mobile')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                        previewDevice === 'mobile'
                          ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                          : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                      }`}
                    >
                      <span>📱</span>
                      <span>Mobile</span>
                    </button>
                  </div>

                  {/* Reload / Refresh Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewKey((k) => k + 1);
                      showNotice('Preview berhasil dimuat ulang!');
                    }}
                    title="Segarkan preview"
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-xl transition-all text-xs flex items-center gap-1.5"
                  >
                    <span>🔄</span>
                    <span className="hidden sm:inline">Segarkan</span>
                  </button>

                  {/* Open in new tab */}
                  <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-xl transition-all text-xs font-semibold flex items-center gap-1.5"
                  >
                    <span>↗</span>
                    <span className="hidden sm:inline">Tab Baru</span>
                  </a>
                </div>
              </div>

              {/* Preview Window Canvas */}
              <div className="flex-1 flex justify-center items-start overflow-hidden">
                {previewDevice === 'desktop' ? (
                  /* DESKTOP BROWSER MOCKUP */
                  <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                    {/* Browser Chrome Header */}
                    <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                      </div>

                      {/* Mockup URL Bar */}
                      <div className="bg-slate-950/80 border border-slate-800 rounded-lg px-4 py-1 text-xs text-slate-400 flex items-center gap-2 max-w-md w-full justify-center">
                        <span className="text-emerald-400 text-xs">🔒</span>
                        <span className="text-slate-300 font-mono text-[11px]">http://localhost:5173/</span>
                      </div>

                      <div className="text-[11px] text-slate-500 font-mono">Desktop View</div>
                    </div>

                    {/* Desktop Iframe */}
                    <div className="w-full h-[720px] bg-white dark:bg-slate-950">
                      <iframe
                        key={`desktop-${previewKey}`}
                        src="/"
                        title="Desktop Live Preview"
                        className="w-full h-full border-0"
                      />
                    </div>
                  </div>
                ) : (
                  /* MOBILE PHONE MOCKUP */
                  <div className="py-2 flex flex-col items-center">
                    <div className="relative w-[380px] h-[750px] bg-slate-950 rounded-[48px] border-[10px] border-slate-800 shadow-2xl shadow-cyan-500/10 overflow-hidden flex flex-col ring-1 ring-slate-700/50">
                      {/* Dynamic Island / Notch */}
                      <div className="bg-slate-900 pt-3 pb-2 px-6 flex items-center justify-between z-10 border-b border-slate-800/40">
                        <span className="text-xs font-semibold text-slate-400 font-mono">09:41</span>
                        <div className="w-20 h-4 bg-slate-950 rounded-full border border-slate-800 flex items-center justify-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-slate-900"></div>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <span>5G</span>
                          <span>100%</span>
                        </div>
                      </div>

                      {/* Mobile Iframe */}
                      <div className="flex-1 w-full bg-white dark:bg-slate-950 overflow-hidden">
                        <iframe
                          key={`mobile-${previewKey}`}
                          src="/"
                          title="Mobile Live Preview"
                          className="w-full h-full border-0"
                        />
                      </div>

                      {/* Home Indicator */}
                      <div className="bg-slate-900 py-1.5 flex justify-center z-10">
                        <div className="w-28 h-1 bg-slate-600 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: PROYEK */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="font-bold text-lg text-white mb-4">
              {editingProject ? 'Edit Proyek' : 'Tambah Proyek Baru'}
            </h3>
            <form onSubmit={handleSaveProject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Judul Proyek
                </label>
                <input
                  type="text"
                  required
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Kategori
                </label>
                <input
                  type="text"
                  required
                  value={projectForm.category}
                  onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                  placeholder="Contoh: Full-Stack Web, Mobile App"
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Deskripsi Singkat
                </label>
                <textarea
                  rows={3}
                  required
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Tech Stack (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={projectForm.techInput}
                  onChange={(e) => setProjectForm({ ...projectForm, techInput: e.target.value })}
                  placeholder="React, Next.js, TypeScript, Tailwind"
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  URL Gambar (Thumbnail)
                </label>
                <input
                  type="url"
                  value={projectForm.image}
                  onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Link Proyek / GitHub
                </label>
                <input
                  type="url"
                  value={projectForm.link}
                  onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })}
                  placeholder="https://github.com/..."
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/20"
                >
                  Simpan Proyek
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LAYANAN */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="font-bold text-lg text-white mb-4">
              {editingService ? 'Edit Layanan' : 'Tambah Layanan Baru'}
            </h3>
            <form onSubmit={handleSaveService} className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Icon Emoji
                  </label>
                  <input
                    type="text"
                    required
                    value={serviceForm.icon}
                    onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-center text-lg"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Nama Layanan
                  </label>
                  <input
                    type="text"
                    required
                    value={serviceForm.title}
                    onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Deskripsi
                </label>
                <textarea
                  rows={2}
                  required
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Daftar Fitur (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={serviceForm.featuresInput}
                  onChange={(e) =>
                    setServiceForm({ ...serviceForm, featuresInput: e.target.value })
                  }
                  placeholder="Responsive Design, Fast Loading, SEO Friendly"
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/20"
                >
                  Simpan Layanan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TIM */}
      {isTeamModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="font-bold text-lg text-white mb-4">{editingTeam ? 'Edit Anggota Tim' : 'Tambah Anggota Tim'}</h3>
            <form onSubmit={handleSaveTeam} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Nama</label>
                <input type="text" required value={teamForm.name} onChange={e => setTeamForm({...teamForm, name: e.target.value})} className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Jabatan / Role</label>
                <input type="text" required value={teamForm.role} onChange={e => setTeamForm({...teamForm, role: e.target.value})} placeholder="Founder & Full Stack Developer" className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Bio Singkat</label>
                <textarea rows={2} value={teamForm.bio} onChange={e => setTeamForm({...teamForm, bio: e.target.value})} className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">URL / Path Foto</label>
                <input type="text" value={teamForm.image} onChange={e => setTeamForm({...teamForm, image: e.target.value})} placeholder="/founder.jpeg atau https://..." className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm font-mono" />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setIsTeamModalOpen(false)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-xl">Batal</button>
                <button type="submit" className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/20">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TESTIMONI */}
      {isTestiModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="font-bold text-lg text-white mb-4">{editingTesti ? 'Edit Testimoni' : 'Tambah Testimoni Baru'}</h3>
            <form onSubmit={handleSaveTesti} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Nama Klien</label>
                  <input type="text" required value={testiForm.name} onChange={e => setTestiForm({...testiForm, name: e.target.value})} className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Jabatan / Role</label>
                  <input type="text" value={testiForm.role} onChange={e => setTestiForm({...testiForm, role: e.target.value})} placeholder="CEO, Owner, dsb." className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Isi Testimoni</label>
                <textarea rows={3} required value={testiForm.content} onChange={e => setTestiForm({...testiForm, content: e.target.value})} className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Rating (1-5)</label>
                  <input type="number" min={1} max={5} value={testiForm.rating} onChange={e => setTestiForm({...testiForm, rating: Number(e.target.value)})} className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">URL Foto Profil</label>
                  <input type="text" value={testiForm.photo} onChange={e => setTestiForm({...testiForm, photo: e.target.value})} placeholder="https://..." className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm font-mono" />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setIsTestiModalOpen(false)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-xl">Batal</button>
                <button type="submit" className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/20">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: HARGA PAKET */}
      {isPricingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="font-bold text-lg text-white mb-4">{editingPricing ? 'Edit Paket Harga' : 'Tambah Paket Harga Baru'}</h3>
            <form onSubmit={handleSavePricing} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Nama Paket</label>
                  <input type="text" required value={pricingForm.name} onChange={e => setPricingForm({...pricingForm, name: e.target.value})} placeholder="Business Website" className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Harga</label>
                  <input type="text" required value={pricingForm.price} onChange={e => setPricingForm({...pricingForm, price: e.target.value})} placeholder="Rp 1,2JT" className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="popularCheck" checked={pricingForm.popular} onChange={e => setPricingForm({...pricingForm, popular: e.target.checked})} className="w-4 h-4 accent-cyan-500" />
                <label htmlFor="popularCheck" className="text-sm text-slate-300 font-semibold cursor-pointer">Tandai sebagai Paket Paling Populer</label>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Fitur-Fitur (Pisahkan dengan koma)</label>
                <textarea rows={3} value={pricingForm.featuresInput} onChange={e => setPricingForm({...pricingForm, featuresInput: e.target.value})} placeholder="Responsive Design, SEO Optimization, Admin Panel" className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm" />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setIsPricingModalOpen(false)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-xl">Batal</button>
                <button type="submit" className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/20">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;

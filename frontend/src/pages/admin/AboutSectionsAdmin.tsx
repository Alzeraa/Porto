import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../../config/api';

interface AboutSection {
  id: number;
  type: string;
  title: string;
  subtitle: string;
  items: any[];
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

type SectionType = 'core_foundations' | 'process_stages' | 'studio_ethics';

const AboutSectionsAdmin = () => {
  const [aboutSections, setAboutSections] = useState<AboutSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingType, setEditingType] = useState<SectionType | null>(null);
  const [formData, setFormData] = useState({ title: '', subtitle: '', items: '', type: '' });
  const [newSectionForm, setNewSectionForm] = useState({ type: 'core_foundations' as SectionType, title: '', subtitle: '', items: '' });
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<SectionType | 'all'>('all');

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_ENDPOINTS.aboutSections);
      const data = await res.json();
      if (data.status === 'success') {
        setAboutSections(data.data);
      }
    } catch (err) {
      console.error('Error fetching about sections:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (section: AboutSection) => {
    setEditingId(section.id);
    setEditingType(section.type as SectionType);
    setFormData({
      title: section.title,
      subtitle: section.subtitle,
      items: JSON.stringify(section.items, null, 2),
      type: section.type
    });
  };

  const handleSave = async () => {
    if (!editingId) return;
    if (!formData.title.trim()) {
      alert('Title wajib diisi!');
      return;
    }

    try {
      const itemsParsed = JSON.parse(formData.items);
      
      const res = await fetch(`${API_ENDPOINTS.aboutSections}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          subtitle: formData.subtitle,
          items: itemsParsed,
          type: formData.type
        })
      });

      if (res.ok) {
        await fetchSections();
        setEditingId(null);
        setEditingType(null);
        setFormData({ title: '', subtitle: '', items: '', type: '' });
        alert('About Section berhasil diperbarui!');
      } else {
        const errorData = await res.json();
        alert('Gagal: ' + (errorData.message || 'Server error'));
      }
    } catch (err) {
      console.error('Error saving about section:', err);
      alert('Gagal menyimpan About Section (cek format JSON items!)');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Yakin hapus About Section ini?')) return;

    try {
      const res = await fetch(`${API_ENDPOINTS.aboutSections}/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        await fetchSections();
        alert('About Section berhasil dihapus.');
      }
    } catch (err) {
      console.error('Error deleting about section:', err);
      alert('Gagal menghapus About Section');
    }
  };

  const handleAddNewSection = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newSectionForm.title.trim()) {
      alert('Title wajib diisi!');
      return;
    }

    setSubmitting(true);
    try {
      const itemsParsed = JSON.parse(newSectionForm.items);
      
      const res = await fetch(API_ENDPOINTS.aboutSections, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newSectionForm.title,
          subtitle: newSectionForm.subtitle,
          items: itemsParsed,
          type: newSectionForm.type,
          order_index: 0
        })
      });

      if (res.ok) {
        await fetchSections();
        setNewSectionForm({ type: 'core_foundations', title: '', subtitle: '', items: '' });
        alert('About Section baru berhasil ditambahkan!');
      } else {
        const errorData = await res.json();
        alert('Gagal: ' + (errorData.message || 'Server error'));
      }
    } catch (err) {
      console.error('Error adding about section:', err);
      alert('Gagal menambahkan About Section (cek format JSON items!)');
    } finally {
      setSubmitting(false);
    }
  };

  const getSectionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'core_foundations': 'Core Foundations',
      'process_stages': 'Process Stages',
      'studio_ethics': 'Studio Ethics'
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-cyan-400 animate-pulse">Memuat About Sections...</div>
      </div>
    );
  }

  const filteredSections = activeTab === 'all' 
    ? aboutSections 
    : aboutSections.filter(s => s.type === activeTab);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">📝 About Sections Management</h2>
          <p className="text-slate-400 text-sm mt-1">
            Kelola konten halaman About (Core Foundations, Process Stages, Studio Ethics).
          </p>
        </div>
        <button
          onClick={fetchSections}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 rounded-lg transition-all"
        >
          ↻ Segarkan
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'all'
              ? 'bg-cyan-600 text-white'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Semua
        </button>
        <button
          onClick={() => setActiveTab('core_foundations')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'core_foundations'
              ? 'bg-cyan-600 text-white'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Core Foundations
        </button>
        <button
          onClick={() => setActiveTab('process_stages')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'process_stages'
              ? 'bg-cyan-600 text-white'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Process Stages
        </button>
        <button
          onClick={() => setActiveTab('studio_ethics')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'studio_ethics'
              ? 'bg-cyan-600 text-white'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Studio Ethics
        </button>
      </div>

      {/* Section List */}
      <div className="space-y-4">
        {filteredSections.length === 0 ? (
          <div className="text-center py-12 bg-slate-800/40 rounded-2xl border border-slate-700/50">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-lg font-bold text-slate-200 mb-2">Belum ada About Sections</h3>
            <p className="text-slate-400 text-sm mb-4">Klik "Tambah Section Baru" untuk menambahkan konten.</p>
          </div>
        ) : (
          filteredSections.map((section) => (
            <div
              key={section.id}
              className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-cyan-500/50 transition-all shadow-lg"
            >
              {editingId === section.id ? (
                <div className="p-5 space-y-4">
                  <div className="flex gap-3 mb-4">
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Tipe</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as SectionType })}
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                      >
                        <option value="core_foundations">Core Foundations</option>
                        <option value="process_stages">Process Stages</option>
                        <option value="studio_ethics">Studio Ethics</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Judul</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                      placeholder="Judul section..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                      placeholder="Subtitle section..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                      Items (JSON array, satu objek per baris)
                    </label>
                    <textarea
                      rows={8}
                      value={formData.items}
                      onChange={(e) => setFormData({ ...formData, items: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-400 resize-none"
                      placeholder='[{"num": "01", "title": "Title", "desc": "Description", "bullets": ["bullet1", "bullet2"]}]'
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      Format: Array of objects. Contoh untuk Core Foundations: [{"{"}"num":"01","title":"Title","desc":"Desc","bullets":["b1","b2"]{"}"}]
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleSave}
                      className="flex-1 px-4 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      ✓ Simpan
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditingType(null);
                        setFormData({ title: '', subtitle: '', items: '', type: '' });
                      }}
                      className="flex-1 px-4 py-3 bg-slate-600 hover:bg-slate-500 text-white font-bold rounded-xl transition-all"
                    >
                      ✕ Batal
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          section.type === 'core_foundations' ? 'bg-blue-500/20 text-blue-400' :
                          section.type === 'process_stages' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {getSectionTypeLabel(section.type)}
                        </span>
                        <span className="text-xs text-slate-500">Order: {section.order_index}</span>
                      </div>
                      <h3 className="font-bold text-white text-lg mb-2">{section.title}</h3>
                      {section.subtitle && (
                        <p className="text-slate-400 text-sm mb-4">{section.subtitle}</p>
                      )}
                      <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-800">
                        <p className="text-xs text-slate-400 font-mono break-all">
                          {JSON.stringify(section.items, null, 2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 mt-4 text-xs text-slate-500">
                        <span>ID: {section.id}</span>
                        {section.created_at && (
                          <>
                            <span>•</span>
                            <span>Dibuat: {new Date(section.created_at).toLocaleDateString('id-ID')}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleEdit(section)}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all"
                      >
                        ✎ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(section.id)}
                        className="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg transition-all"
                      >
                        🗑 Hapus
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add New Section Form */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 mt-8">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span>➕</span> Tambah About Section Baru
        </h3>
        <form onSubmit={handleAddNewSection} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Tipe Section</label>
              <select
                value={newSectionForm.type}
                onChange={(e) => setNewSectionForm({ ...newSectionForm, type: e.target.value as SectionType })}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
              >
                <option value="core_foundations">Core Foundations</option>
                <option value="process_stages">Process Stages</option>
                <option value="studio_ethics">Studio Ethics</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Judul</label>
            <input
              type="text"
              value={newSectionForm.title}
              onChange={(e) => setNewSectionForm({ ...newSectionForm, title: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
              placeholder="Contoh: Core Foundations"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Subtitle (opsional)</label>
            <input
              type="text"
              value={newSectionForm.subtitle}
              onChange={(e) => setNewSectionForm({ ...newSectionForm, subtitle: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
              placeholder="Subtitle section..."
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">
              Items (JSON array)
            </label>
            <textarea
              rows={8}
              value={newSectionForm.items}
              onChange={(e) => setNewSectionForm({ ...newSectionForm, items: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-400 resize-none"
              placeholder={
                newSectionForm.type === 'core_foundations'
                  ? '[\n  {\n    "num": "01",\n    "title": "Understand Before Building",\n    "desc": "Start by understanding the business...",\n    "bullets": ["Root workflow analysis"]\n  }\n]'
                  : newSectionForm.type === 'process_stages'
                  ? '[\n  {\n    "stage": "STAGE 01",\n    "title": "Listen & Understand",\n    "desc": "Discuss operational goals...",\n    "icon": "..." \n  }\n]'
                  : '[\n  {\n    "title": "Clear Communication",\n    "desc": "We discuss technical trade-offs...",\n    "icon": "..." \n  }\n]'
              }
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Format: Array of objects. Setiap objek harus valid JSON.
            </p>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full px-6 py-3.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Menambahkan...
              </>
            ) : (
              <>
                <span>➕</span> Tambah Section Baru
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AboutSectionsAdmin;
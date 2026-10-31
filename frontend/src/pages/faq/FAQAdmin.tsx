import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../../config/api';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

const FAQAdmin = () => {
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ question: '', answer: '' });
  const [newFaqForm, setNewFaqForm] = useState({ question: '', answer: '', order_index: 0 });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchFaq();
  }, []);

  const fetchFaq = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_ENDPOINTS.faq);
      const data = await res.json();
      if (data.status === 'success') {
        setFaqItems(data.data);
      }
    } catch (err) {
      console.error('Error fetching FAQ:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: FAQItem) => {
    setEditingId(item.id);
    setFormData({ question: item.question, answer: item.answer });
  };

  const handleSave = async () => {
    if (!editingId) return;
    if (!formData.question.trim() || !formData.answer.trim()) {
      alert('Pertanyaan dan jawaban wajib diisi!');
      return;
    }

    try {
      const res = await fetch(`${API_ENDPOINTS.faq}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        await fetchFaq();
        setEditingId(null);
        setFormData({ question: '', answer: '' });
        alert('FAQ berhasil diperbarui!');
      } else {
        const errorData = await res.json();
        alert('Gagal: ' + (errorData.message || 'Server error'));
      }
    } catch (err) {
      console.error('Error saving FAQ:', err);
      alert('Gagal menyimpan FAQ');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Yakin hapus FAQ ini?')) return;

    try {
      const res = await fetch(`${API_ENDPOINTS.faq}/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        await fetchFaq();
        alert('FAQ berhasil dihapus.');
      }
    } catch (err) {
      console.error('Error deleting FAQ:', err);
      alert('Gagal menghapus FAQ');
    }
  };

  const handleAddNewFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newFaqForm.question.trim() || !newFaqForm.answer.trim()) {
      alert('Pertanyaan dan jawaban wajib diisi!');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(API_ENDPOINTS.faq, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: newFaqForm.question,
          answer: newFaqForm.answer,
          order_index: newFaqForm.order_index || 0
        })
      });

      if (res.ok) {
        await fetchFaq();
        setNewFaqForm({ question: '', answer: '', order_index: 0 });
        alert('FAQ baru berhasil ditambahkan!');
      } else {
        const errorData = await res.json();
        alert('Gagal: ' + (errorData.message || 'Server error'));
      }
    } catch (err) {
      console.error('Error adding FAQ:', err);
      alert('Gagal menambahkan FAQ');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-cyan-400 animate-pulse">Memuat FAQ...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">❓ FAQ (Pertanyaan Sering Ditanya)</h2>
          <p className="text-slate-400 text-sm mt-1">
            Kelola FAQ yang ditampilkan di halaman FAQ website.
          </p>
        </div>
        <button
          onClick={fetchFaq}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 rounded-lg transition-all"
        >
          ↻ Segarkan
        </button>
      </div>

      {/* FAQ List */}
      <div className="grid grid-cols-1 gap-4">
        {faqItems.length === 0 ? (
          <div className="text-center py-12 bg-slate-800/40 rounded-2xl border border-slate-700/50">
            <div className="text-5xl mb-4">❓</div>
            <h3 className="text-lg font-bold text-slate-200 mb-2">Belum ada FAQ</h3>
            <p className="text-slate-400 text-sm mb-4">Klik "Tambah FAQ Baru" untuk menambahkan pertanyaan.</p>
          </div>
        ) : (
          faqItems.map((item) => (
            <div
              key={item.id}
              className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-cyan-500/50 transition-all shadow-lg"
            >
              {editingId === item.id ? (
                <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Pertanyaan</label>
                    <textarea
                      rows={2}
                      value={formData.question}
                      onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 resize-none"
                      placeholder="Masukkan pertanyaan..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Jawaban</label>
                    <textarea
                      rows={4}
                      value={formData.answer}
                      onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 resize-none"
                      placeholder="Masukkan jawaban lengkap..."
                    />
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
                        setFormData({ question: '', answer: '' });
                      }}
                      className="flex-1 px-4 py-3 bg-slate-600 hover:bg-slate-500 text-white font-bold rounded-xl transition-all"
                    >
                      ✕ Batal
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-base mb-2">{item.question}</h3>
                      <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{item.answer}</p>
                      <div className="flex items-center gap-3 mt-4 text-xs text-slate-500">
                        <span>ID: {item.id}</span>
                        <span>•</span>
                        <span>Order: {item.order_index}</span>
                        {item.created_at && (
                          <>
                            <span>•</span>
                            <span>Dibuat: {new Date(item.created_at).toLocaleDateString('id-ID')}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all"
                      >
                        ✎ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
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

      {/* Add New FAQ Form */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 mt-8">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span>➕</span> Tambah FAQ Baru
        </h3>
        <form onSubmit={handleAddNewFaq} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Urutan Tampilan</label>
              <input
                type="number"
                min="0"
                value={newFaqForm.order_index}
                onChange={(e) => setNewFaqForm({ ...newFaqForm, order_index: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                placeholder="0"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Pertanyaan</label>
            <textarea
              rows={2}
              value={newFaqForm.question}
              onChange={(e) => setNewFaqForm({ ...newFaqForm, question: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 resize-none"
              placeholder="Contoh: Berapa lama waktu pengerjaan project?"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Jawaban</label>
            <textarea
              rows={5}
              value={newFaqForm.answer}
              onChange={(e) => setNewFaqForm({ ...newFaqForm, answer: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 resize-none"
              placeholder="Masukkan jawaban lengkap dengan detail..."
            />
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
                <span>➕</span> Tambah FAQ Baru
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FAQAdmin;

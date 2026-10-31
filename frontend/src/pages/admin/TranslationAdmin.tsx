import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../../config/api';

interface TranslationItem {
  id: number;
  key: string;
  english: string;
  indonesian: string;
  section: string;
  created_at?: string;
  updated_at?: string;
}

const TranslationAdmin = () => {
  const [translations, setTranslations] = useState<TranslationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ key: '', english: '', indonesian: '', section: '' });
  const [newTranslationForm, setNewTranslationForm] = useState({ key: '', english: '', indonesian: '', section: '' });
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchTranslations();
  }, []);

  const fetchTranslations = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_ENDPOINTS.translations || '/api/translations');
      const data = await res.json();
      if (data.status === 'success') {
        setTranslations(data.data);
      }
    } catch (err) {
      console.error('Error fetching translations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: TranslationItem) => {
    setEditingId(item.id);
    setFormData({ key: item.key, english: item.english, indonesian: item.indonesian, section: item.section });
  };

  const handleSave = async () => {
    if (!editingId) return;
    if (!formData.key.trim() || !formData.english.trim() || !formData.indonesian.trim()) {
      alert('Semua field wajib diisi!');
      return;
    }

    try {
      const res = await fetch(`${API_ENDPOINTS.translations || '/api/translations'}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        await fetchTranslations();
        setEditingId(null);
        setFormData({ key: '', english: '', indonesian: '', section: '' });
        alert('Terjemahan berhasil diperbarui!');
      } else {
        const errorData = await res.json();
        alert('Gagal: ' + (errorData.message || 'Server error'));
      }
    } catch (err) {
      console.error('Error saving translation:', err);
      alert('Gagal menyimpan terjemahan');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Yakin hapus terjemahan ini?')) return;

    try {
      const res = await fetch(`${API_ENDPOINTS.translations || '/api/translations'}/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        await fetchTranslations();
        alert('Terjemahan berhasil dihapus.');
      }
    } catch (err) {
      console.error('Error deleting translation:', err);
      alert('Gagal menghapus terjemahan');
    }
  };

  const handleAddNewTranslation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTranslationForm.key.trim() || !newTranslationForm.english.trim() || !newTranslationForm.indonesian.trim()) {
      alert('Semua field wajib diisi!');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(API_ENDPOINTS.translations || '/api/translations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTranslationForm)
      });

      if (res.ok) {
        await fetchTranslations();
        setNewTranslationForm({ key: '', english: '', indonesian: '', section: '' });
        alert('Terjemahan baru berhasil ditambahkan!');
      } else {
        const errorData = await res.json();
        alert('Gagal: ' + (errorData.message || 'Server error'));
      }
    } catch (err) {
      console.error('Error adding translation:', err);
      alert('Gagal menambah terjemahan');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTranslations = translations.filter(t => 
    t.key.toLowerCase().includes(filter.toLowerCase()) ||
    t.english.toLowerCase().includes(filter.toLowerCase()) ||
    t.indonesian.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-6">Manajemen Terjemahan</h2>
        
        {/* Add New Translation */}
        <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Tambah Terjemahan Baru</h3>
          <form onSubmit={handleAddNewTranslation} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Key (identifier)"
                value={newTranslationForm.key}
                onChange={(e) => setNewTranslationForm({ ...newTranslationForm, key: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Section/Category"
                value={newTranslationForm.section}
                onChange={(e) => setNewTranslationForm({ ...newTranslationForm, section: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <textarea
              placeholder="English text"
              value={newTranslationForm.english}
              onChange={(e) => setNewTranslationForm({ ...newTranslationForm, english: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 h-20"
            />
            <textarea
              placeholder="Indonesian text"
              value={newTranslationForm.indonesian}
              onChange={(e) => setNewTranslationForm({ ...newTranslationForm, indonesian: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 h-20"
            />
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Menambah...' : 'Tambah Terjemahan'}
            </button>
          </form>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Cari terjemahan..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg mb-6 focus:outline-none focus:border-blue-500"
        />

        {/* Translations List */}
        <div className="space-y-4">
          {filteredTranslations.length === 0 ? (
            <div className="text-center text-gray-500 py-8">Tidak ada terjemahan</div>
          ) : (
            filteredTranslations.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4">
                {editingId === item.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={formData.key}
                      onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                      placeholder="Key"
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                    />
                    <input
                      type="text"
                      value={formData.section}
                      onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                      placeholder="Section"
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                    />
                    <textarea
                      value={formData.english}
                      onChange={(e) => setFormData({ ...formData, english: e.target.value })}
                      placeholder="English"
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500 h-20"
                    />
                    <textarea
                      value={formData.indonesian}
                      onChange={(e) => setFormData({ ...formData, indonesian: e.target.value })}
                      placeholder="Indonesian"
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500 h-20"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Simpan
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold">{item.key}</p>
                        <p className="text-xs text-gray-500">{item.section}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                    <p className="text-sm mb-2"><span className="font-semibold">EN:</span> {item.english}</p>
                    <p className="text-sm"><span className="font-semibold">ID:</span> {item.indonesian}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TranslationAdmin;

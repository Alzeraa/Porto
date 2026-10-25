import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../../config/api';

interface HeroCard {
  id: number;
  title: string;
  image: string;
  description?: string;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

const HeroCardsPage = () => {
  const [cards, setCards] = useState<HeroCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: '', image: '', description: '' });
  const [newCardForm, setNewCardForm] = useState({ title: '', image: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_ENDPOINTS.theme.split('/theme')[0]}/hero-cards`);
      const data = await res.json();
      if (data.status === 'success') {
        setCards(data.data);
      }
    } catch (err) {
      console.error('Error fetching hero cards:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (card: HeroCard) => {
    setEditingId(card.id);
    setFormData({ title: card.title, image: card.image, description: card.description || '' });
  };

  const handleSave = async () => {
    if (!editingId) return;

    try {
      const res = await fetch(`${API_ENDPOINTS.theme.split('/theme')[0]}/hero-cards/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      if (res.ok) {
        await fetchCards();
        setEditingId(null);
        setFormData({ title: '', image: '', description: '' });
      }
    } catch (err) {
      console.error('Error saving card:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Yakin hapus kartu ini?')) return;

    try {
      const res = await fetch(`${API_ENDPOINTS.theme.split('/theme')[0]}/hero-cards/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (res.ok) {
        await fetchCards();
      }
    } catch (err) {
      console.error('Error deleting card:', err);
    }
  };

  const handleAddNewCard = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCardForm.title || !newCardForm.image) {
      alert('Title dan Image harus diisi!');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_ENDPOINTS.theme.split('/theme')[0]}/hero-cards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newCardForm.title,
          image: newCardForm.image,
          description: newCardForm.description
        }),
        credentials: 'include'
      });

      if (res.ok) {
        await fetchCards();
        setNewCardForm({ title: '', image: '', description: '' });
        alert('Kartu berhasil ditambahkan!');
      } else {
        const errorData = await res.json();
        alert('Gagal: ' + (errorData.message || 'Server error'));
      }
    } catch (err) {
      console.error('Error adding card:', err);
      alert('Gagal menambahkan kartu');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">🎨 Hero Cards Management</h1>

      {/* Card List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {cards.map((card) => (
          <div
            key={card.id}
            className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-cyan-500 transition-all"
          >
            {/* Image Preview */}
            <div className="h-40 bg-slate-900 overflow-hidden">
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Card Info */}
            <div className="p-4">
              {editingId === card.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Image URL (e.g., /hero-cards/filename.jpg)"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 text-sm"
                  />
                  <textarea
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 text-sm"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="flex-1 px-3 py-2 bg-cyan-600 text-white rounded text-sm font-semibold hover:bg-cyan-700"
                    >
                      ✓ Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex-1 px-3 py-2 bg-slate-600 text-white rounded text-sm font-semibold hover:bg-slate-700"
                    >
                      ✕ Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="font-bold text-white mb-1">{card.title}</h3>
                  <p className="text-slate-400 text-xs mb-2">{card.description}</p>
                  <p className="text-slate-500 text-xs mb-3">
                    ID: {card.id} | Order: {card.order_index}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(card)}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm font-semibold hover:bg-blue-700"
                    >
                      ✎ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(card.id)}
                      className="flex-1 px-3 py-2 bg-red-600 text-white rounded text-sm font-semibold hover:bg-red-700"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add New Card */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-lg font-bold text-white mb-4">➕ Add New Card</h2>
        <form onSubmit={handleAddNewCard} className="space-y-3">
          <input
            type="text"
            placeholder="Title (e.g., Web Development)"
            value={newCardForm.title}
            onChange={(e) => setNewCardForm({ ...newCardForm, title: e.target.value })}
            className="w-full px-4 py-2 bg-slate-700 text-white rounded border border-slate-600 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
          <input
            type="text"
            placeholder="Image URL (e.g., /hero-cards/filename.jpg or https://...)"
            value={newCardForm.image}
            onChange={(e) => setNewCardForm({ ...newCardForm, image: e.target.value })}
            className="w-full px-4 py-2 bg-slate-700 text-white rounded border border-slate-600 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
          <textarea
            placeholder="Description (optional)"
            value={newCardForm.description}
            onChange={(e) => setNewCardForm({ ...newCardForm, description: e.target.value })}
            className="w-full px-4 py-2 bg-slate-700 text-white rounded border border-slate-600 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            rows={3}
          />
          <button 
            type="submit"
            disabled={submitting}
            className="w-full px-4 py-2 bg-cyan-600 text-white rounded font-semibold hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {submitting ? '⏳ Menambahkan...' : '➕ Add Card'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default HeroCardsPage;

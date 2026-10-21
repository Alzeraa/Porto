const db = require('../config/database');
const emailService = require('../services/emailService');

// Submit contact form (Public)
exports.submitContact = async (req, res) => {
  try {
    const { name, email, whatsapp, service, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        status: 'error',
        message: 'Nama, email, dan pesan harus diisi!'
      });
    }

    const stmt = db.prepare(`
      INSERT INTO contacts (name, email, whatsapp, service, message)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(name, email, whatsapp || '', service || '', message);
    const newId = result.lastInsertRowid;

    console.log('Contact saved to database:', { id: newId, name, email });

    res.status(201).json({
      status: 'success',
      message: 'Pesan kamu berhasil dikirim! Saya akan segera menghubungi kamu.',
      data: { id: newId, name, email, whatsapp, service }
    });

    // Kirim email notifikasi secara asynchronous (tidak memblokir respon)
    try {
      await emailService.sendContactNotification({ name, email, whatsapp, service, message });
      await emailService.sendThankYouEmail(email, name);
    } catch (emailError) {
      console.error('[EmailService] Error:', emailError.message);
    }
  } catch (error) {
    console.error('Error submitting contact:', error);
    res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server'
    });
  }
};

// Get all contacts (Admin)
exports.getAllContacts = (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all();
    res.json({
      status: 'success',
      data: rows
    });
  } catch (error) {
    console.error('Error getting contacts:', error);
    res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server'
    });
  }
};

// Delete contact (Admin)
exports.deleteContact = (req, res) => {
  try {
    const { id } = req.params;
    const info = db.prepare('DELETE FROM contacts WHERE id = ?').run(id);
    if (info.changes === 0) {
      return res.status(404).json({ status: 'error', message: 'Pesan tidak ditemukan.' });
    }
    res.json({ status: 'success', message: 'Pesan berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal menghapus pesan.' });
  }
};

// Mark as read (Admin)
exports.markAsRead = (req, res) => {
  try {
    const { id } = req.params;
    db.prepare("UPDATE contacts SET status = 'read' WHERE id = ?").run(id);
    res.json({ status: 'success', message: 'Status pesan diubah menjadi dibaca.' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal mengupdate status.' });
  }
};

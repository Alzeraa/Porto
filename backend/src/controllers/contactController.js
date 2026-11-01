const pool = require('../config/database');
const emailService = require('../services/emailService');

exports.submitContact = async (req, res) => {
  try {
    const {
      name, email, whatsapp, service, message,
      businessOrg = '', budgetRange = '', timeline = '', referenceUrl = '',
    } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ status: 'error', message: 'Name, email, and message are required.' });
    }

    const { rows } = await pool.query(
      `INSERT INTO contacts
         (name, email, whatsapp, service, message, business_org, budget_range, timeline, reference_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING id`,
      [name, email, whatsapp || '', service || '', message, businessOrg, budgetRange, timeline, referenceUrl]
    );

    res.status(201).json({
      status: 'success',
      message: "Your inquiry has been received. We'll be in touch within 24 hours.",
      data: { id: rows[0].id, name, email },
    });

    // Fire-and-forget emails
    try {
      await emailService.sendContactNotification({ name, email, whatsapp, service, message, businessOrg, budgetRange, timeline, referenceUrl });
      await emailService.sendThankYouEmail(email, name);
    } catch (emailError) {
      console.error('[EmailService] Error:', emailError.message);
    }
  } catch (error) {
    console.error('Error submitting contact:', error);
    res.status(500).json({ status: 'error', message: 'Server error. Please try again.' });
  }
};

exports.getAllContacts = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM contacts ORDER BY created_at DESC');
    res.json({ status: 'success', data: rows });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server' });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM contacts WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Pesan tidak ditemukan.' });
    }
    res.json({ status: 'success', message: 'Pesan berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal menghapus pesan.' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("UPDATE contacts SET status = 'read' WHERE id = $1", [id]);
    res.json({ status: 'success', message: 'Status pesan diubah menjadi dibaca.' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal mengupdate status.' });
  }
};

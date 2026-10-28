const db = require('../config/database');
const emailService = require('../services/emailService');

// Migrate contacts table: add new columns if they don't exist yet
const migrateContactsTable = async () => {
  const newColumns = [
    { name: 'business_org', def: 'TEXT DEFAULT ""' },
    { name: 'budget_range', def: 'TEXT DEFAULT ""' },
    { name: 'timeline',     def: 'TEXT DEFAULT ""' },
    { name: 'reference_url',def: 'TEXT DEFAULT ""' },
  ];
  for (const col of newColumns) {
    try {
      await db.run(`ALTER TABLE contacts ADD COLUMN ${col.name} ${col.def}`);
    } catch (_) {
      // Column already exists — safe to ignore
    }
  }
};
migrateContactsTable();

exports.submitContact = async (req, res) => {
  try {
    const {
      name, email, whatsapp, service, message,
      // New extended fields
      businessOrg = '', budgetRange = '', timeline = '', referenceUrl = '',
    } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ status: 'error', message: 'Name, email, and message are required.' });
    }

    const result = await db.run(
      `INSERT INTO contacts
         (name, email, whatsapp, service, message, business_org, budget_range, timeline, reference_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, whatsapp || '', service || '', message,
       businessOrg, budgetRange, timeline, referenceUrl]
    );

    res.status(201).json({
      status: 'success',
      message: 'Your inquiry has been received. We\'ll be in touch within 24 hours.',
      data: { id: result.lastInsertRowid, name, email },
    });

    // Fire-and-forget emails
    try {
      await emailService.sendContactNotification({
        name, email, whatsapp, service, message,
        businessOrg, budgetRange, timeline, referenceUrl,
      });
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
    const rows = await db.all('SELECT * FROM contacts ORDER BY created_at DESC');
    res.json({ status: 'success', data: rows });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server' });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.run('DELETE FROM contacts WHERE id = ?', [id]);
    if (result.changes === 0) return res.status(404).json({ status: 'error', message: 'Pesan tidak ditemukan.' });
    res.json({ status: 'success', message: 'Pesan berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal menghapus pesan.' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await db.run("UPDATE contacts SET status = 'read' WHERE id = ?", [id]);
    res.json({ status: 'success', message: 'Status pesan diubah menjadi dibaca.' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal mengupdate status.' });
  }
};

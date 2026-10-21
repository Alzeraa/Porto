const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'erynalva_super_secret_jwt_key_2026';

// Login admin
exports.login = (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email dan password wajib diisi!'
      });
    }

    const admin = db.prepare('SELECT * FROM admins WHERE email = ?').get(email);
    if (!admin) {
      return res.status(401).json({
        status: 'error',
        message: 'Email atau password salah.'
      });
    }

    const isValid = bcrypt.compareSync(password, admin.password);
    if (!isValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Email atau password salah.'
      });
    }

    // Generate JWT token (berlaku 7 hari)
    const token = jwt.sign(
      { id: admin.id, email: admin.email, name: admin.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      status: 'success',
      message: 'Login berhasil!',
      data: {
        token,
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server.' });
  }
};

// Cek status sesi login (Me)
exports.getMe = (req, res) => {
  try {
    const admin = db.prepare('SELECT id, email, name FROM admins WHERE id = ?').get(req.user.id);
    if (!admin) {
      return res.status(404).json({ status: 'error', message: 'Admin tidak ditemukan.' });
    }
    res.json({
      status: 'success',
      data: admin
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal memverifikasi user.' });
  }
};

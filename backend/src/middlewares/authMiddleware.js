const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'erynalva_super_secret_jwt_key_2026';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'error',
      message: 'Akses ditolak: Token autentikasi tidak ditemukan.'
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      status: 'error',
      message: 'Token tidak valid atau sudah kadaluarsa.'
    });
  }
};

module.exports = { authenticateToken };

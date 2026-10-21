const fs = require('fs');
const path = require('path');

exports.uploadImage = (req, res) => {
  try {
    const { imageBase64, filename } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ status: 'error', message: 'Tidak ada data gambar yang dikirim' });
    }

    const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let buffer;
    let ext = '.png';

    if (matches && matches.length === 3) {
      const mime = matches[1];
      if (mime === 'image/jpeg') ext = '.jpg';
      if (mime === 'image/svg+xml') ext = '.svg';
      if (mime === 'image/webp') ext = '.webp';
      buffer = Buffer.from(matches[2], 'base64');
    } else {
      buffer = Buffer.from(imageBase64, 'base64');
    }

    const cleanName = filename ? filename.replace(/[^a-zA-Z0-9_-]/g, '_') : 'image';
    const targetFileName = `${cleanName}_${Date.now()}${ext}`;

    // Simpan ke direktori frontend/public/uploads agar bisa langsung diakses browser
    const uploadsDir = path.join(__dirname, '../../../frontend/public/uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, targetFileName);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${targetFileName}`;
    console.log('[Upload] Gambar disimpan di:', publicUrl);

    res.json({
      status: 'success',
      message: 'Gambar berhasil diunggah!',
      data: {
        url: publicUrl
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ status: 'error', message: 'Gagal mengunggah gambar' });
  }
};

const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/config');
const apiRoutes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(cors());
app.use(express.json());

// Folder upload
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// konfigurasi multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });

// global routes
app.use('/api', apiRoutes);

// handle upload file
app.post('/upload', (req, res) => {
  // Hapus semua file di folder uploads
  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      console.error('Gagal membaca folder uploads:', err);
      return res.status(500).json({ message: 'Gagal membaca folder uploads' });
    }
    for (const file of files) {
      const filePath = path.join(uploadsDir, file);
      fs.unlinkSync(filePath);
    }

    // upload file
    upload.single('fileData')(req, res, (err) => {
      if (err) {
        console.error('Gagal upload file:', err);
        return res.status(500).json({ message: 'Gagal upload file' });
      }

      console.log('File info:', req.file);

      res.status(200).json({
        status: 'success',
        message: 'File  berhasil diupload',
        filename: req.file.filename,
        url: `/uploads/${req.file.filename}`,
      });
    });
  });
});

// Menyajikan file statis jika mau (opsional)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await sequelize.sync({ alter: true }); // sync model ke database
});

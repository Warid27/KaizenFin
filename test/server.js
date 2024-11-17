// server.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Inisialisasi aplikasi Express
const app = express();

// Menyajikan file test.html saat mengakses root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'test.html'));
});

// Set up storage untuk Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Folder tempat menyimpan file yang di-upload
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Menggunakan timestamp untuk nama file unik
  }
});

const upload = multer({ storage: storage });

// Middleware untuk menerima JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Menyimpan data JSON ke file
app.post('/save-data', (req, res) => {
  const { name, email } = req.body;
  const data = {
    name: name,
    email: email
  };

  // Menyimpan data ke file JSON
  fs.writeFileSync('data-test.json', JSON.stringify(data, null, 2), 'utf-8');
  res.send('Data berhasil disimpan!');
});

// Endpoint untuk meng-upload file
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  const filePath = req.file.path;
  res.send(`File berhasil di-upload ke: ${filePath}`);
});

// Endpoint untuk membaca data JSON
app.get('/get-data', (req, res) => {
  const rawData = fs.readFileSync('data-test.json', 'utf-8');
  res.json(JSON.parse(rawData));
});

// Jalankan server pada port 3000
app.listen(3000, () => {
  console.log('Server berjalan di http://localhost:3000');
});

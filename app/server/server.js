const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Inisialisasi aplikasi Express
const app = express();

// Middleware untuk parsing JSON dan URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Menyajikan file statis
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/app', express.static(path.join(__dirname, '../../app')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../index.html'));
});

// Konfigurasi Multer untuk upload file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Path file database
const databasePath = path.join(__dirname, '../database/data.json');

app.post('/save-data', (req, res) => {
  console.log(req.body); // Debugging: Log the received data
  const { dataName, nama, metode, jumlah } = req.body;

  if (!dataName || !nama || !metode || !jumlah) {
      return res.status(400).send('Semua field wajib diisi!');
  }

  const newData = {
      nama,
      metode,
      jumlah: parseFloat(jumlah) // Ensure `jumlah` is stored as a number
  };

  let database = {};
  if (fs.existsSync(databasePath)) {
      const rawData = fs.readFileSync(databasePath, 'utf-8');
      database = JSON.parse(rawData);
  }

  if (!database[dataName]) {
      database[dataName] = [];
  }

  database[dataName].push(newData); // Add the new entry
  fs.writeFileSync(databasePath, JSON.stringify(database, null, 2), 'utf-8');
  res.send(`Data berhasil disimpan ke ${dataName}!`);
});

// Endpoint untuk membaca data
app.get('/get-data/:dataName', (req, res) => {
  const { dataName } = req.params;

  if (!fs.existsSync(databasePath)) {
    return res.status(404).send('Database tidak ditemukan!');
  }

  const rawData = fs.readFileSync(databasePath, 'utf-8');
  const database = JSON.parse(rawData);

  if (!database[dataName]) {
    return res.status(404).send(`Data dengan nama ${dataName} tidak ditemukan!`);
  }

  res.json(database[dataName]);
});

// Jalankan server pada port 3000
app.listen(3000, () => {
  console.log('Server berjalan di http://localhost:3000');
});

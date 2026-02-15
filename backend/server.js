const express = require('express');
const cors = require('cors');
const path = require('path');
const { PrismaClient } = require('@prisma/client'); // Panggil Si Kepala Gudang
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const upload = multer({ storage: multer.memoryStorage() });

const app = express();
const prisma = new PrismaClient(); // Aktifkan Prisma
const port = process.env.PORT || 3000;

cloudinary.config({
  cloud_name: 'dsjpm0pzj',
  api_key: '873237874988831',
  api_secret: '5a8gHfRpRQoRlLxNw8b0wKui5Ks'
});

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

// --- API ROUTES ---

// 1. GET: Ambil semua produk dari Postgres
app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil data" });
  }
});

// 2. POST: Tambah produk baru ke Postgres
app.post('/api/products', async (req, res) => {
  const { name, price, image } = req.body;

  try {
    const newProduct = await prisma.product.create({
      data: {
        name: name,
        price: parseInt(price), // Ubah teks jadi angka biar Postgres gak marah
        image: image,
      },
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Gagal menyimpan produk" });
  }
});

// POST: Upload Gambar ke Cloudinary
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Tidak ada file' });

    // Konversi buffer file ke base64 agar bisa diupload
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;

    // Upload ke Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'toko-online-uploads', // Nama folder di Cloudinary
    });

    // Kirim balik URL gambar ke Frontend
    res.json({ imageUrl: result.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal upload gambar' });
  }
});

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`🚀 Server Postgres jalan di http://localhost:${port}`);
});

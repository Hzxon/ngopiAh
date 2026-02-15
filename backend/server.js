const express = require('express');
const cors = require('cors');
const path = require('path');
const { PrismaClient } = require('@prisma/client'); // Panggil Si Kepala Gudang

const app = express();
const prisma = new PrismaClient(); // Aktifkan Prisma
const port = process.env.PORT || 3000;

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
  const { name, price } = req.body;

  try {
    const newProduct = await prisma.product.create({
      data: {
        name: name,
        price: parseInt(price), // Ubah teks jadi angka biar Postgres gak marah
      },
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Gagal menyimpan produk" });
  }
});

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`🚀 Server Postgres jalan di http://localhost:${port}`);
});

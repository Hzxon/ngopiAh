const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();



const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil produk" });
  }
}

module.exports = { getProducts };

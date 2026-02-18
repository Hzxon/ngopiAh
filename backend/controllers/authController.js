require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

const { registerSchema, loginSchema } = require('../validations/authSchema');

const register = async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({ where: { email: validatedData.email } });
    if (existingUser) return res.status(400).json({ error: "Email sudah terdaftar!" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        name: validatedData.name
      },
      select: { id: true, email: true, name: true }
    })

    res.json({ message: "User berhasil dibuat!", user });
  } catch (error) {
    if (error.issues) return res.status(400).json({ error: error.issues[0].message });
    res.status(500).json({ error: "Gagal register" });
  }
}

const login = async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email: validatedData.email } });
    if (!user) return res.status(400).json({ error: "Email atau password salah" });

    const validPassword = await bcrypt.compare(validatedData.password, user.password);
    if (!validPassword) return res.status(400).json({ error: "Email atau password salah" });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 3_600_000
    })

    res.json({ message: "Login berhasil!" });
  } catch (error) {
    if (error.issues) return res.status(400).json({ error: error.issues[0].message });
    res.json({ error: "Gagal login" });
  }
}

const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: "Logout berhasil" });
}

module.exports = { register, login, logout };

const { z } = require('zod');

const registerSchema = z.object({
  email: z.string().email("Format email salah!"),
  password: z.string().min(6, "Password minimal 6 karakter!"),
  name: z.string().min(3, "Nama terlalu pendek!").optional()
})

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi")
})

module.exports = { registerSchema, loginSchema };

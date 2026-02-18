const jwt = require('jsonwebtoken');



const authenticationToken = (req, res, next) => {
  const token = req.cookie.token;

  if (!token) return res.status(401).json({ error: "Akses ditolak! Mana tiketnya?" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Tiket tidak valid/kadaluarsa" });
    req.user = user;
    next();
  })
}

module.exports = authenticationToken;

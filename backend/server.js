require('dotenv').config();
const express = require('express');

const cors = require('cors');
const cookieParser = require('cookie-parser');

const morgan = require('morgan');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const sanitizer = require('perfect-express-sanitizer');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');


const app = express();
const PORT = process.env.PORT || 3000;

// 1. SECURITY HEADERS & LOGGING
app.use(helmet());
app.use(morgan('dev'));

// 2. RATE LIMITER 
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Terlalu banyak request dari IP ini, coba lagi nanti ya!",
  standardHeaders: true,
  legacyHeaders: false
})
app.use(limiter);

// 3. PARSING BODY & CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(express.json());
app.use(cookieParser());


// 4. SANITIZATION
app.use(sanitizer.clean({
  xss: true,
  noSql: true,
  sql: true
}))

// 5. PARAMETER POLLUTION
app.use(hpp());


// 6. ROUTES 
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);



app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`)
})

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth',       require('./routes/auth'));
app.use('/api/study',      require('./routes/study'));
app.use('/api/mental',     require('./routes/mental'));
app.use('/api/career',     require('./routes/career'));
app.use('/api/academic',   require('./routes/academic'));
app.use('/api/finance',    require('./routes/finance'));
app.use('/api/social',     require('./routes/social'));
app.use('/api/skills',     require('./routes/skills'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', app: 'BITSPARKS', version: '1.0.0' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`⚡ BITSPARKS server running on port ${PORT}`));

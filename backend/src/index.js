const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Debug request logger (early so it sees raw body)
app.use((req, res, next) => {
  const start = Date.now();
  // Collect chunks if JSON
  let rawBody = [];
  req.on('data', chunk => rawBody.push(chunk));
  req.on('end', () => {
    if (rawBody.length) {
      try { req._rawBody = Buffer.concat(rawBody).toString(); } catch {}
    }
  });

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `[API] ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`
    );
    console.log(`  Query:`, Object.keys(req.query).length ? req.query : '{}');
    if (req._rawBody) console.log(`  RawBody:`, req._rawBody);
    if (req.body && Object.keys(req.body).length) console.log(`  ParsedBody:`, req.body);
    console.log(`  Headers: { authorization: ${req.headers.authorization ? 'present' : 'none'}, content-type: ${req.headers['content-type'] || 'none'} }`);
  });

  next();
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Backend is running' });
});

// Routes
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/users', require('./routes/users'));
app.use('/api/analytics', require('./routes/analytics'));

// Error handling
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
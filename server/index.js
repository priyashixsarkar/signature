// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // ✅ Serve uploaded PDFs

// Routes
const authRoutes = require('./routes/auth');   // ✅ Auth (register, login)
const docsRoutes = require('./routes/docs');   // ✅ Docs (upload, fetch)

app.use('/api/auth', authRoutes);
app.use('/api/docs', docsRoutes);              // ✅ Ensure this matches frontend fetchDocuments()

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ MongoDB connection error:', err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const Document = require('../models/Document');
const authMiddleware = require('../middlewares/authMiddleware');

// 🗂️ Setup Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '-');
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDFs allowed'));
  },
});

// 📤 Upload Document
router.post('/upload', authMiddleware, upload.single('pdf'), async (req, res) => {
  try {
    const newDoc = new Document({
      title: req.body.title,
      filename: req.file.filename,
      uploadedBy: req.user.id,
    });
    await newDoc.save();
    res.status(201).json(newDoc);
  } catch (err) {
    console.error('Upload failed:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// 📥 Fetch All Documents
router.get('/', authMiddleware, async (req, res) => {
  try {
    const docs = await Document.find().populate('uploadedBy', 'name');
    res.json(docs);
  } catch (err) {
    console.error('Fetching failed:', err);
    res.status(500).json({ error: 'Fetching documents failed' });
  }
});

// ✍️ Sign Document
router.post('/sign/:docId', authMiddleware, async (req, res) => {
  try {
    const doc = await Document.findById(req.params.docId);
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    if (doc.signed) return res.status(400).json({ error: 'Document already signed' });
    doc.signed = true;
    doc.signedAt = new Date();
    doc.signedBy = req.user._id;
    await doc.save();

    res.json({ message: 'Document signed', doc });
  } catch (err) {
    console.error('Signing failed:', err);
    res.status(500).json({ error: 'Signing failed' });
  }
});

module.exports = router;

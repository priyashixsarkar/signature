const express = require('express');
const router = express.Router();
const Signature = require('../models/Signature');
const auth = require('../middleware/auth');

// Save Signature Position (x, y)
router.post('/', auth, async (req, res) => {
  try {
    const { docId, x, y, page } = req.body;

    const newSignature = new Signature({
      docId,
      signer: req.user.id,
      x,
      y,
      page,
    });

    await newSignature.save();
    res.status(201).json({ message: 'Signature saved', signature: newSignature });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save signature' });
  }
});

module.exports = router;

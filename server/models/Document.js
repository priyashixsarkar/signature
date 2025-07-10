const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: String,
  filename: String,
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  signed: { type: Boolean, default: false },
  signedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  signedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);

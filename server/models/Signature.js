const mongoose = require('mongoose');

const signatureSchema = new mongoose.Schema({
  docId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
  signer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  x: Number,
  y: Number,
  page: Number,
  status: {
    type: String,
    enum: ['Pending', 'Signed', 'Rejected'],
    default: 'Pending',
  },
  reason: String,
  signedAt: Date,
});

module.exports = mongoose.model('Signature', signatureSchema);

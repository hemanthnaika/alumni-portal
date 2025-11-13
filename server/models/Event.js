const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String, // or mongoose.Schema.Types.ObjectId if you're referencing a User
    required: true,
  },
  raisedHands: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // ✅ Must match your user model
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);

const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  story: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
    default: null
  },
  amount: {
    type: Number,
    required: [true, 'Please add an amount'],
    min: 0
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: [
      'Food',
      'Transportation',
      'Shopping',
      'Entertainment',
      'Healthcare',
      'Education',
      'Bills',
      'Travel',
      'Other'
    ]
  },
  paymentMode: {
    type: String,
    required: [true, 'Please add a payment mode'],
    enum: ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Other']
  },
  date: {
    type: Date,
    required: [true, 'Please add a date'],
    default: Date.now
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for better query performance
expenseSchema.index({ user: 1, date: -1 });
expenseSchema.index({ user: 1, category: 1 });
expenseSchema.index({ story: 1 });

module.exports = mongoose.model('Expense', expenseSchema);

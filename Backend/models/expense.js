const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  groupid:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'group',
    required: true
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  splitBetween: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  }],
  splitAmounts: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    amount: {
      type: Number,
      required: true

    }
  }],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('expense', expenseSchema);
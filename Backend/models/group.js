const mongoose = require('mongoose');

const userGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  }],
  expenses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'expense'
  }]
});
module.exports = mongoose.model('group',userGroupSchema);

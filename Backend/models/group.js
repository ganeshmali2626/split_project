const mongoose = require('mongoose');

const userGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  users: [{id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  roal:{
    type: String,
    required: true
  }
}
],
  expenses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'expense'
  }]
});
module.exports = mongoose.model('group',userGroupSchema);

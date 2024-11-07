const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'employee' },  // can be 'admin' or 'employee'
});

module.exports = mongoose.model('User', UserSchema);

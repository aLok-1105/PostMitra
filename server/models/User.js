const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true},
  password: { type: String, required: true },
  role: { type: String, enum: ['Operator', 'Officer'], default: 'Operator' },
});

AdminSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

AdminSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', AdminSchema);

module.exports = User;

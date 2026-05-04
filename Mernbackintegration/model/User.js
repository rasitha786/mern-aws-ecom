const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UserSchema = new mongoose.Schema({name:{type:String,required:true},email:{type:String,required:true,unique:true},password:{type:String,required:true},role:{type:String,enum:['user','admin'],default:'user'}},{timestamps:true});
UserSchema.pre('save', function(next) {
  if(!this.isModified('password')) return next();
  const self = this;
  bcrypt.hash(self.password, 12, function(err, hash) {
    if(err) return next(err);
    self.password = hash;
    next();
  });
});
UserSchema.methods.comparePassword = async function(password) { return await bcrypt.compare(password, this.password); };
module.exports = mongoose.model('User', UserSchema);
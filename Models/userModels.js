const mongoose = require('mongoose');
const  bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {type:String, required: true },
    email:{type:String, required: true },
    password:{type:String,required:true},
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'//default to user if user is nothing is selected

    }
});

//hash the password before saving 
userSchema.pre('save',async function(){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,10);
});
module.exports = mongoose.model('User',userSchema);
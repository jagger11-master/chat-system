//===============
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionText:{type:String,required:true},
    askedBy:{type:mongoose.Schema.Types.ObjectId,ref:'User'},//who asked user
    answer: {type:String,default:""},//admin's response
    createdAt:{type:Date,default:Date.now},
});
module.exports = mongoose.model('Question',questionSchema);
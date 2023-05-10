const mongoose = require('mongoose');

const UserSchema= mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:[true],
        unique:[true,'user already exists']
    }, 
    phone:{
        type:Number,
        required:true
    }, 
    password:{
        type:String,
        required:true
    }, 
    data:
    {
        type:Date,
        default:Date.now
    },
    balance: {
       credit: {
        type: Number,
        default:0
        },
        debit:{
         type: Number,
         default:0
        }
      },
});
mongoose.Schema.Types.ObjectId,
module.exports = mongoose.model('user',UserSchema);
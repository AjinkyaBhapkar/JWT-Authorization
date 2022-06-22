const mongoose =require('mongoose');
const Schema =mongoose.Schema;

const userNameSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique:true,
        trim: true,
        minlength:4
    },
    password:{
        type: String,
        required: true,
    }
},{
    timestamps:true,
});

const UserName =mongoose.model('UserName', userNameSchema);

module.exports=UserName;

import mongoose from "mongoose";
const {
    Schema,
    model
} = mongoose;

const UserSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    name:{
        type:String,
        required:true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    role:{
        type:String,
        required:true
    },
    regNo:{
        type:String,
        required:true
    },
    school:{
        type:String,
        required:true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
}, {
    timestamps: true
});

const UserModel = model('User', UserSchema);

export default UserModel;
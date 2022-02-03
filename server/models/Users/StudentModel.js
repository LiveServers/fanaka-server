import {Schema,model} from "mongoose";

const StudentSchema = new Schema({
    _id: {
        type:String,
        required:true,
    },
    certification:{
        type:String,
        index: true,
        // required: true,
    },
    regNo: {
        type: String,
        // required: true,
    },
    userName: {
        type: String,
        required: true,
        index:true
    },
    password: {
        type: String,
        required: true,
    },
    role:{
        type: String,
        required: true,
        default: 'student',
    },
    currentEnrolledProgramme: {
        type: String,
        index: true,
    },
    year: {
        type: String,
    },
    semester: {
        type: String,
        index:true,
    },
    school: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
}, {timestamps: true});

const StudentModel = model("Student",StudentSchema);

export default StudentModel;

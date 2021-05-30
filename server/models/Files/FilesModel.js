import {model,Schema} from "mongoose";

const FilesSchema = new Schema({
    _id:{
        type:String,
        required:true
    },
    fileCreator:{
        type:Schema.Types.String,
        ref:"User",
        required:true
    },
    unit:{
        type:Schema.Types.String,
        ref:"Units",
        required:true
    },
    files:{
        type:[String],
        required:true
    }
})

const FilesModel = model('Files',FilesSchema);

export default FilesModel;
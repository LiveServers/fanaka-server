import {model,Schema} from "mongoose";

const UnitsSchema = new Schema({
    _id:{
        type:String,
        required:true
    },
    unitCreator:{
        type:Schema.Types.String,
        ref:"User",
        required:true
    },
    files:[{
        type:Schema.Types.String,
        ref:"Files"
    }],
    unitName:{
        type:String,
        required:true
    }
})

const UnitsModel = model('Units',UnitsSchema);

export default UnitsModel;
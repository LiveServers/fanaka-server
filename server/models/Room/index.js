import { model, Schema } from 'mongoose';

const RoomMessages = new Schema({
    from: String,
    sentAt: {
        type: Date,
        default: Date.now
    },
    subject:String
});

const RoomSchema = new Schema({
    _id: {
        type: String,
        required: true,
    },
    unitCreator: {
        type: Schema.Types.String,
        ref: 'User',
        required: true,
    },
    roomName: {
        type: String,
        index: true,
        required: false,
    },
    school:{
        type: String,
        required: true,
    },
    certificate: {
        type: String,
        required: true,
    },
    programme: {
        type: String,
        required: true,
    },
    messages:[RoomMessages],
    year: {
        type: String,
        required: true,
    },
    semester: {
        type: String,
        index: true,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
},{timestamps:true});

const RoomModel = model('Rooms', RoomSchema);

export default RoomModel;

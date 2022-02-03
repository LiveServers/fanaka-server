import { model, Schema } from 'mongoose';

const UnitsSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  unitCreator: {
    type: Schema.Types.String,
    ref: 'User',
    required: true,
  },
  semester: {
    type: String,
    index: true,
    required: false,
  },
  files: {
    type: [String],
    required: true,
  },
  fileNames: {
    type: [String],
    required: true,
  },
  unitName: {
    type: String,
    required: true,
    index: true,
  },
  year: {
    type: String,
    required: true,
  },
  school:{
    type: String,
    required: true,
  },
  certification: {
    type: String,
    required: true,
  },
  programme: {
    type: String,
    required: true,
  },
  courseCode: {
    type: String,
    required: true,
    index: true,
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

const UnitsModel = model('Units', UnitsSchema);

export default UnitsModel;

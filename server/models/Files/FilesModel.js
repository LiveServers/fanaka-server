import { model, Schema } from 'mongoose';

const FilesSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  files: {
    type: [String],
    required: true,
  },
  fileNames: {
    type: [String],
    required: true,
  },
});

const FilesModel = model('Files', FilesSchema);

export default FilesModel;

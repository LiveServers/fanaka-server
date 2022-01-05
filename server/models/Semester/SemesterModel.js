import { Schema, model } from 'mongoose';

const SemesterSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    unitCreator: {
      type: Schema.Types.String,
      ref: 'User',
      required: true,
    },
    unit: [
      {
        type: Schema.Types.String,
        ref: 'Units',
      },
    ],
    path: {
      type: String,
      required: true,
    },
    semester: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timeStamps: true,
  }
);

const SemesterModel = model('Semester', SemesterSchema);

export default SemesterModel;

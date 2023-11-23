import { model, Schema } from 'mongoose';

/* eslint-disable-next-line prefer-destructuring */
const ObjectId = Schema.Types.ObjectId;

const tokenSchema = new Schema({
  _userId: {
    type: ObjectId,
    required: true,
    ref: 'User',
  },
  token: { type: String, required: true },
  createdAt: {
    type: Date,
    required: true,
    default: new Date(),
    expires: 43200,
  },
});

export const Token = model('Token', tokenSchema);

export default Token;

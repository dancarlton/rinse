import { Schema, model } from 'mongoose';

const sessionSchema = new Schema({
  session: String,
  session_id: String,
  expire: { type: Date, required: true, default: new Date(), expires: '14d' },
});

export const SessionModel = model('Session', sessionSchema);

export default SessionModel;

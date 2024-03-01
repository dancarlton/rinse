import mongoose from 'mongoose';
const { Schema } = mongoose;

const bookingSchema = new Schema(
  {
    provider: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    consumer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    calendlyEventUri: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    statusTimestamps: {
      pending: { type: Date, default: Date.now },
      confirmed: Date,
      completed: Date,
      cancelled: Date,
    },
    hasPaid: {
      type: Boolean,
      default: false,
    },
    paymentDetails: {
      transactionId: { type: String },
      amountPaid: { type: Number },
      paymentProcessor: { type: String },
      paymentTimestamp: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

export const Booking = mongoose.model('Booking', bookingSchema);

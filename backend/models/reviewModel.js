import mongoose from 'mongoose';
const { Schema } = mongoose;

const reviewSchema = new Schema(
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
    rating: {
      type: Number,
      required: true,
      min: 1, // Minimum rating value
      max: 5, // Maximum rating value
    },
    comment: {
      type: String,
      required: true,
    },
    reply: {
      type: String,
      required: false, // Optional field for provider replies
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ provider: 1, service: 1, consumer: 1 });

export const Review = mongoose.model('Review', reviewSchema);

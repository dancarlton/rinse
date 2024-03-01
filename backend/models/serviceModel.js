import mongoose from 'mongoose';
const { Schema } = mongoose;

const serviceSchema = new Schema(
  {
    provider: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true, // Ensures the title is stored without leading/trailing whitespace
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0, // Prevents negative prices
    },
    estimatedTime: {
      type: Number,
      required: true,
      min: 0,
    },
    photo: {
      type: String,
      required: false,
    },
    numRatings: {
      type: Number,
      required: true,
      default: 0,
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

serviceSchema.index({ provider: 1 });

serviceSchema.methods.updateRating = function updateRating(newRating) {
  const cumulativeRatingScore = numRatings * rating + newRating;
  this.numRatings += 1;
  this.rating = cumulativeRatingScore / this.numRatings;
  return this.save();
};

export const Service = mongoose.model('Service', serviceSchema);

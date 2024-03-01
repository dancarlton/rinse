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
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    estimatedTime: {
      type: Number,
      required: true,
    },
    photo: {
      type: String,
      required: false,
    },
    rating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

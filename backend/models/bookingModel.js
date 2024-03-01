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
    hasPaid: {
      type: Boolean,
      default: false,
    },
    paymentDetails: {
      // This can be expanded based on the payment processor (e.g., Stripe) used
      transactionId: String,
      amountPaid: Number,
      paymentProcessor: String,
    },
  },
  {
    timestamps: true,
  }
);

import mongoose from 'mongoose';
import 'dotenv/config';
import colors from 'colors';
import { faker } from '@faker-js/faker';
import { User } from './models/userModel.js';
import { Service } from './models/serviceModel.js';
import { Review } from './models/reviewModel.js';
import { Booking } from './models/bookingModel.js';
import { initDB } from './config/db.js';

await initDB();

// How many records we wanto to create
const numRecords = 100;

// admin template
const admin = new User({
  name: 'admin',
  email: 'admin@email.com',
  password: 'Pa55word!',
  role: 'admin',
  googleId: faker.string.uuid(),
  isVerified: true,
  avatar: faker.image.avatar(),
  location: {
    type: 'Point',
    coordinates: [faker.location.longitude(), faker.location.latitude()],
  },
  numRatings: faker.number.int(10000),
  rating: faker.number.int(5),
});

const destroyData = async () => {
  console.log('Destroying Data...'.red);
  const startTime = new Date();

  try {
    const deleteManyResultUser = await User.deleteMany();
    const deleteManyResultService = await Service.deleteMany();
    const deleteManyResultReview = await Review.deleteMany();
    const deleteManyResultBooking = await Booking.deleteMany();

    const endTime = new Date();
    const duration = endTime - startTime; // Duration in milliseconds

    console.log(`Data Destroyed! Duration: ${duration}ms`.red.inverse);
    console.log(`User: ${deleteManyResultUser.deletedCount} records deleted`.red);
    console.log(`Service: ${deleteManyResultService.deletedCount} records deleted`.red);
    console.log(`Review: ${deleteManyResultReview.deletedCount} records deleted`.red);
    console.log(`Booking: ${deleteManyResultBooking.deletedCount} records deleted`.red);
  } catch (error) {
    logErrorDetails(error, 'destroy operation', 'All');
  }
};

const logErrorDetails = (error, operation, model) => {
  console.error(`Error during ${operation} on ${model}: ${error.message}`.red.inverse);
  // Additional error details can be logged here if needed
};

const createBookingWithStatus = (provider, consumer, service) => {
  // Base date for the booking creation
  const baseDate = faker.date.recent({ days: 90 }); // Booking created within the last 90 days
  const statusOptions = ['pending', 'confirmed', 'completed', 'cancelled'];

  // Start with a pending status
  let status = 'pending';
  const statusTimestamps = {
    pending: baseDate,
    confirmed: null,
    completed: null,
    cancelled: null,
  };

  // Randomly decide the next status (for simplicity, this example may not cover all real-world logic)
  const nextStatus = faker.helpers.arrayElement(statusOptions.slice(1)); // Exclude 'pending' as it is the initial state

  switch (nextStatus) {
    case 'confirmed':
      status = 'confirmed';
      statusTimestamps.confirmed = new Date(
        baseDate.getTime() + faker.number.int({ min: 1, max: 7 }) * 24 * 60 * 60 * 1000
      );
      // Decide if we go to completed or cancelled from confirmed
      if (faker.datatype.boolean()) {
        status = 'completed';
        statusTimestamps.completed = new Date(
          statusTimestamps.confirmed.getTime() +
            faker.number.int({ min: 1, max: 14 }) * 24 * 60 * 60 * 1000
        );
      } else {
        status = 'cancelled';
        statusTimestamps.cancelled = new Date(
          statusTimestamps.confirmed.getTime() +
            faker.number.int({ min: 1, max: 3 }) * 24 * 60 * 60 * 1000
        );
      }
      break;
    case 'completed':
      // For a booking to be completed, it first needs to be confirmed
      status = 'confirmed';
      statusTimestamps.confirmed = new Date(
        baseDate.getTime() + faker.number.int({ min: 1, max: 7 }) * 24 * 60 * 60 * 1000
      );
      status = 'completed';
      statusTimestamps.completed = new Date(
        statusTimestamps.confirmed.getTime() +
          faker.number.int({ min: 1, max: 14 }) * 24 * 60 * 60 * 1000
      );
      break;
    case 'cancelled':
      // Bookings can be cancelled either from pending or confirmed states
      if (faker.datatype.boolean()) {
        // Assume it was confirmed then cancelled
        status = 'confirmed';
        statusTimestamps.confirmed = new Date(
          baseDate.getTime() + faker.number.int({ min: 1, max: 7 }) * 24 * 60 * 60 * 1000
        );
        status = 'cancelled';
        statusTimestamps.cancelled = new Date(
          statusTimestamps.confirmed.getTime() +
            faker.number.int({ min: 1, max: 3 }) * 24 * 60 * 60 * 1000
        );
      } else {
        // Cancelled directly from pending
        status = 'cancelled';
        statusTimestamps.cancelled = new Date(
          baseDate.getTime() + faker.number.int({ min: 1, max: 7 }) * 24 * 60 * 60 * 1000
        );
      }
      break;
  }

  // Create and return the booking object
  return new Booking({
    provider: provider._id,
    consumer: consumer._id,
    service: service._id,
    status,
    statusTimestamps,
    calendlyEventUri: faker.internet.url(),
    hasPaid: status !== 'cancelled' && faker.datatype.boolean(), // Assume payment may not have been made if the booking is cancelled
    paymentDetails:
      status !== 'cancelled'
        ? {
            transactionId: faker.string.uuid(),
            amountPaid: faker.commerce.price(),
            paymentProcessor: faker.helpers.arrayElement(['stripe', 'paypal']),
            paymentTimestamp: baseDate, // Assuming payment was made at the time of booking
          }
        : {},
  });
};

const createDummyData = async (numRecords) => {
  try {
    await destroyData(); // Clear existing data

    // Seed Users
    const users = [admin];
    console.log(`Seeding users...`.blue);
    for (let i = 0; i < numRecords; i++) {
      users.push(
        new User({
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: faker.internet.password({
            length: 10,
          }),
          role: faker.helpers.arrayElement(['admin', 'user', 'provider']),
          googleId: faker.string.uuid(),
          isVerified: faker.datatype.boolean(),
          avatar: faker.image.avatar(),
          location: {
            type: 'Point',
            coordinates: [faker.location.longitude(), faker.location.latitude()],
          },
          numRatings: faker.number.int(1000),
          rating: faker.number.int(5),
        })
      );
    }
    await User.insertMany(users);
    console.log(`Seeded ${users.length} users.`.green);
    const providers = users.filter((user) => user.role === 'provider');
    const consumers = users.filter((user) => user.role === 'user');

    // Seed Services
    const services = [];
    console.log('Seeding services...'.blue);
    providers.forEach((provider) => {
      for (let i = 0; i < Math.floor(Math.random() * 5) + 1; i++) {
        // 1 - 5 services per provider
        services.push(
          new Service({
            provider: provider._id,
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: faker.commerce.price(),
            estimatedTime: faker.number.float(4),
            photo: faker.image.urlPicsumPhotos({ blur: 4 }),
          })
        );
      }
    });
    await Service.insertMany(services);
    console.log(`Seeded ${services.length} services.`.green);

    // Seed Reviews and Bookings
    const bookings = [];
    const reviews = [];
    console.log('Seeding bookings and reviews...'.blue);
    services.forEach((service) => {
      // Find provider and consumer
      const provider = providers.find((provider) => provider._id.equals(service.provider));
      const consumer = faker.helpers.arrayElement(consumers);

      // Create booking with realistic progression of statuses
      const booking = createBookingWithStatus(provider, consumer, service);
      bookings.push(booking);

      // Only create a review if booking is completed
      if (booking.status === 'completed') {
        const review = new Review({
          provider: provider._id,
          consumer: consumer._id,
          service: service._id,
          rating: faker.number.int({ min: 1, max: 5 }),
          comment: faker.lorem.sentence(),
          reply: faker.datatype.boolean() ? faker.lorem.sentence() : undefined,
        });
        reviews.push(review);
      }
    });

    await Booking.insertMany(bookings).catch((error) =>
      logErrorDetails(error, 'inserting', 'Bookings')
    );
    console.log(`Seeded ${bookings.length} bookings.`.green);
    await Review.insertMany(reviews).catch((error) =>
      logErrorDetails(error, 'inserting', 'Reviews')
    );
    console.log(`Seeded ${reviews.length} reviews.`.green);

    console.log('All data Imported!'.green.inverse);
  } catch (error) {
    logErrorDetails(error, 'general operation', 'Database');
  } finally {
    process.exit();
  }
};

// Check command-line arguments to determine which function to run
if (process.argv.includes('-D') || process.argv.includes('-d')) {
  destroyData();
} else {
  createDummyData(numRecords);
}

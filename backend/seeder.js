import mongoose from 'mongoose';
import 'dotenv/config';
import colors from 'colors';
import sampleUsers from './seeds/users.js';
import { User } from './models/userModel.js';
import { initDB } from './config/db.js';

initDB();

const importData = async () => {
  // function to allow for different creation times in the db of seeded data
  //   const sleep = (milliseconds) =>
  //     new Promise((resolve) => setTimeout(resolve, milliseconds));

  try {
    // Delete all existing users and facts
    await User.deleteMany();

    // Insert the sample users into the User collection
    await User.insertMany(sampleUsers);

    // Log a success message
    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    // Log any errors
    console.error(`Error: ${error}`.red.inverse);
    process.exit(1);
  }
};

// Function to delete all data from the database
const destroyData = async () => {
  try {
    // Delete all existing users and facts
    await User.deleteMany();

    // Log a success message
    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    // Log any errors
    console.error(`Error: ${error}`.red.inverse);
    process.exit(1);
  }
};

// Check command-line arguments to determine which function to run
if (process.argv.includes('-D') || process.argv.includes('-d')) {
  destroyData();
} else {
  importData();
}

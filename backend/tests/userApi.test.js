import mongoose from "mongoose";
import supertest from "supertest";
import { app } from "../server";
import "dotenv/config";
import colors from "colors";
import sampleUsers from "../seeds/users.js";
import { User } from "../models/userModel.js";
import { initDB } from "../config/db.js";

const api = supertest(app);

beforeEach(async () => {
  // Delete all existing users and facts
  await User.deleteMany();

  // Insert the sample users into the User collection
  await User.insertMany(sampleUsers);
});

test("users are returned as json", async () => {
  await api
    .get("/api/users")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("there are three users", async () => {
  const response = await api.get("/api/users");

  expect(response.body).toHaveLength(sampleUsers.length);
});

test("the first user is an admin", async () => {
  const response = await api.get("/api/users");

  expect(response.body[0].isAdmin).toBe(true);
});

afterAll(async () => {
  await mongoose.connection.close();
});

import mongoose from "mongoose";
import supertest from "supertest";
import bcrypt from "bcryptjs";
import "dotenv/config";
import sampleUsers from "../seeds/users.js";
import { User } from "../models/userModel.js";
import { app } from "../server";

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

test("there are three users initially", async () => {
  const response = await api.get("/api/users");

  expect(response.body).toHaveLength(sampleUsers.length);
});

test("the first initial user is an admin", async () => {
  const response = await api.get("/api/users");

  expect(response.body[0].isAdmin).toBe(true);
});

test("a valid user can be added", async () => {
  const newUser = {
    username: "Leonardo Da Vinci",
    email: "leodavinci@email.com",
    password: bcrypt.hashSync("leoRocks", 10),
    isAdmin: false,
  };

  await api
    .post("/api/users")
    .send(newUser)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/users");

  const usernames = response.body.map((r) => r.username);

  expect(response.body).toHaveLength(sampleUsers.length + 1);
  expect(usernames).toContain("Leonardo Da Vinci");
});

afterAll(async () => {
  await mongoose.connection.close();
});

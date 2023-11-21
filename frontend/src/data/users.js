import bcrypt from "bcryptjs";

export const sampleUsers = [
  {
    name: "admin",
    email: "admin@email.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: true,
    role: "admin",
  },
  {
    name: "johnd",
    email: "john@email.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: false,
    role: "user",
  },
  {
    name: "janed",
    email: "jane@email.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: false,
  },
]

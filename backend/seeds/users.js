import bcrypt from "bcryptjs";

const sampleUsers = [
  {
    username: "admin",
    email: "admin@email.com",
    password: bcrypt.hashSync("123456", 10),
    role: "admin",
  },
  {
    username: "johnd",
    email: "john@email.com",
    password: bcrypt.hashSync("123456", 10),
    role: "user",
  },
  {
    username: "janed",
    email: "jane@email.com",
    password: bcrypt.hashSync("123456", 10),
    role: "user",
  },
];

export default sampleUsers;

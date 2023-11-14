import bcrypt from "bcryptjs";

const sampleUsers = [
  {
    name: "admin",
    email: "admin@email.com",
    password: bcrypt.hashSync("123456", 10),
    role: "admin",
  },
  {
    name: "johnd",
    email: "john@email.com",
    password: bcrypt.hashSync("123456", 10),
    role: "user",
  },
  {
    name: "janed",
    email: "jane@email.com",
    password: bcrypt.hashSync("123456", 10),
    role: "user",
  },
];

export default sampleUsers;

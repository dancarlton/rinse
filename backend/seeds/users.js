import bcrypt from 'bcryptjs'

function generateRandomString(length = 6) {
  // Generates a random string of specified length
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

function createUsers(numUsers = 100) {
  // Creates a specified number of user objects
  const users = []
  for (let i = 0; i < numUsers; i++) {
    const name = generateRandomString()
    const email = `${name}@email.com`
    const password = 'simulatedBcryptHash' // Placeholder for bcrypt hash
    const role = 'user'
    users.push({
      name,
      email,
      password,
      role,
    })
  }
  return users
}

// Generate 100 user objects
// const sampleUsers = createUsers(10000);
// const sampleUsers = createUsers(10000);

export const sampleUsers = [
  {
    name: 'admin',
    email: 'admin@email.com',
    password: bcrypt.hashSync('123456', 10),
    role: 'admin',
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

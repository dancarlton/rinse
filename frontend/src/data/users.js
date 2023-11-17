import bcrypt from 'bcryptjs'

const sampleUsers = [
  {
    name: 'admin',
    email: 'admin@email.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
  },
  {
    name: 'johnd',
    email: 'john@email.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false,
  },
  {
    name: 'janed',
    email: 'jane@email.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false,
  },
]


export default users

import bcrypt from 'bcryptjs';

const sampleUsers = [
  {
    name: 'admin',
    email: 'admin@email.com',
    password: bcrypt.hashSync('Pa55word!', 10),
    role: 'admin',
  },
  {
    name: 'testuser',
    email: 'user@email.com',
    password: bcrypt.hashSync('Pa55word!', 10),
    role: 'user',
  },
];

export default sampleUsers;

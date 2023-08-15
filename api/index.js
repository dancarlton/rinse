const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();
const app = express();


app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:5173',
  })
);

mongoose.connect(process.env.MONGO_URL);

app.get('/test', (req, res) => {
  res.json('test ok');
});

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // hash has to be created inside async function
    const bcryptSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, bcryptSalt);

    // create user in mongo db
    const userDoc = await User.create({
      name,
      email,
      hashedPassword
    });
    // return user to client console
    res.json(userDoc);
  } catch (err) {
    console.log("I'm catching here: ",err, "\n")
    res.status(422).json(err);
  }
});

app.listen(4000);

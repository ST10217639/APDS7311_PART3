const mongoose = require('mongoose'); 
const bcrypt = require('bcrypt');
const User = require('./models/User'); // Adjust the path as needed
require('dotenv').config();
const express = require('express');
const app = express();

// Connect to the MongoDB database
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB for seeding'))
  .catch((err) => console.error('Could not connect to MongoDB', err));

// Middleware for validating user input
const validateInput = (req, res, next) => {
  const { username, password } = req.body;

  // Username: Only letters, numbers, and underscores allowed, 3-15 characters
  const usernamePattern = /^[a-zA-Z0-9_]{3,15}$/;
  // Password: Minimum 8 characters, at least one uppercase, one lowercase, and one digit
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

  // Validate username
  if (!usernamePattern.test(username)) {
    return res.status(400).json({ message: 'Invalid username format. Only letters, numbers, and underscores allowed, 3-15 characters.' });
  }

  // Validate password
  if (!passwordPattern.test(password)) {
    return res.status(400).json({ message: 'Invalid password format. Minimum 8 characters, at least one uppercase letter, one lowercase letter, and one digit required.' });
  }

  // If both validations pass, proceed to the next function
  next();
};

// Function to hash passwords and save users
async function seedUsers() {
  // Predefined users with secure passwords
  const users = [
    { username: 'Mpho_2024', password: 'Mpho@1234' },
    { username: 'Thebe_2024', password: 'Thebe@1234' },
    { username: 'Trent_2024', password: 'Trent@1234' },
    { username: 'Mcebo_2024', password: 'Mcebo@1234' },
    { username: 'Adam_2024', password: 'Adam@1234' },
  ];

  for (let user of users) {
    // Hash the password with salt
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    // Create and save the user in the database
    const newUser = new User(user);
    await newUser.save();
    console.log(`User ${user.username} created`);
  }

  mongoose.connection.close(); // Close connection after seeding
}

// Example of using the validation middleware in a login route
app.use(express.json()); // Middleware to parse JSON bodies

// Login route with input validation
app.post('/api/auth/login', validateInput, async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Generate a token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Run the seeding function to populate initial users
seedUsers().catch((err) => console.error('Error seeding users:', err));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

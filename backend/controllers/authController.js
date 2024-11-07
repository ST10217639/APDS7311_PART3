const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Login function
const loginUser = async (req, res) => {
  
  const { username, password } = req.body;

  try {
    // Check if user with the provided username exists in the database
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    // Compare provided password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Generate a JWT token if login is successful, including user ID and role in the payload
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET,            
      { expiresIn: '1h' }             
    );

    // Send the token and success message as a JSON response
    res.json({ token, message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Export the loginUser function to use in routes
module.exports = { loginUser };

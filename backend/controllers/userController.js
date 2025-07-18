const User = require('../models/User.js');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const registerUser = async (req, res) => {
  console.log('1. Register function started.');
  const { fullName, username, email, password } = req.body;

  try {
    console.log('2. Checking if user exists for email:', email);
    const userExists = await User.findOne({ email });
    console.log('3. Finished checking user existence.');

    if (userExists) {
      console.log('4. User already exists. Sending error.');
      return res.status(400).json({ message: 'User already exists' });
    }

    console.log('5. Creating new user in database...');
    const user = await User.create({ fullName, username, email, password });
    console.log('6. Finished creating user in database.');

    if (user) {
      console.log('7. User created successfully. Generating token...');
      const token = generateToken(user._id);
      console.log('8. Token generated. Preparing final response object.');

      const responseObject = {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        role: user.role,
        token: token,
      };

      console.log('9. Sending final response to frontend.');
      res.status(201).json(responseObject);
      // If the request hangs, you will see message #9 but not this next one.
      console.log('10. Response supposedly sent.'); 

    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('CRITICAL ERROR:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// NEW: Add the loginUser function
// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check for user by email
    const user = await User.findOne({ email });

    // If user exists and password matches, send back user data and token
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update the exports
module.exports = { registerUser, loginUser };

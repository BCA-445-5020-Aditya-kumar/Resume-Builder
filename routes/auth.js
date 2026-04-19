const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

const router = express.Router();
const fallbackUsers = [];

const buildToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

const isDatabaseReady = () => mongoose.connection.readyState === 1;

const findFallbackUser = ({ email, username }) =>
  fallbackUsers.find((user) => user.email === email || user.username === username);

// Register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const trimmedUsername = username.trim();
    const hashedPassword = await bcrypt.hash(password, 10);

    if (isDatabaseReady()) {
      const existingUser = await User.findOne({
        $or: [{ email: normalizedEmail }, { username: trimmedUsername }],
      });

      if (existingUser) {
        return res.status(409).json({ error: 'Email or username already exists.' });
      }

      await User.create({
        username: trimmedUsername,
        email: normalizedEmail,
        password: hashedPassword,
      });
    } else {
      const existingFallbackUser = findFallbackUser({
        email: normalizedEmail,
        username: trimmedUsername,
      });

      if (existingFallbackUser) {
        return res.status(409).json({ error: 'Email or username already exists.' });
      }

      fallbackUsers.push({
        id: `local_${Date.now()}`,
        username: trimmedUsername,
        email: normalizedEmail,
        password: hashedPassword,
      });
    }

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    let user;

    if (isDatabaseReady()) {
      user = await User.findOne({ email: normalizedEmail });
    } else {
      user = fallbackUsers.find((entry) => entry.email === normalizedEmail);
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = buildToken(user._id || user.id);

    res.json({
      token,
      user: {
        id: user._id || user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

module.exports = router;

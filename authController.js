const { User } = require('../models');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function signup(req, res) {
  try {
    const { name, email, address, password } = req.body;
    const user = await User.create({ name, email, address, password, role: 'user' });
    res.json({ message: 'User created', userId: user.id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email }});
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const ok = await user.checkPassword(password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, role: user.role, email: user.email }});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { signup, login };

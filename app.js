const express = require('express');
const cors = require('cors');
const { sequelize, User } = require('./models');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const ownerRoutes = require('./routes/owner');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/owner', ownerRoutes);

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true }); // for dev: creates/updates tables
    // create default admin if not exists
    const adminEmail = 'admin@platform.com';
    const admin = await User.findOne({ where: { email: adminEmail }});
    if (!admin) {
      await User.create({ name: 'System Administrator Default User 000', email: adminEmail, password: 'Admin@1234', role: 'admin', address: 'Head Office' });
      console.log('Default admin created: admin@platform.com / Admin@1234 (change password!)');
    }
    app.listen(PORT, () => console.log('Server running on port', PORT));
  } catch (err) {
    console.error('Unable to start', err);
  }
}

start();

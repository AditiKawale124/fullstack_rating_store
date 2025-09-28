const { User, Store, Rating } = require('../models');
const { Op } = require('sequelize');

async function dashboard(req, res) {
  const totalUsers = await User.count();
  const totalStores = await Store.count();
  const totalRatings = await Rating.count();
  res.json({ totalUsers, totalStores, totalRatings });
}

async function addUser(req, res) {
  const { name, email, address, password, role } = req.body;
  try {
    const user = await User.create({ name, email, address, password, role: role || 'user' });
    res.json({ message: 'User added', userId: user.id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function addStore(req, res) {
  try {
    const { name, email, address } = req.body;
    const store = await Store.create({ name, email, address });
    res.json({ message: 'Store added', storeId: store.id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function listStores(req, res) {
  const { q, sortBy = 'name', order = 'ASC' } = req.query;
  const where = q ? { [Op.or]: [{ name: { [Op.iLike]: `%${q}%` } }, { address: { [Op.iLike]: `%${q}%` } }] } : {};
  const stores = await Store.findAll({ where, order: [[sortBy, order]] });
  // compute averages
  const result = await Promise.all(stores.map(async s => {
    const avg = await Rating.findAll({ where: { storeId: s.id }, attributes: ['score'] });
    const avgVal = avg.length ? (avg.reduce((a,b)=>a+b.score,0)/avg.length).toFixed(2) : null;
    return { id: s.id, name: s.name, email: s.email, address: s.address, rating: avgVal };
  }));
  res.json(result);
}

async function listUsers(req, res) {
  const { role, q, sortBy = 'name', order = 'ASC' } = req.query;
  const where = {};
  if (role) where.role = role;
  if (q) where[Op.or] = [{ name: { [Op.iLike]: `%${q}%` } }, { email: { [Op.iLike]: `%${q}%` } }, { address: { [Op.iLike]: `%${q}%` } }];
  const users = await User.findAll({ where, order: [[sortBy, order]] });
  res.json(users.map(u => ({ id: u.id, name: u.name, email: u.email, address: u.address, role: u.role })));
}

module.exports = { dashboard, addUser, addStore, listStores, listUsers };

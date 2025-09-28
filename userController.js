const { Store, Rating } = require('../models');
const { Op } = require('sequelize');

async function listStores(req, res) {
  const { name, address, sortBy = 'name', order = 'ASC' } = req.query;
  const where = {};
  if (name) where.name = { [Op.iLike]: `%${name}%` };
  if (address) where.address = { [Op.iLike]: `%${address}%` };
  const stores = await Store.findAll({ where, order: [[sortBy, order]] });
  // attach user's rating & overall rating
  const result = await Promise.all(stores.map(async s => {
    const ratings = await Rating.findAll({ where: { storeId: s.id }});
    const avg = ratings.length ? (ratings.reduce((a,b)=>a+b.score,0)/ratings.length).toFixed(2) : null;
    const userRating = await Rating.findOne({ where: { storeId: s.id, userId: req.user.id }});
    return { id: s.id, name: s.name, address: s.address, overallRating: avg, userRating: userRating ? userRating.score : null };
  }));
  res.json(result);
}

async function submitRating(req, res) {
  try {
    const { storeId } = req.params;
    const { score, comment } = req.body;
    if (!Number.isInteger(score) || score < 1 || score > 5) return res.status(400).json({ message: 'Score 1-5' });
    // find existing
    const existing = await Rating.findOne({ where: { storeId, userId: req.user.id }});
    if (existing) {
      existing.score = score;
      existing.comment = comment;
      await existing.save();
      return res.json({ message: 'Rating updated' });
    } else {
      await Rating.create({ storeId, userId: req.user.id, score, comment });
      return res.json({ message: 'Rating submitted' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function updatePassword(req, res) {
  try {
    const { oldPassword, newPassword } = req.body;
    const ok = await req.user.checkPassword(oldPassword);
    if (!ok) return res.status(400).json({ message: 'Old password wrong' });
    req.user.password = newPassword;
    await req.user.save();
    res.json({ message: 'Password updated' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = { listStores, submitRating, updatePassword };

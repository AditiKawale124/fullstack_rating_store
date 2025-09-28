const { Rating, Store } = require('../models');

async function ownerDashboard(req, res) {
  // assume store owner has a single store; in simple design, store owner userId === owner id mapping is not created here
  // For beginner simplicity, we fetch stores that have email equal to owner email (or you can extend to store.ownerId)
  // Better approach: extend Store model with ownerId. For time, we assume owner owns a store by email match.
  const ownerEmail = req.user.email;
  const store = await Store.findOne({ where: { email: ownerEmail }});
  if (!store) return res.status(404).json({ message: 'Store not found for this owner' });

  const ratings = await Rating.findAll({ where: { storeId: store.id }, include: ['user'] });
  const avg = ratings.length ? (ratings.reduce((a,b)=>a+b.score,0)/ratings.length).toFixed(2) : null;
  res.json({ store: { id: store.id, name: store.name, address: store.address, avgRating: avg }, ratings });
}

module.exports = { ownerDashboard };

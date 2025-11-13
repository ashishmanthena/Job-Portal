const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if(!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({message:'No token'});

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(payload.userId).select('-passwordHash');
    if(!req.user) return res.status(401).json({message:'Invalid token'});
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({message:'Token invalid'});
  }
};

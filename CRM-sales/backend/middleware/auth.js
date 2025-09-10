const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Only allow managers to access everything; reps only their own (ownership handled in controllers)
const authorizeManager = (req, res, next) => {
  if (req.user.role === 'manager') return next();
  return res.status(403).json({ error: 'Only managers allowed' });
};

const authorizeOwnership = (req, res, next) => {
  if (req.user.role === 'manager') {
    
    return next();
  }
   return next();
};

module.exports = {
  authenticateToken,
  authorizeManager,
  authorizeOwnership
};

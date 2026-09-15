const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Authorization token is required.'
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'thapar_classroom_secret_jwt_key_2026_se_project';
    const decoded = jwt.verify(token, secret);

    // Try finding user in DB, or construct fallback mock object if DB offline
    try {
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
        return next();
      }
    } catch (dbErr) {
      console.warn('⚠️ DB offline during auth token check. Using token payload.');
    }

    // Fallback using decoded token fields
    req.user = {
      id: decoded.id,
      name: decoded.name || 'User',
      email: decoded.email,
      role: decoded.role || 'TEACHER',
      department: decoded.department || 'Computer Science'
    };

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authorization token.'
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user ? req.user.role : 'Guest'}' is not authorized to access this resource.`
      });
    }
    next();
  };
};

module.exports = {
  protect,
  authorize
};

// jsonwebtoken import for token verification
const jwt = require('jsonwebtoken');


//verifyToken middleware function
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token is required (please login)' 
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Token format is invalid' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    // Call next middleware/controller
    next();

  } catch (error) {
    console.error('Token verify error:', error.message);

    return res.status(401).json({
      success: false,
      message: 'Token is invalid or expired'
    });
  }
};

module.exports = { verifyToken };
const jwt = require('jsonwebtoken');

// Secret key (use environment variables for production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware function
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']; // Get the Authorization header
  const token = authHeader && authHeader.split(' ')[1]; // Extract the token after "Bearer"

  if (!token) {
    return res.status(401).json({ message: "Access denied, token missing" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    req.user = user; // Attach decoded user data to the request
    next(); // Proceed to the next middleware or route handler
  });
}

module.exports = authenticateToken;

const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(403).send("Token required");

  const token = authHeader.split(" ")[1]; // Remove "Bearer"

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret'); // Fallback if .env is missing
    req.user = decoded;
    next();
  } catch {
    res.status(401).send("Invalid Token");
  }
};

module.exports = { verifyToken };

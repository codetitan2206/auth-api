const jwt = require("jsonwebtoken");

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token is required",
    });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET,
    {
      issuer: "auth-api",
      audience: "auth-api-users",
    },
    (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({
            success: false,
            message: "Token expired",
          });
        } else if (err.name === "JsonWebTokenError") {
          return res.status(403).json({
            success: false,
            message: "Invalid token",
          });
        } else {
          return res.status(403).json({
            success: false,
            message: "Token verification failed",
          });
        }
      }

      // Add user ID to request object
      req.userId = decoded.userId;
      next();
    }
  );
};

module.exports = { authenticateToken };

const jwt = require("jsonwebtoken");

// middleware to validate token
const checkToken = (req, res, next) => {

    const token = req.header("auth-token");
  
    if (!token) return res.status(401).json({ error: "Access denied!" });
  
    try {
      const verified = jwt.verify(token, "nossosecret");
      req.user = verified;
      next(); // to continue the flow
    } catch (err) {
      res.status(400).json({ error: "Token is invalid!" });
    }
  
  };
  
  module.exports = checkToken;
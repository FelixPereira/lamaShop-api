const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if(authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET_KEY, (error, user) => {
      if(error) return res.status(403).send("Token is not valid!");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).send("You are not authenticated!");
  }
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if(req.user.isAdmin) {
      next();
    } else {
      res.status(403).send("You are not allowed to do this!");
    }
  });
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if(req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).send("You are not allowed to do this!");
    }
  });
};

module.exports = { 
  verifyToken, 
  verifyTokenAndAuthorization, 
  verifyTokenAndAdmin 
};
const jwt = require("jsonwebtoken");
require("./allowedRoutes");

const verifyToken = (req, res, next) => {
  const authHeader =
    req.body.token || req.query.token || req.headers["authorization"];
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    const response = {
      severity: "error",
      summary: "Request failed",
      detail: "Session expired",
    };
    return res.status(401).send({ toast: response });
  }
  try {
    const decoded = jwt.verify(token, 'TOKEN_KEY');
    if(!allowedRoutes[decoded.role].includes(req.headers['route']) ){
        console.log(req.headers['route'])
        return res.status(403).send("Unauthorized access");
    }
    req.user = decoded;
  } catch (err) {
    console.error("invalid token");
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;

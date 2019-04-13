/*  Purpose of this file is to grab that
    token that we sent back to the user and check if it is a valid token

    If it is valid, allow them to access the controller,
    If not, reject them

*/

const jwt = require('jsonwebtoken');

const secret = process.env.SECRET || 'somethingsomething';


// Check if token is valid

const checkToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers.authorization;
  console.log("checkToken", token);
  // Check now
  if (!token) {
    res.json({ message: 'No token found' });
  }

  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }


  // Check if token is valid
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      res.json({ message: 'Token not valid' });
    }

    req.decoded = decoded;
    next();
  });
};

module.exports = checkToken;

const jwt = require('jsonwebtoken');

function removeExpiredTokens(tokens) {
  const validTokens = tokens.filter(token => {
    try {
      jwt.verify(token.token, process.env.JWT_SECRET);
      return true;
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return false
      }
    }
  });

  return validTokens;
}

module.exports = { removeExpiredTokens }
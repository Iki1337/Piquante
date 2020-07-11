const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Récupération du token dans le header de la requête
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // Décryptage du token avec la clé renseignée
    const userId = decodedToken.userId; //UserId contenu dans le token
    if (req.body.userId && req.body.userId !== userId) { // Si le userID contenu dans la requête est different de celui du token
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};
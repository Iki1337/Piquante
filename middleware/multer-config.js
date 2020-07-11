const multer = require('multer');

const MIME_TYPES = { // Types d'images reconnues
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => { // Va stocker les images dans un dossier "images"
    callback(null, 'images');
  },
  filename: (req, file, callback) => { // Configure le nom des fichiers
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single('image');
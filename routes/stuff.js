const express = require('express');
const router = express.Router();

const StuffCtrl = require('../controllers/stuff');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post('/', auth, multer, StuffCtrl.createThing);
router.put('/:id', auth, multer, StuffCtrl.modifyThing);
router.delete('/:id', auth, StuffCtrl.deleteThing);
router.get('/:id', auth, StuffCtrl.getOneThing);
router.get('/', auth, StuffCtrl.getAllThing);
router.post('/:id/like', auth, StuffCtrl.like);

module.exports = router;
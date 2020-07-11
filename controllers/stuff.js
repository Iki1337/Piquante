const Thing = require('../models/Things');
const fs = require('fs'); // Le paquet fs permet de manipuler les fichiers

exports.createThing = (req, res, next) => { // Va permettre de créer une nouvelle sauce
  const thingObject = JSON.parse(req.body.sauce);
  delete thingObject._id;
  const thing = new Thing({
    ...thingObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes:0
  });
  thing.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneThing = (req, res, next) => { // Va permettre de récupérer les données d'une sauce
  Thing.findOne({
    _id: req.params.id
  }).then(
    (thing) => {
      res.status(200).json(thing);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifyThing = (req, res, next) => { // Permet de modifier les données d'une sauce
  const thingObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteThing = (req, res, next) => { // Permet de supprimer une sauce
  Thing.findOne({ _id: req.params.id })
    .then(thing => {
      const filename = thing.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Thing.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getAllThing = (req, res, next) => { // Permet de récupérer toutes les sauces dans la BDD
  Thing.find().then(
    (things) => {
      res.status(200).json(things);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.like = (req, res, next) => { // Permet de prendre en compte les likes et dislikes en mettant à jour la BDD

  console.log(req.body.like);

  switch (req.body.like) {

    case 1: // Si req.body.like = 1
      Thing.updateOne({ _id: req.params.id }, {$push: {usersLiked: req.body.userId}, $inc: {likes: 1}})
        .then(() => res.status(200).json({ message: 'Like modifié !'}))
        .catch(error => res.status(400).json({ error }));
      
      break;

    case -1: // Si req.body.like = -1
      Thing.updateOne({ _id: req.params.id }, {$push: {usersDisliked: req.body.userId}, $inc: {dislikes: 1}})
        .then(() => res.status(200).json({ message: 'Dislike modifié !'}))
        .catch(error => res.status(400).json({ error }));
      
      break;

    case 0: // Si req.body.like = 0
      Thing.findOne({ _id: req.params.id })
      .then(thing => {
        if (thing.usersLiked.find((user) => user === req.body.userId)) { // Si l'utilisateur avait liké
          Thing.updateOne({ _id: req.params.id }, {$pull: {usersLiked: req.body.userId}, $inc: {likes: -1}})
            .then(() => res.status(200).json({ message: 'Like modifié !'}))
            .catch(error => res.status(400).json({ error }));
        }
        if (thing.usersDisliked.find((user) => user === req.body.userId)) { // Si l'utilisateur avait disliké
          Thing.updateOne({ _id: req.params.id }, {$pull: {usersDisliked: req.body.userId}, $inc: {dislikes: -1}})
            .then(() => res.status(200).json({ message: 'Dislike modifié !'}))
            .catch(error => res.status(400).json({ error }));
        }
      })
      .catch(error => res.status(500).json({ error }));
      
      break;
  
    default:
      break;
  }
};
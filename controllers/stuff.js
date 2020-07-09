const Thing = require('../models/Things');
const fs = require('fs');

exports.createThing = (req, res, next) => {
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

exports.getOneThing = (req, res, next) => {
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

exports.modifyThing = (req, res, next) => {
  const thingObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteThing = (req, res, next) => {
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

exports.getAllThing = (req, res, next) => {
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

exports.like = (req, res, next) => {

  console.log(req.body.like);

  switch (req.body.like) {

    case 1:
      Thing.updateOne({ _id: req.params.id }, {$push: {usersLiked: req.body.userId}, $inc: {likes: 1}})
        .then(() => res.status(200).json({ message: 'Like modifié !'}))
        .catch(error => res.status(400).json({ error }));
      
      break;

    case -1:
      Thing.updateOne({ _id: req.params.id }, {$push: {usersDisliked: req.body.userId}, $inc: {dislikes: 1}})
        .then(() => res.status(200).json({ message: 'Dislike modifié !'}))
        .catch(error => res.status(400).json({ error }));
      
      break;

    case 0:
      Thing.findOne({ _id: req.params.id })
      .then(thing => {
        if (thing.usersLiked.find((user) => user === req.body.userId)) {
          Thing.updateOne({ _id: req.params.id }, {$pull: {usersLiked: req.body.userId}, $inc: {likes: -1}})
            .then(() => res.status(200).json({ message: 'Like modifié !'}))
            .catch(error => res.status(400).json({ error }));
        }
        if (thing.usersDisliked.find((user) => user === req.body.userId)) {
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

  /*if(req.body.like == 1){
    Thing.updateOne({ _id: req.params.id }, {$push: {usersLiked: req.body.userId}, $inc: {likes: 1}})
      .then(() => res.status(200).json({ message: 'Like modifié !'}))
      .catch(error => res.status(400).json({ error }));
  }

  if(req.body.like == -1){
    Thing.updateOne({ _id: req.params.id }, {$push: {usersDisliked: req.body.userId}, $inc: {dislikes: 1}})
      .then(() => res.status(200).json({ message: 'Dislike modifié !'}))
      .catch(error => res.status(400).json({ error }));
  }

  if(req.body.like == 0 && Thing.find({usersLiked: req.body.userId})){
    Thing.updateOne({ _id: req.params.id }, {$pull: {usersLiked: req.body.userId}, $inc: {likes: -1}})
      .then(() => res.status(200).json({ message: 'Like modifié !'}))
      .catch(error => res.status(400).json({ error }));
  }

  if(req.body.like == 0 && Thing.find({usersDisliked: req.body.userId})){
    Thing.updateOne({ _id: req.params.id }, {$pull: {usersDisliked: req.body.userId}, $inc: {dislikes: -1}})
      .then(() => res.status(200).json({ message: 'Dislike modifié !'}))
      .catch(error => res.status(400).json({ error }));
  }*/
};
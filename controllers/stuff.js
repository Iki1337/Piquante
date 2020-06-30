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
  console.log(req.body);
  console.log(req.params.id);

  Thing.findOne({ _id: req.params.id })
    .then(
      thing => {
        console.log(thing);
        if(req.body.like == 1){
          thing.likes += 1;
        }
        Thing.updateOne({ _id: req.params.id }, { thing, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet modifié !'}))
          .catch(error => res.status(400).json({ error }));
      }
    )
    .catch(error => res.status(500).json({ error }));

  /*Thing.findOne({ _id: req.params.id })
    .then(
      thing => {
        const object = new Thing({
          //...thing
          userId: thing.userId,
          name: thing.name,
          manufacturer: thing.manufacturer,
          description: thing.description,
          mainPepper: thing.mainPepper,
          imageUrl: thing.imageUrl,
          heat: thing.heat,
          likes: thing.likes,
          dislikes: thing.dislikes,
          usersLiked: thing.usersLiked,
          usersDisliked: thing.usersDisliked
        });
        if(req.body.like == 1){
          object.likes += 1;
          console.log(object.imageUrl);
        }
        Thing.updateOne({ _id: req.params.id }, { ...object, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet modifié !'}))
          .catch(error => res.status(400).json({ error }));
      }
    )
    .catch(error => res.status(500).json({ error }));

  /*if(req.body.like == 1){

    const thingObject = JSON.parse(req.body.like);
    Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));

  };

  /*Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
      .then(() => res.status(200).json({ message: ' Opération terminée'}))
      .catch(error => res.status(400).json({ error }));*/
};
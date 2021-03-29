const createError = require('http-errors');
const Event = require('../models/event.model');

module.exports.list = (req, res, next) => {
  const criteria = {}
  const { tags, search } = req.query;

  if (tags) {
    criteria.tags = tags
  }
  if (search) {
    criteria.title = new RegExp(search, 'i');
  }

  Event.find(criteria)
    .populate('owner', '_id name email')
    .then(events => res.json(events))
    .catch(next)
}

module.exports.get = (req, res, next) => {
  Event.findById(req.params.id)
    .populate('owner', '_id name email')
    .then(event => {
      if (event) res.json(event)
      else next(createError(404, 'Event not found'))
    })
    .catch(next)
}

module.exports.create = (req, res, next) => {
  const { location } = req.body;

  req.body.location = {
    type: 'Point',
    coordinates: location
  }
  
  Event.create(req.body)
    .then(event => res.status(201).json(event))
    .catch(error => {
      if (error.errors && error.errors['location.coordinates']) {
        error.errors.location = error.errors['location.coordinates'];
        delete error.errors['location.coordinates'];
      }
      next(error);
    })
}

module.exports.delete = (req, res, next) => {
  Event.findById(req.params.id)
    .then(event => {
      if (!event) next(createError(404, 'Event not found'))
      else if (event.owner != req.user.id) next(createError(403, 'Only the owner of the event can perform this action'))
      else return event.delete();
    }).catch(next)
}

module.exports.update = (req, res, next) => {
  const { location } = req.body;
  if (location) {
    req.body.location = {
      type: 'Point',
      coordinates: location
    }
  }
  // Remove attributes than cant be modified
  delete req.body.owner;
  delete req.body.id;
  delete req.body.createdAt;
  delete req.body.updatedAt;
  
  Event.findById(req.params.id)
    .then(event => {
      if (!event) next(createError(404, 'Event not found'))
      else if (event.owner != req.user.id) next(createError(403, 'Only the owner of the event can perform this action'))
      else {
        Object.assign(event, req.body)
        return event.save()
          .then(event => res.json(event))
      }
    }).catch(next)
}

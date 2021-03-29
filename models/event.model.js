const moment = require('moment');
const User = require('./user.model');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  title: {
    type: String,
    required: 'Title is required',
    minLength: [5, 'Title needs at least 5 characters']
  },
  description: {
    type: String,
    required: 'Description is required',
    minLength: [10, 'Description needs at least 10 characters']
  },
  image: {
    type: String,
    required: 'Image is required',
    validate: {
      validator: function (value) {
        try {
          const url = new URL(value);
          return url.protocol === 'http:' || url.protocol === 'https:'
        } catch(error) {
          return false;
        }
      },
      message: props => `Invalid image URL`
    }
  },
  capacity: {
    type: Number,
    required: 'Capacity is required',
    min: [1, 'Capacity must be grater than 0']
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: void 0,
      required: 'The location of the event is required',
      validate: {
        validator: function([lng, lat]) {
          return isFinite(lng) && isFinite(lat) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
        },
        message: props => `Invalid location coordinates`
      }
    }
  },
  start: {
    type: Date,
    required: 'Start date is required',
    validate: {
      validator: function(value) {
        return moment().startOf('day').isBefore(moment(value))
      },
      message: props => `Starting must not be in the past`
    }
  },
  end: {
    type: Date,
    required: 'End date is required',
    validate: {
      validator: function (value) {
        return moment(value).isAfter(moment(this.start)) || moment(value).isSame(moment(this.start))
      },
      message: props => `Ending must not be before the start date`
    }
  },
  tags: [String]
}, {
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      delete ret._id;
      delete ret.__v;
      ret.id = doc.id;
      ret.location = ret.location.coordinates;
      return ret;
    }
  }
});

eventSchema.index({ location: '2dsphere' });

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;

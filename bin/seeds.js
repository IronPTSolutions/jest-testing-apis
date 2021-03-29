const mongoose = require('mongoose');
const Event = require('../models/event.model');
const User = require('../models/user.model');
const eventsData = require('../data/events.json');
const usersData = require('../data/users.json');

require('../config/db.config');

mongoose.connection.once('open', () => {
  console.info(`*** Connected to the database ${mongoose.connection.db.databaseName} ***`);
  mongoose.connection.db.dropDatabase()
    .then(() => console.log(`- Database dropped`))
    .then(() => User.create(usersData))
    .then(users => {
      console.info(`- Added ${users.length} users`)
      const eventsWithOwnerIds = eventsData.map(event => {
        event.owner = users.find(user => user.email === event.owner).id;
        return event;
      })
      return Event.create(eventsWithOwnerIds)
    })
    .then(events => console.info(`- Added ${events.length} events`))
    .then(() => console.info(`- All data created!`))
    .catch(error => console.error(error))
    .then(() => process.exit(0))
})

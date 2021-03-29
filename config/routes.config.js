const express = require('express');
const router = express.Router();
const secure = require('../middlewares/secure.middleware');
const events = require('../controllers/events.controller');
const users = require('../controllers/users.controller');

router.get('/events', events.list);
router.post('/events', secure.isAuthenticated, events.create);
router.get('/events/:id', events.get);
router.delete('/events/:id', secure.isAuthenticated, events.delete);
router.put('/events/:id', secure.isAuthenticated, events.update);

router.get('/comments', comments.list);
router.post('/comments', secure.isAuthenticated, comments.create);
router.get('/comments/:id', comments.get);
router.delete('/comments/:id', secure.isAuthenticated, comments.delete);

router.post('/users', users.create);
router.get('/users/:id', secure.isAuthenticated, users.get);
router.delete('/users/:id', secure.isAuthenticated, users.delete);
router.patch('/users/:id', secure.isAuthenticated, users.update);

router.post('/login', users.login)
router.post('/logout', users.logout)

router.post('/totp', users.totp)

module.exports = router;

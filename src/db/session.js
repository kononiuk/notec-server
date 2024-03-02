const session = require('express-session');
const MongoStore = require('connect-mongo');
// ToDo: Need to change using an existing mongoose connection
sessionAdmin = session({
  name: 'admin.sid',
  secret: process.env.SESSION_SECRET_ADMIN,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URL,
    collectionName: 'adminSessions'
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    path: '/admin',
    maxAge: process.env.SESSION_EXPIRATION_ADMIN * 1000,
  }
});

sessionGuest = session({
  name: 'guest.sid',
  secret: process.env.SESSION_SECRET_GUEST,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URL,
    collectionName: 'guestSessions'
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: process.env.SESSION_EXPIRATION_GUEST * 1000,
  }
});

module.exports = { sessionAdmin, sessionGuest };
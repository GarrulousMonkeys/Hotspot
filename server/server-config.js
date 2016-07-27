import bodyParser from 'body-parser';
import path from 'path';
import session from 'express-session';
import hbs from 'express-handlebars';
import passport from 'passport';
import express from 'express';
import fs from 'fs';
import _ from 'lodash';

export default function(app, User) {
  app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'splash',
    layoutsDir: path.join(__dirname, './views/templates/'),
    partialsDir: path.join(__dirname, './views/partials/')
  }));
  app.set('views', path.join(__dirname, './views'));
  app.set('view engine', 'hbs');

  passport.serializeUser(function(user, done) {
    let userId;
    if (Array.isArray(user)) {
      userId = user[0].id;
    } else {
      userId = user.id;
    }
    return done(null, userId);
  });

  passport.deserializeUser(function(id, done) {
    return User.find({id: id})
      .then((user) => done(null, user[0]))
      .catch((err) => done(err, null));
  });

  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());

  // STATIC DIRECTORIES
  app.use(express.static(path.join(__dirname, '/../compiled')));
  app.use(express.static(path.join(__dirname, '/../index.html')));
  app.use(express.static(path.join(__dirname, '/../node_modules')));
  app.use(express.static(path.join(__dirname, '/../Client')));
  app.use(express.static(path.join(__dirname, './views')));
  app.use(session({
    secret: 'keyboard cat',
    saveUninitialized: true,
    resave: true
  }));
  app.use(passport.initialize());
  app.use(passport.session());

}
//

//

import express from 'express';
import passport from 'passport';
import { Strategy as SpotifyStrategy } from 'passport-spotify';


import { getConfig } from './config';

const app = express();
const port = 3000;

interface User {
  name: string;
}

async function start() {
  const config = await getConfig();

  console.log(config);

  passport.use(
    new SpotifyStrategy<User>(
      {
        clientID: config.spotifyClientId,
        clientSecret: config.spotifyClientSecret,
        callbackURL: config.rootUrl + '/auth/spotify/callback'
      },
      (accessToken, refreshToken, expires_in, profile, done) => {
        done(null, {name: profile.id});
      }
    )
  );

  passport.serializeUser<User, string>((user, done) => {
    done(null, JSON.stringify(user));
  });

  passport.deserializeUser<User, string>((user, done) => {
    done(null, JSON.parse(user));
  });

  app.use(passport.initialize());

  app.get('/', (req, res) => {
    console.log(req.user);
    res.send('Hello World! <a href="/auth/spotify>login</a>');
  });

  app.get(
    '/auth/spotify',
    passport.authenticate('spotify', {
      successRedirect: '/',
      failureRedirect: '/',
      failureFlash: true 
    }));

  app.get(
    '/auth/spotify/callback',
    passport.authenticate('spotify', { failureRedirect: '/' }),
    function (req, res) {
      // Successful authentication, redirect home.
      res.redirect('/');
    }
  );

  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
}

start();
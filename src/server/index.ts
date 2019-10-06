import cookieSession from 'cookie-session';
import express from 'express';
import passport from 'passport';
import { Strategy as SpotifyStrategy } from 'passport-spotify';

import { getConfig } from './config';

const app = express();
const port = 3000;

async function start() {
  const config = await getConfig();

  console.log(config);

  app.use(cookieSession({
    name: 'session',
    keys: [config.sessionKey]
  }))

  passport.use(
    new SpotifyStrategy<Express.User>(
      {
        clientID: config.spotifyClientId,
        clientSecret: config.spotifyClientSecret,
        callbackURL: config.rootUrl + '/auth/spotify/callback'
      },
      (accessToken, refreshToken, expires_in, profile, done) => {
        done(null, { name: profile.displayName, accessToken, refreshToken });
      }
    )
  );

  passport.serializeUser<Express.User, string>((user, done) => {
    done(null, JSON.stringify(user));
  });

  passport.deserializeUser<Express.User, string>((user, done) => {
    done(null, JSON.parse(user));
  });

  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/', (req, res) => {
    const user = req.user;
    console.log(req.user);
    const name = user ? user.name : ' World';
    res.send(`Hello ${name}! <a href="/auth/spotify">login</a>`);
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
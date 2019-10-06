import cookieSession from 'cookie-session';
import express from 'express';
import expressWs from 'express-ws';
import passport from 'passport';
import { Strategy as SpotifyStrategy } from 'passport-spotify';

import { getConfig } from './config';

const a = express();
expressWs(a);
type App = typeof a & expressWs.WithWebsocketMethod;
const app = a as App;

const port = 3000;

async function start() {
  const config = await getConfig();

  console.log(config);

  app.use(cookieSession({
    keys: [config.sessionKey],
    name: 'session',
  }));

  passport.use(
    new SpotifyStrategy<Express.User>(
      {
        callbackURL: config.rootUrl + '/auth/spotify/callback',
        clientID: config.spotifyClientId,
        clientSecret: config.spotifyClientSecret,
      },
      (accessToken, refreshToken, _expires_in, profile, done) => {
        done(null, { name: profile.displayName, accessToken, refreshToken });
      },
    ),
  );

  passport.serializeUser<Express.User, string>((user, done) => {
    done(null, JSON.stringify(user));
  });

  passport.deserializeUser<Express.User, string>((user, done) => {
    done(null, JSON.parse(user));
  });

  app.use(passport.initialize());
  app.use(passport.session());

  app.use('/static', express.static('build/static'));

  app.get('/', (req, res) => {
    const user = req.user;
    console.log(req.user);
    const name = user ? user.name : ' World';
    res.send(`Hello ${name}! <a href="/auth/spotify">login</a>`);
  });

  app.get(`/${config.playerKey}`, (req, res) => {
    // Load the player code
    res.send(`<script src="/static/player.js"></script>`);
  });

  app.ws(`*`, (ws, req) => {
    if (req.path.indexOf(config.playerKey) !== -1) {
      // Valid player connection
      console.log('connection', req.path);
      ws.on('message', (msg) => {
        console.log(msg);
        ws.send(msg);
      });
    } else {
      ws.close();
    }
  });

  app.get(
    '/auth/spotify',
    passport.authenticate('spotify', {
      failureFlash: true,
      failureRedirect: '/',
      successRedirect: '/',
    }));

  app.get(
    '/auth/spotify/callback',
    passport.authenticate('spotify', { failureRedirect: '/' }),
    (_req, res) => res.redirect('/'),
  );

  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
}

start();

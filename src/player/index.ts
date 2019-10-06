import * as messages from '../shared/player-messages';

import * as spotifySdk from './spotify-sdk';

interface ActivePlayer {
  token: string;
  player: Spotify.SpotifyPlayer;
}

// TODO: get name from server
const NAME = 'SPOTIFY SERVER';

spotifySdk.spotifyWebPlaybackSDKReady.then(spotify => {

  const activePlayers = new Map<string, ActivePlayer>();

  function setupPlayer(player: Spotify.SpotifyPlayer) {
    console.log('setupPlayer');

    player.addListener('initialization_error', ({ message }) => { console.error(message); });
    player.addListener('authentication_error', ({ message }) => { console.error(message); });
    player.addListener('account_error', ({ message }) => { console.error(message); });
    player.addListener('playback_error', ({ message }) => { console.error(message); });

    player.addListener('player_state_changed', state => {
      console.log('player state changed', state);
    });

    // Ready
    player.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id);
    });

    // Connect to the player!
    player.connect();
  }

  function updateActivePlayers(msg: messages.TokensUpdatedMessage) {
    for (const id of Object.keys(msg.tokens)) {
      const token = msg.tokens[id];
      let player = activePlayers.get(id);
      if (!player) {
        // Create player
        console.log('creating player for ' + id);
        player = {
          player: new spotify.Player({
            getOAuthToken: (cb: (token: string) => void) => cb(token.token),
            name: NAME,
          }),
          token: token.token,
        };
        setupPlayer(player.player);
        activePlayers.set(id, player);
      } else {
        // TODO: replace player
        // (needed when token refreshing is implemented)
      }
    }
  }

  function start() {
    const ws = new WebSocket(`ws://${location.host}/${location.pathname}`);

    ws.addEventListener('close', () => {
      console.log('Socket Closed, reconnecting in 1 second');
      setTimeout(start, 1000);
    });

    ws.addEventListener('error', err => {
      console.error(err);
    });

    ws.addEventListener('open', () => {
      console.log('open!');
      ws.send('foo');
    });

    ws.addEventListener('message', msg => {
      console.log(msg);
      const m: messages.ServerMessage = JSON.parse(msg.data);
      if (m.type === 'tokens-updated') {
        updateActivePlayers(m);
      }
    });

  }

  start();
});

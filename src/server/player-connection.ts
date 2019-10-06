import * as WebSocket from 'ws';

import * as messages from '../shared/player-messages';

import { Config } from './config';
import { DataManager, TokenListener } from './data';

export function initializePlayerConnection(config: Config, ws: WebSocket, data: DataManager) {
  console.log('new connection!');
  const tokenListener: TokenListener = ts => {
    const tokens: { [id: string]: {token: string}} = {};
    ts.forEach((token, id) => tokens[id] = { token: token.accessToken});
    const msg: messages.TokensUpdatedMessage = {
      tokens,
      type: 'tokens-updated',
    };
    ws.send(JSON.stringify(msg));
  };

  data.addListener(tokenListener);

  ws.on('message', (msg) => {
    console.log(msg);
  });

  ws.on('close', () => {
    data.removeListener(tokenListener);
  });

  const settingsMessage: messages.SettingsMessages = {
    serverName: config.serverName,
    type: 'settings',
  };
  ws.send(JSON.stringify(settingsMessage));
}

import * as WebSocket from 'ws';

import * as messages from '../shared/player-messages';

import { DataManager, Token, TokenListener } from './data';

export function initializePlayerConnection(ws: WebSocket, data: DataManager) {
  console.log('new connection!');
  const tokenListener: TokenListener = ts => {
    const tokens: { [id: string]: {accessToken: string}} = {};
    ts.forEach((token, id) => tokens[id] = {accessToken: token.accessToken});
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
    // TODO: test
    // data.removeListener(tokenListener);
  });
}

export interface SettingsMessages {
  type: 'settings';
  serverName: string;
}

export interface TokensUpdatedMessage {
  type: 'tokens-updated';
  tokens: {[id: string]: {
    token: string;
  }};
}

export type ServerMessage = SettingsMessages | TokensUpdatedMessage;

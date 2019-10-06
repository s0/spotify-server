export interface TokensUpdatedMessage {
  type: 'tokens-updated';
  tokens: {[id: string]: {
    accessToken: string;
  }};
}

export type ServerMessage = TokensUpdatedMessage;

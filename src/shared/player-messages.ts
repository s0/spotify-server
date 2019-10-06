export interface TokensUpdatedMessage {
  type: 'tokens-updated';
  tokens: {[id: string]: {
    token: string;
  }};
}

export type ServerMessage = TokensUpdatedMessage;

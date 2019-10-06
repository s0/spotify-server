export interface Token {
  accessToken: string;
  refreshToken: string;
}

export type TokenListener = (tokens: Map<string, Token>) => void;

/**
 * TODO: store these in a database
 */
export class DataManager {
  /**
   * Map from spotify ids to tokens
   */
  private readonly activeTokens = new Map<string, Token>();

  private readonly listeners = new Set<TokenListener>();

  /**
   * @param id User's spotify id
   * @param token Call this when a user authenticates
   */
  public addNewToken(id: string, token: Token) {
    this.activeTokens.set(id, token);
    this.listeners.forEach(l => l(this.activeTokens));
  }

  public addListener(listener: TokenListener) {
    this.listeners.add(listener);
    listener(this.activeTokens);
  }

  public removeListener(listener: TokenListener) {
    this.listeners.delete(listener);
  }
}

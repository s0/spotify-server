import * as fs from 'fs';
import {promisify} from 'util';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

export interface Token {
  accessToken: string;
  refreshToken: string;
}

export type TokenListener = (tokens: Map<string, Token>) => void;

interface Database {
  activeTokens: {[id: string]: Token};
}

/**
 * TODO: store these in a database
 */
export class DataManager {
  private readonly dataFilePath: string;

  /**
   * True when the initial database has been loaded
   */
  private ready = false;

  /**
   * Map from spotify ids to tokens
   */
  private readonly activeTokens = new Map<string, Token>();

  private readonly listeners = new Set<TokenListener>();

  constructor(dataFilePath: string) {
    this.dataFilePath = dataFilePath;
  }

  public async initialize() {
    await this.loadData().catch(() => {
      console.log('No data yet, setting up empty database');
      return this.storeData();
    });
    this.ready = true;
  }

  /**
   * @param id User's spotify id
   * @param token Call this when a user authenticates
   */
  public addNewToken(id: string, token: Token) {
    if (!this.ready) throw new Error('DataManager not ready yet');
    this.activeTokens.set(id, token);
    this.listeners.forEach(l => l(this.activeTokens));
    this.storeData();
  }

  public addListener(listener: TokenListener) {
    this.listeners.add(listener);
    listener(this.activeTokens);
  }

  public removeListener(listener: TokenListener) {
    this.listeners.delete(listener);
  }

  private async loadData() {
    const contents = await readFile(this.dataFilePath);
    const db: Database = JSON.parse(contents.toString());
    for (const id of Object.keys(db.activeTokens)) {
      this.activeTokens.set(id, db.activeTokens[id]);
    }
  }

  private async storeData() {
    const database: Database = {
      activeTokens: {},
    };
    this.activeTokens.forEach((token, id) => database.activeTokens[id] = token);
    await writeFile(this.dataFilePath, JSON.stringify(database));
  }
}

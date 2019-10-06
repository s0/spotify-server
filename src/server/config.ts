import * as fs from 'fs';
import {promisify} from 'util';

import { CONFIG_PATH } from './paths';

const readFile = promisify(fs.readFile);

export interface Config {
  serverName: string;
  spotifyClientId: string;
  spotifyClientSecret: string;
  rootUrl: string;
  sessionKey: string;
  playerKey: string;
}

function isConfig(config: any): config is Config {
  if (!config) return false;
  if ((typeof config.serverName) !== 'string') {
    console.error('missing or invalid serverName');
    return false;
  }
  if ((typeof config.spotifyClientId) !== 'string') {
    console.error('missing or invalid spotifyClientId');
    return false;
  }
  if (typeof config.spotifyClientSecret !== 'string') {
    console.error('missing or invalid invalid spotifyClientSecret');
    return false;
  }
  if (typeof config.rootUrl !== 'string') {
    console.error('missing or invalid invalid rootUrl');
    return false;
  }
  if (typeof config.sessionKey !== 'string') {
    console.error('missing or invalid invalid sessionKey');
    return false;
  }
  if (typeof config.playerKey !== 'string') {
    console.error('missing or invalid invalid playerKey');
    return false;
  }
  return true;
}

export async function getConfig() {
  console.log('Loading config from: ', CONFIG_PATH);
  const contents = await readFile(CONFIG_PATH);
  const conf = JSON.parse(contents.toString());
  if (!isConfig(conf)) throw new Error('Invalid Config');

  // Remove trailing slashes from rootUrl
  conf.rootUrl = conf.rootUrl.replace(/\/*$/, '');

  return conf;
}

import * as fs from 'fs';
import * as path from 'path';
import {promisify} from 'util';

const readFile = promisify(fs.readFile);

const CONFIG_PATH = path.join(path.dirname(path.dirname(__dirname)), 'config.json');

interface Config {
  spotifyClientId: string;
  spotifyClientSecret: string;
  rootUrl: string;
  sessionKey: string;
  playerKey: string;
}

function isConfig(config: any): config is Config {
  if (!config) return false;
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

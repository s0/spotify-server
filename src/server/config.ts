import * as fs from 'fs';
import * as path from 'path';
import {promisify} from 'util';

const readFile = promisify(fs.readFile);

const CONFIG_PATH = path.join(path.dirname(path.dirname(__dirname)), 'config.json');

interface Config {
  spotifyClientId: string;
  spotifyClientSecret: string;
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
  return true;
}

export async function getConfig() {
  console.log('Loading config from: ', CONFIG_PATH);
  const contents = await readFile(CONFIG_PATH);
  const conf = JSON.parse(contents.toString());
  if (isConfig(conf)) return conf;
  throw new Error('Invalid Config');
}

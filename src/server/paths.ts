import * as path from 'path';

const REPO_ROOT = path.dirname(path.dirname(__dirname));

export const CONFIG_PATH = path.join(REPO_ROOT, 'config.json');
export const DATA_PATH = path.join(REPO_ROOT, 'data.json');

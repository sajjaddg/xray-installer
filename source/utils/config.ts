import { execSync } from 'child_process';
import fs from 'fs';
import { Config } from '../types/index.js';

export const fetchConfig = async (type: string): Promise<Config> => {
  const jsonUrl = type === 'tcp' 
    ? 'https://raw.githubusercontent.com/sajjaddg/xray-reality/master/tcp-config.json'
    : 'https://raw.githubusercontent.com/sajjaddg/xray-reality/master/config.json';

  execSync(`curl -s ${jsonUrl} -o config.json`);
  return JSON.parse(fs.readFileSync('config.json', 'utf8'));
};

export const generateServerConfig = () => {
  const keys = execSync('xray x25519').toString();
  const pk = keys.match(/Private key:\s*(\S+)/)?.[1] ?? '';
  const pub = keys.match(/Public key:\s*(\S+)/)?.[1] ?? '';
  const serverIp = execSync('curl -s ipv4.wtfismyip.com/text').toString().trim();
  const uuid = execSync('xray uuid').toString().trim();
  const shortId = execSync('openssl rand -hex 8').toString().trim();

  return { pk, pub, serverIp, uuid, shortId };
};
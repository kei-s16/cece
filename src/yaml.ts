import * as yaml from 'js-yaml';
import fs from 'fs'
import * as crypto from 'crypto';
import { encrypt, decrypt, encryptBase64, decryptBase64 } from './crypto';

const ALGO = 'camellia-256-cbc'

type EncryptData = {[feald: string]: {
  encrypt: string;
  algorithm: string;
  salt: string;
}}

type DecryptData = {[feald: string]: string}

const encryptyYaml = (yamlString: string, password: string): string => {
  const b: EncryptData = {};
  yamlString.split(/\n|\r|\r\n/).map((line) => {
    const v = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
    if (v != null) {
      const salt = crypto.randomBytes(32)
      return {
        key: v[1],
        value: {
          encrypt: encrypt(ALGO, password, salt, v[2] || ''),
          algorithm: ALGO,
          salt: encryptBase64(salt),
        }
      }
    }
    return null;
  }).forEach((v) => {
    if(v !== null) {
      b[v.key] = v.value;
    }
  })
  return yaml.dump(b);
}

const decryptyYaml = (yamlString: string, password: string): string => {
  const b = Object.entries(<EncryptData>yaml.load(yamlString)).map((v) => {
    if (v[1] === undefined) {
      throw new Error();
    }
    return {
      key: v[0],
      value: decrypt(v[1].algorithm ,password, decryptBase64(v[1].salt), v[1].encrypt),
    }
  }).map((v) => `${v.key}=${v.value}`);
  return b.join('\n');
}

const e = encryptyYaml(fs.readFileSync('a', {encoding: 'utf8'}),'abc');
fs.writeFileSync('b', e);
const d = decryptyYaml(fs.readFileSync('b', {encoding: 'utf8'}), 'abc');
console.log(d);

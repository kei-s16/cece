import { encrypt, decrypt } from './crypto';

const ALGO = 'camellia-256-cbc'
const HASH = 'sha256'
const SALT = 'abcdefgh'
const ITER = 100000

const PASSWORD = 'a'
const MESSAGE = 'piyopiyo'


console.log('MESSAGE:', MESSAGE)

const data = Buffer.from(MESSAGE, 'utf-8')
console.log('data:', data.toString('base64'))

const encryptedData = encrypt(ALGO, HASH, PASSWORD, SALT, ITER, MESSAGE)
console.log('encryptedData:', encryptedData)
const decryptedData = decrypt(ALGO, HASH, PASSWORD, SALT, ITER, encryptedData)
console.log('decryptedData:', decryptedData)

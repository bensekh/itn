# Integer to base-N string

Use this tools to encode a number into a non-standard base-n number in string.
### Install the package
```sh
npm i bensekh/itn
```
### Usage
Save as `index.js`:
```javascript
const { intToN, nToInt, luhn } = require('itn');

const num = 123456789;
const base62 = intToN(num, 62);

// base62
console.log('base-62:', base62);
console.log('decoded back to number:', nToInt(base62, 62));

// base25 custom chars
const base25 = intToN(num, 25, '0123456789ABCFGIKLMNPQRST');
console.log('base-25:', base25);
console.log('decoded back to number:', nToInt(base25, 25, '0123456789ABCFGIKLMNPQRST'));

// luhn checksum
const checksum = luhn('TH3STR1NG', 36);
console.log('Checksum of "TH3STR1NG":', checksum);
```
### Run the script
```sh
node index.js
```
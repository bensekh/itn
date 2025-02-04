'use strict';

module.exports = {
  intToN: (val, n, chars) => {
    _valNum(val);
  
    _nNum(n);
  
    chars = _obtainChars(n, chars);
  
    return _intToN(val, n, chars);
  },  
  nToInt: (val, n, chars) => {
    _valStr(val);
  
    _nNum(n);
    
    chars = _obtainChars(n, chars);
  
    _valStrChars(val, chars);
  
    return _nToInt(val, n, chars);
  },  
  luhn: (val, n, chars) => {
    _valStr(val);
  
    _nNum(n);
  
    chars = _obtainChars(n, chars);
  
    return _luhn(val, n, chars);
  }
}

function _valNum(val) {
  if (typeof val !== 'number' && typeof val !== 'bigint')
    throw new Error('Invalid type of val (not a number)');
  
  if (typeof val === 'number') {
    if (!Number.isInteger(val))
      throw new Error('Invalid number of val (not an integer)');
    if (!Number.isSafeInteger(val))
      throw new Error('Invalid integer type (not a safe integer). Use BigInt instead!');
  }

  if (val < 0)
    throw new Error('Invalid val range (val < 0)');
}

function _valStr(val) {
  if (typeof val !== 'number' && typeof val !== 'string')
    throw new Error('Invalid type of val (number or string expected)');

  if (typeof val === 'number' && !Number.isInteger(val))
    throw new Error('Invalid number of val (decimal is not allowed)');
}

function _nNum(n) {
  if (typeof n !== 'number')
    throw new Error('Invalid type of n (not a number)');

  if (!Number.isInteger(n))
    throw new Error('Invalid number of n (not an integer)');

  if (n < 2)
    throw new Error('Invalid n (minimum is 2)');

  if (n > 62)
    throw new Error('Invalid n (maximum is 62)');
}

function _obtainChars(n, chars) {
  if (chars !== undefined) {
    _charsChk(n, chars);
  } else {
    // Chars not defined, generate default by n
    chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.substring(0,n);
  }

  return chars;
}

function _charsChk(n, chars) {
  // Chars defined
  if (typeof chars !== 'string')
    throw new Error('Invalid type of chars (not a string)');

  if (n !== chars.length)
    throw new Error('Invalid n or chars (length not equal)');

  // find duplicate
  for (let i = 0; i<n; i++)
    if (chars.slice(i+1).indexOf(chars[i]) >= 0)
      throw new Error(`Invalid chars (\"${chars[i]}\" is duplicate)`);
}

function _valStrChars(val, chars) {
  val = '' + val;

  if (val[0] === '-')
    throw new Error('Invalid number of val (cannot decode negative number)');

  let charsChk = chars;
  const valChk = [];

  for (let i=0; i<val.length; i++) {
    if (valChk.indexOf(val[i]) > -1)
      continue;

    let idx = charsChk.indexOf(val[i]);

    if (charsChk.indexOf(val[i]) < 0)
      throw new Error(`Invalid val or chars (\"${val[i]}\" not defined in chars)`);
    else {
      charsChk = charsChk.slice(0,idx) + charsChk.slice(idx + 1);
      valChk.push(val[i]);
    }
  }
}

function _intToN(val, n, chars) {
  let divRes = val;
  const remainders = [];
  
  while (true) {
    if (divRes < n) {
      remainders.unshift(divRes);
      break;
    }

    if (typeof val === 'number') {
      remainders.unshift(divRes % n);
      divRes = Math.floor(divRes / n);
    } else if (typeof val === 'bigint') {
      remainders.unshift(Number(BigInt(divRes) % BigInt(n)));
      divRes = BigInt(divRes) / BigInt(n);
    }
  }

  return remainders.reduce((p,c) => p += chars[c], '');
}

function _nToInt(val, n, chars) {
  let valNum = 0;

  for (let i=0; i<val.length; i++) {
    if (typeof valNum === 'number') {
      if (Number.isSafeInteger(valNum + chars.indexOf(val[i]) * Math.pow(n,val.length-1-i)))
        valNum += chars.indexOf(val[i]) * Math.pow(n,val.length-1-i);
      else {
        valNum = BigInt(valNum);
        --i;
      }
    } else if (typeof valNum === 'bigint') {
      valNum += BigInt(chars.indexOf(val[i])) * BigInt(Math.pow(n,val.length-1-i));
    }

  }

  return valNum;
}

function _luhn(val, n, chars) {
  val = '' + val;
  const valMultiplied = [];

  for (let i = 0; i<val.length; i++) {
    if ((i+1)%2>0)
      valMultiplied.push(_intToN(chars.indexOf(val[i])*2, n, chars));
    else
      valMultiplied.push(_intToN(chars.indexOf(val[i]), n, chars));
  }
  
  let vmStr = valMultiplied.join(''); // string

  while (vmStr.length > 1) {
    let sum = vmStr.split('').reduce((p,v) => p += _nToInt(v, n, chars), 0);
    vmStr = _intToN(sum, n, chars);
  }

  return vmStr;
}
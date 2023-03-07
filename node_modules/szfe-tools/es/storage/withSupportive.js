import root from '../globalThis';
import isExist from '../isExist';
var isStorageSupported = true;
var TEST_KET = '__testSupportive__';
var storage = root.localStorage;

if (!isExist(storage)) {
  isStorageSupported = false;
}

try {
  storage.setItem(TEST_KET, '__testSupportive__');
  storage.removeItem(TEST_KET);
} catch (err) {
  isStorageSupported = false;
}

export default function withSupportive(func) {
  if (!isStorageSupported) {
    return function () {
      return console.warn('Storage unsupported');
    };
  }

  return func;
}
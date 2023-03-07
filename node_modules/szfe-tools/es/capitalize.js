import isString from './isString';
export default function capitalize(word) {
  if (!isString(word)) {
    return '';
  }

  if (/\s/.test(word)) {
    return word.split(' ').map(capitalize).join(' ');
  }

  return word.split('').map(function (letter, idx) {
    return idx === 0 ? letter.toUpperCase() : letter;
  }).join('');
}
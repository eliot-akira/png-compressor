/**
 * Escape/unescape from https://github.com/zloirock/core-js
 */

const FunctionPrototype = Function.prototype
const call = FunctionPrototype.call
// eslint-disable-next-line es/no-function-prototype-bind -- safe
const uncurryThis = FunctionPrototype.bind.bind(call, call)

const fromCharCode = String.fromCharCode
const charAt = uncurryThis(''.charAt)
const charCodeAt = uncurryThis(''.charCodeAt)
const exec = uncurryThis(/./.exec)
const stringSlice = uncurryThis(''.slice)
const numberToString = uncurryThis((1.0).toString)
const toUpperCase = uncurryThis(''.toUpperCase)

const raw = /[\w*+\-./@]/
const hex2 = /^[\da-f]{2}$/i
const hex4 = /^[\da-f]{4}$/i

function hex(code, length) {
  let result = numberToString(code, 16)
  while (result.length < length) result = '0' + result
  return result
}

export function escape(string) {
  const str = String(string)
  const length = str.length
  let result = ''
  let index = 0
  let chr, code
  while (index < length) {
    chr = charAt(str, index++)
    if (exec(raw, chr)) {
      result += chr
    } else {
      code = charCodeAt(chr, 0)
      if (code < 256) {
        result += '%' + hex(code, 2)
      } else {
        result += '%u' + toUpperCase(hex(code, 4))
      }
    }
  }
  return result
}

export function unescape(string) {
  const str = String(string)
  const length = str.length
  let result = ''
  let index = 0
  let chr, part
  while (index < length) {
    chr = charAt(str, index++)
    if (chr === '%') {
      if (charAt(str, index) === 'u') {
        part = stringSlice(str, index + 1, index + 5)
        if (exec(hex4, part)) {
          result += fromCharCode(parseInt(part, 16))
          index += 5
          continue
        }
      } else {
        part = stringSlice(str, index, index + 2)
        if (exec(hex2, part)) {
          result += fromCharCode(parseInt(part, 16))
          index += 2
          continue
        }
      }
    }
    result += chr
  }
  return result
}

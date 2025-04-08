/**
 * Convert string to Uint8Array and back
 * @module
 */

/**
 * Convert string to Uint8Array
 */
export function stringToUint8Array(str: string): Uint8Array {
  const ret = new Uint8Array(str.length)
  for (let i = 0; i < str.length; i++) {
    ret[i] = str.charCodeAt(i)
  }
  return ret
}

/**
 * Convert Uint8Array to string
 */
export function uInt8ArrayToString(binArray: Uint8Array): string {
  let str = ''
  for (let i = 0; i < binArray.length; i++) {
    str += String.fromCharCode(binArray[i])
  }
  return str
}

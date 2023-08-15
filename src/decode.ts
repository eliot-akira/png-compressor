import { decodeBufferFromPng } from './png.js'
import { decompressAsArrayBuffer } from './compress.js'
import { arrayBufferToValue } from './json-array-buffer.js'

/**
 * Decode PNG image data to JSON-serializable value
 */
export async function decode(buffer: ArrayBuffer): Promise<any> {
  return arrayBufferToValue(
    await decompressAsArrayBuffer(
      await decodeBufferFromPng(buffer), // Decode PNG to array buffer
    ),
  )
}

/**
 * Decode PNG image data to array buffer
 */
export async function decodeBuffer(buffer: ArrayBuffer): Promise<ArrayBuffer> {
  return await decompressAsArrayBuffer(await decodeBufferFromPng(buffer))
}

import { decodeBinaryFromPng } from './png.ts'
import { decompressAsArrayBuffer } from './compress.ts'
import { arrayBufferToValue } from './json-array-buffer.ts'

/**
 * Decode image data to JSON-serializable value
 */
export async function decode(buffer: ArrayBuffer): Promise<any> {
  return arrayBufferToValue(await decodeBinary(buffer))
}

/**
 * Decode image data to array buffer
 */
export async function decodeBinary(buffer: ArrayBuffer): Promise<ArrayBuffer> {
  return await decompressAsArrayBuffer(await decodeBinaryFromPng(buffer))
}

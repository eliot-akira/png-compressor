import { decodeBinaryFromPng } from './png.ts'
import { decompressAsArrayBuffer } from './compress.ts'
import { arrayBufferToValue } from './json-array-buffer.ts'
import { decodeImageDataBlocks } from './data-blocks.ts'

/**
 * Decode image colors data to JSON-serializable value
 */
export async function decodeImageData(buffer: Uint8Array | ArrayBuffer) {
  return arrayBufferToValue(await decodeImageDataBinary(buffer))
}

/**
 * Decode image colors data to array buffer
 */
export async function decodeImageDataBinary(buffer: Uint8Array | ArrayBuffer) {
  return await decompressAsArrayBuffer(await decodeBinaryFromPng(buffer))
}

/**
 * Decode image metadata including data blocks
 */
export async function decodeImageMetadata(buffer: Uint8Array | ArrayBuffer) {
  return await decodeImageDataBlocks(buffer)
}

// Deprecate

/**
 * Decode image data to JSON-serializable value
 * @deprecated Use `decodeImageData`
 */
export async function decode(buffer: ArrayBuffer) {
  return await decodeImageData(buffer)
}

/**
 * Decode image data to array buffer
 * @deprecated Use `decodeImageDataBinary`
 */
export async function decodeBinary(buffer: ArrayBuffer) {
  return await decodeImageDataBinary(buffer)
}

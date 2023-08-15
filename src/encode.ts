import { encodeBufferToPng, encodeBufferToBlob } from './png.js'
import { compress } from './compress.js'
import { valueToArrayBuffer } from './json-array-buffer.js'
import { createImage } from './image/index.js'

/**
 * Encode JSON-serializable value to PNG image data as array buffer
 */
export async function encode(value: any): Promise<ArrayBuffer> {
  return await encodeBufferToPng(await compress(valueToArrayBuffer(value)))
}

/**
 * Encode JSON-serializable value to PNG image data as blob
 */
export async function encodeToBlob(value: any): Promise<Blob> {
  return await encodeBufferToBlob(await compress(valueToArrayBuffer(value)))
}

/**
 * Encode JSON-serializable value to HTML image element
 */
export async function encodeToImage(value: any, image?: HTMLImageElement): Promise<HTMLImageElement> {
  return createImage(await encodeToBlob(value), image)
}

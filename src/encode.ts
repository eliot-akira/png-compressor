import { encodeBinaryToPng, encodeBinaryToBlob } from './png.ts'
import { compress } from './compress.ts'
import { valueToArrayBuffer } from './json-array-buffer.ts'
import { blobToImageElement } from './image.ts'

/**
 * Encode JSON-serializable value to image data
 */
export async function encode(value: any): Promise<ArrayBuffer> {
  return await encodeBinary(valueToArrayBuffer(value))
}

/**
 * Encode JSON-serializable value to image data as blob
 */
export async function encodeToBlob(value: any): Promise<Blob> {
  return await encodeBinaryToBlob(await compress(valueToArrayBuffer(value)))
}

/**
 * Encode JSON-serializable value to HTML image element
 */
export async function encodeToImage(
  value: any,
  image?: HTMLImageElement,
): Promise<HTMLImageElement> {
  return blobToImageElement(await encodeToBlob(value), image)
}

/**
 * Encode binary data to image
 */
export async function encodeBinary(buffer: ArrayBuffer): Promise<ArrayBuffer> {
  return await encodeBinaryToPng(await compress(buffer))
}

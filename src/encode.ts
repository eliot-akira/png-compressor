import { encodeBufferToPng, encodeBufferToCanvasBlob } from './png/encode.js'
import { compress } from './compress.js'
import { valueToArrayBuffer } from './json-array-buffer.js'

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
  return await encodeBufferToCanvasBlob(
    await compress(valueToArrayBuffer(value)),
  )
}

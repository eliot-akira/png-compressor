import { decodePng, encodePng, KnownChunkTypes } from './png-codec/index.ts'
import { encodeDataIntoImage, decodeDataFromImage } from './image.ts'

export * from './png-codec/index.ts'

/**
 * Encode binary as image data
 */
export async function encodeBinaryToPng(
  buffer: ArrayBuffer,
): Promise<ArrayBuffer> {
  const data = new Uint8Array(buffer)
  const size = Math.ceil(Math.sqrt(data.length / 3 + 1))

  /**
   * Equivalent to new ImageData(size, size)
   */
  const target = new Uint8ClampedArray(size * size * 4) // RGBA

  encodeDataIntoImage(data, target)

  const arr = await encodePng({
    width: size,
    height: size,
    data: new Uint8Array(target.buffer),
  })

  return arr.data.buffer as ArrayBuffer
}

/**
 * Encode binary as canvas blob
 */
export async function encodeBinaryToBlob(buffer: ArrayBuffer): Promise<Blob> {
  const png = await encodeBinaryToPng(buffer)
  const blob = new Blob([png], {
    type: 'image/png',
  })
  return blob
}

/**
 * Decode binary from image data
 */
export async function decodeBinaryFromPng(
  buffer: ArrayBuffer,
): Promise<ArrayBuffer> {
  if (!(buffer instanceof ArrayBuffer)) {
    throw new Error('Expected ArrayBuffer but got ' + typeof buffer)
  }

  const decoded = await decodePng(new Uint8Array(buffer))

  return decodeDataFromImage(new Uint8ClampedArray(decoded.image.data.buffer))
}

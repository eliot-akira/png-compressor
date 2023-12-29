import { encode as encodePng, decode as decodePng } from 'fast-png'
import { encodeDataIntoImage, decodeDataFromImage } from './image.ts'

/**
 * Encode binary as image data
 */
export async function encodeBinaryToPng(
  buffer: ArrayBuffer,
): Promise<ArrayBuffer> {
  const data = new Uint8Array(buffer)
  const size = Math.ceil(Math.sqrt(data.length / 3 + 1))

  const imageData = new ImageData(size, size)

  encodeDataIntoImage(data, imageData.data)

  const arr = encodePng({
    width: size,
    height: size,
    data: imageData.data,
  })

  return arr.buffer
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

  const decoded = decodePng(buffer)

  return decodeDataFromImage(new Uint8ClampedArray(decoded.data.buffer))
}

import {
  encodeDataIntoImage,
  blobToImageElement,
  decodeDataFromImage,
  getImageData,
} from './image/index.ts'

/**
 * Encode binary as image data
 */
export async function encodeBinaryToPng(
  buffer: ArrayBuffer,
): Promise<ArrayBuffer> {
  const blob = await encodeBinaryToBlob(buffer)
  return await blob.arrayBuffer()
}

/**
 * Encode binary as canvas blob
 */
export async function encodeBinaryToBlob(buffer: ArrayBuffer): Promise<Blob> {
  const data = new Uint8Array(buffer)

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const size = Math.ceil(Math.sqrt(data.length / 3 + 1))

    canvas.width = size
    canvas.height = size

    const image = ctx?.getImageData(0, 0, size, size)!

    encodeDataIntoImage(data, image.data)

    ctx?.putImageData(image, 0, 0)

    canvas.toBlob((blob) => {
      if (!blob) reject(new Error('Canvas failed to create blob'))
      else resolve(blob)
    }, 'image/png')
  })
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

  const blob = new Blob([buffer])
  const image = await blobToImageElement(blob)

  return decodeDataFromImage(getImageData(image))
}

import {
  encodeDataIntoImage,
  blobToImage,
  decodeDataFromImage,
  imageElementToData,
} from './image/index.js'

/**
 * Encode data as PNG
 */
export async function encodeBufferToPng(
  buffer: ArrayBuffer,
): Promise<ArrayBuffer> {
  const blob = await encodeBufferToBlob(buffer)
  return await blob.arrayBuffer()
}

export async function encodeBufferToBlob(buffer: ArrayBuffer): Promise<Blob> {
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
 * Decode data from PNG
 */
export async function decodeBufferFromPng(
  buffer: ArrayBuffer,
): Promise<ArrayBuffer> {
  const blob = new Blob([buffer])
  const image = await blobToImage(blob)
  return decodeDataFromImage(imageElementToData(image))
}

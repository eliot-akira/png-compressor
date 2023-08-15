/**
 * Encode data as PNG (4 GiB maximum).
 */
export async function encodeBufferToPng(
  buffer: ArrayBuffer,
): Promise<ArrayBuffer> {
  const blob = await encodeBufferToCanvasBlob(buffer)
  return await blob.arrayBuffer()
}

export async function encodeBufferToCanvasBlob(
  buffer: ArrayBuffer,
): Promise<Blob> {
  const data = new Uint8Array(buffer)

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const size = Math.ceil(Math.sqrt(data.length / 3 + 1))
    const w = (canvas.width = size)
    const h = (canvas.height = size)
    const image = ctx?.getImageData(0, 0, w, h)!

    dataToImage(data, image.data)

    ctx?.putImageData(image, 0, 0)

    canvas.toBlob((blob) => {
      if (!blob) reject(new Error('Canvas failed to create blob'))
      else resolve(blob)
    }, 'image/png')
  })
}

export function dataToImage(data: Uint8Array, img: Uint8ClampedArray) {
  for (let i = 0, size = data.length; i < 3; i++) {
    img[i] = (size / Math.pow(256, i)) % 256 | 0
  }
  img[3] = 255
  for (let i = 4, j = 0, l = img.length; i < l; i += 4, j += 3) {
    img[i] = data[j] || 0
    img[i + 1] = data[j + 1] || 0
    img[i + 2] = data[j + 2] || 0
    img[i + 3] = 255 // Opacity is unused because it can affect color values
  }
  return img
}

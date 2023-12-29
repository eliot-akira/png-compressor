/**
 * Methods to work with image data
 * @module
 */

export async function imageElementToBlob(
  image: HTMLImageElement,
): Promise<Blob> {
  const { canvas } = imageElementToCanvas(image)
  return new Promise((resolve, reject) => {
    canvas.toBlob(function (blob) {
      if (!blob) reject(new Error(''))
      else resolve(blob)
    }, 'image/png')
  })
}

export async function blobToImageElement(
  blob: Blob,
  image: HTMLImageElement = document.createElement('img'),
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const listener = () => {
      URL.revokeObjectURL(image.src)
      image.removeEventListener('load', listener)
      image.removeEventListener('error', reject)
      resolve(image)
    }
    image.addEventListener('load', listener)
    image.addEventListener('error', reject)
    image.src = URL.createObjectURL(blob)
  })
}

export function getImageData(image: HTMLImageElement) {
  const { context, width, height } = imageElementToCanvas(image)
  return context.getImageData(0, 0, width, height).data
}

export function imageElementToCanvas(image: HTMLImageElement): {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  width: number
  height: number
} {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')!
  // Update canvas size to match image
  const width = (canvas.width = image.naturalWidth)
  const height = (canvas.height = image.naturalHeight)

  context?.drawImage(image, 0, 0)

  return {
    canvas,
    context,
    width,
    height,
  }
}

export function encodeDataIntoImage(data: Uint8Array, img: Uint8ClampedArray) {
  const size = data.length

  for (let i = 0; i < 3; i++) {
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

export function decodeDataFromImage(img: Uint8ClampedArray): ArrayBuffer {
  let size = 0
  for (let i = 0; i < 3; i++) {
    const val = img[i] * Math.pow(256, i)
    size += val
  }
  const data = new Uint8Array(size)
  root: for (let i = 4, j = 0, l = img.length; j < l; i += 4, j += 3) {
    for (let k = 0; k < 3; k++) {
      if (j + k >= size) break root
      data[j + k] = img[i + k]
    }
  }

  return data.buffer
}

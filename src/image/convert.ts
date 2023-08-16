import { compress } from '../compress.ts'

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
      resolve(image)
    }

    image.addEventListener('load', listener)
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

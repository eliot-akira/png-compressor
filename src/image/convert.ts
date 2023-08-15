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

export async function blobToImage(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = function () {
      URL.revokeObjectURL(img.src)
      resolve(img)
    }
    img.onerror = reject
    img.src = URL.createObjectURL(blob)
  })
}

export function imageElementToData(image: HTMLImageElement) {
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

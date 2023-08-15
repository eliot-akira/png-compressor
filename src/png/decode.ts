/**
 * Decode data from PNG
 */
export async function decodeBufferFromPng(
  buffer: ArrayBuffer,
): Promise<ArrayBuffer> {
  const blob = new Blob([buffer])

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = function () {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const w = (canvas.width = img.width)
      const h = (canvas.height = img.height)
      ctx.drawImage(img, 0, 0)
      const imgData = ctx.getImageData(0, 0, w, h).data

      const data = imageToData(imgData)

      URL.revokeObjectURL(img.src)
      resolve(
        data,
        // new Blob([data], { type: 'application/octet-binary' })
      )
    }
    img.onerror = reject
    img.src = URL.createObjectURL(blob)
  })
}

export function imageToData(img: Uint8ClampedArray): ArrayBuffer {
  let size = 0
  for (let i = 0; i < 3; i++) {
    size += img[i] * Math.pow(256, i)
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

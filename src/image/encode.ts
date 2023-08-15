export function encodeDataIntoImage(data: Uint8Array, img: Uint8ClampedArray) {
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

export function decodeDataFromImage(image: Uint8ClampedArray): ArrayBuffer {
  let size = 0
  for (let i = 0; i < 3; i++) {
    size += image[i] * Math.pow(256, i)
  }
  const data = new Uint8Array(size)

  root: for (let i = 4, j = 0, l = image.length; j < l; i += 4, j += 3) {
    for (let k = 0; k < 3; k++) {
      if (j + k >= size) break root
      data[j + k] = image[i + k]
    }
  }
  return data.buffer
}

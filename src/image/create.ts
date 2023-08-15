export function createImage(
  blob: Blob,
  image: HTMLImageElement = document.createElement('img'),
): HTMLImageElement {
  const url = URL.createObjectURL(blob)
  image.src = url
  URL.revokeObjectURL(url)
  return image
}

export function downloadImage(blob: Blob, name = 'compressed.png') {
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.download = name
  a.href = url
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)

  URL.revokeObjectURL(url)
}

import { decodeBinary } from './decode.ts'
import { arrayBufferToValue } from './json-array-buffer.ts'

/**
 * Download encoded file
 */
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

/**
 * Decode binary from uploaded file
 */
export async function decodeBinaryFromFile(file: File): Promise<ArrayBuffer> {
  const buffer = await getBufferfromFile(file)
  return await decodeBinary(buffer)
}

/**
 * Decode JSON-serializable value from uploaded file
 */
export async function decodeFromFile(file: File): Promise<any> {
  return arrayBufferToValue(await decodeBinaryFromFile(file))
}

/**
 * Get uploaded file data
 */
export async function getBufferfromFile(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      resolve(reader.result as ArrayBuffer)
    })
    reader.addEventListener('error', reject)
    reader.readAsArrayBuffer(file)
  })
}

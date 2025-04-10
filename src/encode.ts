import { encodeBinaryToPng, encodeBinaryToBlob } from './png.ts'
import { compress } from './compress.ts'
import { valueToArrayBuffer, type JsonValue } from './json-array-buffer.ts'
import { blobToImageElement, createImageBlob } from './image.ts'

type EncodableValue = JsonValue | ArrayBuffer | Uint8Array

/**
 * Encode JSON value or binary data to image (color channels)
 */
export async function encodeImageData(value: EncodableValue) {
  return await encodeBinaryToPng(
    await compress(
      value instanceof ArrayBuffer || value instanceof Uint8Array
        ? value
        : valueToArrayBuffer(value),
    ),
  )
}

// Deprecate

/**
 * Encode JSON value to image
 * @deprecated Use `encodeImageData`
 */
export async function encode(value: EncodableValue): Promise<ArrayBuffer> {
  return await encodeImageData(value)
}

/**
 * Encode binary data to image
 * @deprecated Use `encodeImageData`
 */
export async function encodeBinary(value: ArrayBuffer): Promise<ArrayBuffer> {
  return await encodeImageData(value)
}

/**
 * Encode JSON value to image blob
 * @deprecated Use `encodeImageData` and `createImageBlob`
 */
export async function encodeToBlob(value: EncodableValue): Promise<Blob> {
  return createImageBlob(await encodeImageData(value))
}

/**
 * Encode JSON value to HTML image element
 * @deprecated Use `encodeImageData` and `createImageElement`
 */
export async function encodeToImage(
  value: EncodableValue,
  image?: HTMLImageElement,
): Promise<HTMLImageElement> {
  return blobToImageElement(
    createImageBlob(await encodeImageData(value)),
    image,
  )
}

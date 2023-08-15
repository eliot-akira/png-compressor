/**
 * Convert JSON-serializable value to array buffer
 */
export function valueToArrayBuffer(value: any): ArrayBuffer {
  // Value -> JSON String -> Uint8Array -> ArrayBuffer
  return new TextEncoder().encode(JSON.stringify(value)).buffer
}

/**
 * Convert array buffer to JSON-serializable value
 */
export function arrayBufferToValue(buffer: ArrayBuffer) {
  // ArrayBuffer -> JSON String -> Value
  return JSON.parse(new TextDecoder().decode(buffer))
}

/**
 * Convert JSON-serializable value to array buffer and back
 * @module
 */

/**
 * JSON-serializable value
 */
export type JsonValue =
  | null
  | boolean
  | number
  | string
  | JsonValue[]
  | { [key: string]: JsonValue }

/**
 * Convert JSON value to array buffer
 */
export function valueToArrayBuffer(value: JsonValue): ArrayBuffer {
  // Value -> JSON String -> Uint8Array -> ArrayBuffer
  return new TextEncoder().encode(JSON.stringify(value)).buffer as ArrayBuffer
}

/**
 * Convert array buffer to JSON value
 */
export function arrayBufferToValue(buffer: ArrayBuffer): JsonValue {
  // ArrayBuffer -> JSON String -> Value
  return JSON.parse(new TextDecoder().decode(buffer))
}

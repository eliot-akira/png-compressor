/**
 * Methods to compress and decompress using [CompressionStream](https://developer.mozilla.org/docs/Web/API/CompressionStream)
 * @module
 */
import {
  valueToArrayBuffer,
  arrayBufferToValue,
  type JsonValue,
} from './json-array-buffer.ts'

// Browser and server
const { CompressionStream, DecompressionStream, Response } = globalThis

/**
 * Compression format
 */
export type CompressionFormat = 'gzip' | 'deflate' | 'deflate-raw'

export const defaultCompressionFormat: CompressionFormat = 'gzip'

/**
 * Compress array buffer
 */
export async function compress(
  buffer: ArrayBuffer,
  compressionFormat: CompressionFormat = defaultCompressionFormat,
): Promise<ArrayBuffer> {
  const compressor = new CompressionStream(compressionFormat)
  const stream = new Response(buffer).body?.pipeThrough(compressor)
  return await new Response(stream).arrayBuffer()
}

/**
 * Compress JSON value
 */
export async function compressJson(
  value: JsonValue,
  compressionFormat: CompressionFormat = defaultCompressionFormat,
): Promise<ArrayBuffer> {
  return await compress(valueToArrayBuffer(value), compressionFormat)
}

async function decompressAsResponse(
  buffer: ArrayBuffer,
  compressionFormat: CompressionFormat = defaultCompressionFormat,
): Promise<Response> {
  const decompressor = new DecompressionStream(compressionFormat)
  const stream = new Response(buffer).body?.pipeThrough(decompressor)
  return new Response(stream)
}

/**
 * Decompress as ArrayBuffer
 */
export async function decompressAsArrayBuffer(
  buffer: ArrayBuffer,
  compressionFormat: CompressionFormat = defaultCompressionFormat,
): Promise<ArrayBuffer> {
  return (await decompressAsResponse(buffer, compressionFormat)).arrayBuffer()
}

/**
 * Decompress as string
 */
export async function decompressAsString(
  buffer: ArrayBuffer,
  compressionFormat: CompressionFormat = defaultCompressionFormat,
): Promise<string> {
  return (await decompressAsResponse(buffer, compressionFormat)).text()
}

export const decompress = decompressAsArrayBuffer

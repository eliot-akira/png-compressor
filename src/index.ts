import { encodePng, encodePngBlob, decodePng } from './png.js'
import {
  compress,
  decompressAsString,
  decompressAsArrayBuffer,
} from './compress.js'

export async function encode(value: any): Promise<ArrayBuffer> {
  return await encodePng(await compress(JSON.stringify(value)))
}

export async function decode(buffer: ArrayBuffer): Promise<any> {
  return JSON.parse(await decompressAsString(await decodePng(buffer)))
}

export async function encodeBinary(value: ArrayBuffer): Promise<ArrayBuffer> {
  return await encodePng(await compress(value))
}

export async function decodeBinary(buffer: ArrayBuffer): Promise<ArrayBuffer> {
  return await decompressAsArrayBuffer(await decodePng(buffer))
}

export async function encodeBlob(value: any): Promise<Blob> {
  return await encodePngBlob(await compress(JSON.stringify(value)))
}

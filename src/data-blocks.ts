import * as PngCodec from './png-codec/index.ts'
import type {
  IDecodedPng,
  IDecodePngOptions,
  IImage32,
  IImage64,
  IEncodedPng,
  IEncodePngOptions,
  IPngMetadataTextualData,
  IPngMetadataCompressedTextualData,
} from './png-codec/index.ts'
import { stringToUint8Array } from './string-uint8-array.ts'

/**
 * Data blocks: text, JSON, binary
 */

export type TextBlock = {
  type: 'text'
  name: string
  value: string
}

export type JsonBlock = {
  type: 'json'
  name: string
  value: JsonValue
}

export type JsonValue =
  | null
  | boolean
  | number
  | string
  | JsonValue[]
  | { [key: string]: JsonValue }

export type BinaryBlock = {
  type: 'bin'
  name: string
  value: Uint8Array
}

export type DataBlock = TextBlock | JsonBlock | BinaryBlock

export function createDataBlock(
  name: string,
  value: string | JsonValue | Uint8Array,
) {
  if (value instanceof Uint8Array) {
    return {
      type: 'bin',
      name,
      value,
    } as BinaryBlock
  }

  if (typeof value === 'string') {
    return {
      type: 'text',
      name,
      value,
    } as TextBlock
  }

  return {
    type: 'json',
    name,
    value,
  } as JsonBlock
}

const { KnownChunkTypes } = PngCodec

export { KnownChunkTypes }
export type TextChunkTypes =
  | IPngMetadataCompressedTextualData
  | (IPngMetadataTextualData & {
      text: string | Uint8Array
    })

export type DecodedPng = IDecodedPng<IImage32 | IImage64>

export async function decodeImageWithDataBlocks(
  buffer: Uint8Array | ArrayBuffer,
  chunkTypes: IDecodePngOptions['parseChunkTypes'] = [],
): Promise<{
  image: DecodedPng['image']
  blocks: DataBlock[]
  chunks: DecodedPng['metadata']
  details: DecodedPng['details']
  palette: DecodedPng['palette']
}> {
  const {
    image,
    metadata,
    details,
    palette,
    // warnings,
    // info,
  } = await PngCodec.decodePng(
    !(buffer instanceof Uint8Array) ? new Uint8Array(buffer) : buffer,
    {
      parseChunkTypes:
        chunkTypes === '*'
          ? chunkTypes
          : [...chunkTypes, KnownChunkTypes.tEXt, KnownChunkTypes.zTXt],
    },
  )

  const blocks: DataBlock[] = []

  // Extract metadata
  for (const {
    type,
    keyword = '',
    text: value,
  } of metadata as TextChunkTypes[]) {
    const [prefix, name] = keyword.split('/')
    if (type === KnownChunkTypes.tEXt) {
      if (prefix === 'text') {
        blocks.push({
          type: prefix,
          name,
          value: value,
          // latin1.unescape(value),
          // stringToUint8Array(value),
        })
      }
    } else if (type === KnownChunkTypes.zTXt) {
      if (prefix === 'json') {
        blocks.push({
          type: prefix,
          name,
          value: JSON.parse(String(value)),
        })
      } else if (prefix === 'bin') {
        blocks.push({
          type: prefix,
          name,
          value: stringToUint8Array(value as string),
        })
      }
    } else {
      // Unknown
    }
  }

  return {
    image,
    blocks,
    chunks: metadata,
    details,
    palette,
  }
}

/**
 * Encode image with data blocks
 */
export async function encodeImageWithDataBlocks(
  image: IImage32 | IImage64 | ArrayBuffer | Uint8Array,
  blocks: DataBlock[],
): Promise<IEncodedPng['data']> {
  const imageData =
    image instanceof ArrayBuffer || image instanceof Uint8Array
      ? (await PngCodec.decodePng(image as Uint8Array)).image
      : image

  const chunks: TextChunkTypes[] = []

  for (const { type, name, value } of blocks) {
    if (type === 'text') {
      chunks.push({
        type: KnownChunkTypes.tEXt,
        keyword: `text/${name}`,
        text: value,
      })
    } else if (type === 'json') {
      chunks.push({
        type: KnownChunkTypes.zTXt,
        keyword: `json/${name}`,
        text: JSON.stringify(value),
      })
    } else if (type === 'bin') {
      chunks.push({
        type: KnownChunkTypes.zTXt,
        keyword: `bin/${name}`,
        // Array buffer to string - inlined here for performance
        text: String.fromCharCode.apply(null, new Uint16Array(value)),
      })
    }
  }

  return (
    await PngCodec.encodePng(imageData, {
      ancillaryChunks: chunks,
    })
  ).data
}

/**
 * Get single data block by name
 */
export function getDataBlockValue(
  name: string,
  blocks: DataBlock[],
): any | void {
  for (const b of blocks) {
    if (b.name === name) return b.value
  }
}

/**
 * Get multiple data blocks by name
 */
export function getDataBlockValues(name: string, blocks: DataBlock[]): any[] {
  return blocks.filter((b) => b.name === name).map((b) => b.value)
}

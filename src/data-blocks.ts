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
import type { JsonValue } from './json-array-buffer.ts'

export type * from './png-codec/index.ts'

const { KnownChunkTypes } = PngCodec

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

export type BinaryBlock = {
  type: 'bin'
  name: string
  value: Uint8Array
}

export type DataBlock = TextBlock | JsonBlock | BinaryBlock

export function createDataBlock(
  name: string,
  value: string | JsonValue | Uint8Array | ArrayBuffer,
) {
  if (value instanceof ArrayBuffer) value = new Uint8Array(value)
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

export type TextChunkTypes =
  | IPngMetadataCompressedTextualData
  | (IPngMetadataTextualData & {
      text: string | Uint8Array
    })

export type DecodedPng = IDecodedPng<IImage32 | IImage64>

export async function decodeImageDataBlocks(
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
    switch (type) {
      case KnownChunkTypes.tEXt:
        switch (prefix) {
          case 'text':
            blocks.push({
              type: prefix,
              name,
              value: value,
            })
            break
        }
        break
      case KnownChunkTypes.zTXt:
        switch (prefix) {
          case 'json':
            blocks.push({
              type: prefix,
              name,
              value: JSON.parse(String(value)),
            })
            break
          case 'bin':
            blocks.push({
              type: prefix,
              name,
              value: stringToUint8Array(value as string),
            })
            break
        }
        break
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
export async function encodeImageDataBlocks(
  image: IImage32 | IImage64 | ArrayBuffer | Uint8Array,
  blockDefinition: {
    [key: string]: (JsonValue | ArrayBuffer) | (JsonValue | ArrayBuffer)[]
  },
): Promise<IEncodedPng['data']> {
  const imageData =
    image instanceof ArrayBuffer || image instanceof Uint8Array
      ? (await PngCodec.decodePng(image as Uint8Array)).image
      : image

  const blocks: DataBlock[] = []
  const chunks: TextChunkTypes[] = []

  for (const [key, value] of Object.entries(blockDefinition)) {
    if (Array.isArray(value)) {
      for (const subValue of value) {
        blocks.push(createDataBlock(key, subValue))
      }
    } else {
      blocks.push(createDataBlock(key, value))
    }
  }

  for (const { type, name, value } of blocks) {
    switch (type) {
      case 'text':
        chunks.push({
          type: KnownChunkTypes.tEXt,
          keyword: `${type}/${name}`,
          text: value,
        })
        break
      case 'json':
        chunks.push({
          type: KnownChunkTypes.zTXt,
          keyword: `${type}/${name}`,
          text: JSON.stringify(value),
        })
        break
      case 'bin':
        chunks.push({
          type: KnownChunkTypes.zTXt,
          keyword: `${type}/${name}`,
          // Array buffer to string - inlined here for performance
          text: String.fromCharCode.apply(null, new Uint16Array(value)),
        })

        break
      default:
        break
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
export function getDataBlock(name: string, blocks: DataBlock[]): any | void {
  for (const b of blocks) {
    if (b.name === name) return b.value
  }
}

/**
 * Get multiple data blocks by name
 */
export function getDataBlocks(name: string, blocks: DataBlock[]): any[] {
  return blocks.filter((b) => b.name === name).map((b) => b.value)
}

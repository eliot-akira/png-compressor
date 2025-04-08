/**
 * @license
 * Copyright (c) 2022 Daniel Imms <http://www.growingwiththeweb.com>
 * Released under MIT license. See LICENSE in the project root for details.
 */

import { assertChunkDataLengthGte } from '../assert.js'
import { readText } from '../text.js'
import {
  ChunkPartByteLength,
  IDecodeContext,
  IPngChunk,
  IPngHeaderDetails,
  IPngMetadataTextualData,
} from '../../shared/types.js'

/**
 * `tEXt` Textual data
 *
 * Spec: https://www.w3.org/TR/PNG/#11tEXt
 */
export function parseChunk(
  ctx: IDecodeContext,
  header: IPngHeaderDetails,
  chunk: IPngChunk,
): IPngMetadataTextualData {
  assertChunkDataLengthGte(ctx, chunk, 6)

  // Format:
  // Keyword:            1-79 bytes (character string)
  // Null separator:     1 byte (null character)
  // Text:               0 or more bytes
  const chunkDataOffset =
    chunk.offset + ChunkPartByteLength.Length + ChunkPartByteLength.Type
  const maxOffset = chunkDataOffset + chunk.dataLength // Ensures reading outside this chunk is not allowed
  let offset = chunkDataOffset
  const textDecoder = new TextDecoder('utf8') // NOTE: Changed from "latin1" in spec
  let readResult: { bytesRead: number; text: string }

  readResult = readText(ctx, chunk, textDecoder, 79, offset, maxOffset, true)
  offset += readResult.bytesRead
  const keyword = readResult.text

  readResult = readText(
    ctx,
    chunk,
    textDecoder,
    undefined,
    offset,
    maxOffset,
    false,
  )
  offset += readResult.bytesRead
  const text = readResult.text

  return {
    type: 'tEXt',
    keyword,
    text,
  }
}

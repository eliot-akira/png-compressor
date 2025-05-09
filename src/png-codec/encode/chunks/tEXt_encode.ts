/**
 * @license
 * Copyright (c) 2022 Daniel Imms <http://www.growingwiththeweb.com>
 * Released under MIT license. See LICENSE in the project root for details.
 */

import { EncodeError } from '../../encode/assert.js'
import { IEncodeContext, IImage32, IImage64 } from '../../shared/types.js'
import { writeChunkDataFn } from '../write.js'

export function encodeChunk(
  ctx: IEncodeContext,
  image: Readonly<IImage32> | Readonly<IImage64>,
  keyword: string,
  value: string | Uint8Array,
): Uint8Array {
  if (keyword.length === 0 || keyword.length > 79) {
    throw new EncodeError(
      `tEXt: Invalid keyword length: 0 < ${keyword.length} < 80`,
      0,
    )
  }

  // Encode to Uint8Array
  value = value instanceof Uint8Array ? value : new TextEncoder().encode(value)

  // Format:
  // Keyword:            1-79 bytes (character string)
  // Null separator:     1 byte (null character)
  // Text:               0 or more bytes
  const dataLength = keyword.length + 1 + value.length
  return writeChunkDataFn('tEXt', dataLength, (stream) => {
    let i = 0
    // Keyword
    for (; i < keyword.length; i++) {
      stream.writeUint8(keyword.charCodeAt(i))
    }
    // Null separator
    stream.writeUint8(0)
    // Text
    for (i = 0; i < value.length; i++) {
      stream.writeUint8(value[i] as number)
    }
  })
}

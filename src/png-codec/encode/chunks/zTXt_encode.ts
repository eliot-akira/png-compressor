/**
 * zTXt Compressed textual data
 * https://www.w3.org/TR/2003/REC-PNG-20031110/#11zTXt
 */
import * as pako from '../../../pako/index.js'
import { EncodeError } from '../../encode/assert.js'
import { IEncodeContext, IImage32, IImage64 } from '../../shared/types.js'
import { writeChunkDataFn } from '../write.js'

export function encodeChunk(
  ctx: IEncodeContext,
  image: Readonly<IImage32> | Readonly<IImage64>,
  keyword: string,
  value: string | ArrayBuffer | Uint8Array, // deflate-able value
): Uint8Array {
  if (keyword.length === 0 || keyword.length > 79) {
    throw new EncodeError(
      `zTXt: Invalid keyword length: 0 < ${keyword.length} < 80`,
      0,
    )
  }

  // Compress and encode to Uint8Array
  value = pako.deflate(value) as Uint8Array

  // Format:
  // Keyword:            1-79 bytes (character string)
  // Null separator:     1 byte (null character)
  // Compression method: 1 byte (0 = zlib deflate)
  // Compressed text:    0 or more bytes
  const dataLength = keyword.length + 1 + 1 + value.byteLength

  return writeChunkDataFn('zTXt', dataLength, (stream) => {
    let i = 0
    // Keyword
    for (; i < keyword.length; i++) {
      stream.writeUint8(keyword.charCodeAt(i))
    }
    // Null separator
    stream.writeUint8(0)
    // Compression method
    stream.writeUint8(0)

    for (i = 0; i < value.length; i++) {
      stream.writeUint8(value[i])
    }
  })
}

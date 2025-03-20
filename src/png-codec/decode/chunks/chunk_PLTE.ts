/**
 * @license
 * Copyright (c) 2022 Daniel Imms <http://www.growingwiththeweb.com>
 * Released under MIT license. See LICENSE in the project root for details.
 */

import {
  assertChunkPrecedes,
  assertChunkSinglular,
  createChunkDecodeWarning,
  handleWarning,
} from '../assert.js'
import {
  // Enums
  ChunkPartByteLength,
  ColorType,
  KnownChunkTypes,
} from '../../shared/types.js'
import type {
  IDecodeContext,
  IPngChunk,
  IPngHeaderDetails,
  IPngPaletteInternal,
} from '../../shared/types.js'

/**
 * `PLTE` Palette
 *
 * Spec: https://www.w3.org/TR/PNG/#11PLTE
 */
export function parseChunk(
  ctx: IDecodeContext,
  header: IPngHeaderDetails,
  chunk: IPngChunk,
): IPngPaletteInternal {
  assertChunkSinglular(ctx, chunk)
  assertChunkPrecedes(ctx, chunk, KnownChunkTypes.bKGD)
  assertChunkPrecedes(ctx, chunk, KnownChunkTypes.hIST)
  assertChunkPrecedes(ctx, chunk, KnownChunkTypes.tRNS)
  assertChunkPrecedes(ctx, chunk, KnownChunkTypes.IDAT)

  let offset = chunk.offset + ChunkPartByteLength.Length
  // This chunk shall appear for colour type 3, and may appear for colour types 2 and 6; it shall not appear for colour types 0 and 4.
  if (
    header.colorType === ColorType.Grayscale ||
    header.colorType === ColorType.GrayscaleAndAlpha
  ) {
    throw createChunkDecodeWarning(
      chunk,
      `Color type "${header.colorType}" cannot have a palette`,
      offset,
    )
  }

  offset += ChunkPartByteLength.Type
  if (chunk.dataLength === 0) {
    throw createChunkDecodeWarning(chunk, 'Cannot have 0 entries', offset)
  }

  // A chunk length not divisible by 3 is an error.
  if (chunk.dataLength % 3 !== 0) {
    throw createChunkDecodeWarning(
      chunk,
      `Chunk length must be divisible by 3 (actual "${chunk.dataLength}")`,
      offset,
    )
  }

  if (chunk.dataLength / 3 > 256) {
    handleWarning(
      ctx,
      createChunkDecodeWarning(
        chunk,
        `Too many entries (${chunk.dataLength / 3} > 256)`,
        offset,
      ),
    )
  }

  if (chunk.dataLength / 3 > Math.pow(2, header.bitDepth)) {
    handleWarning(
      ctx,
      createChunkDecodeWarning(
        chunk,
        `Too many entries for bit depth (${chunk.dataLength / 3} > 2^${
          header.bitDepth
        })`,
        offset,
      ),
    )
  }

  return new Palette(
    ctx.view,
    chunk.offset + ChunkPartByteLength.Length + ChunkPartByteLength.Type,
    chunk.dataLength,
  )
}

export class Palette implements IPngPaletteInternal {
  constructor(
    private readonly _view: DataView,
    private _paletteOffset: number,
    private _length: number,
  ) {}

  get size(): number {
    return this._length / 3
  }

  getRgb(colorIndex: number): Uint8Array {
    this._checkIndex(colorIndex)
    return new Uint8Array(
      this._view.buffer.slice(
        this._view.byteOffset + this._paletteOffset + colorIndex * 3,
        this._view.byteOffset + this._paletteOffset + colorIndex * 3 + 3,
      ),
    )
  }

  setRgba(data: Uint8Array, offset: number, colorIndex: number): void {
    this._checkIndex(colorIndex)
    const i = this._paletteOffset + colorIndex * 3
    data[offset] = this._view.getUint8(i)
    data[offset + 1] = this._view.getUint8(i + 1)
    data[offset + 2] = this._view.getUint8(i + 2)
    data[offset + 3] = 255
  }

  private _checkIndex(colorIndex: number) {
    // any out-of-range pixel value found in the image data is an error.
    if (colorIndex < 0 || colorIndex * 3 > this._length - 3) {
      // This is a regular error as it is exposed on the API
      throw new Error(`Palette does not contain color index "${colorIndex}"`)
    }
  }
}

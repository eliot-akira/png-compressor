/**
 * @license
 * Copyright (c) 2022 Daniel Imms <http://www.growingwiththeweb.com>
 * Released under MIT license. See LICENSE in the project root for details.
 */
import type { DecodeWarning } from '../decode/decoder.ts'
import type { EncodeWarning } from '../encode/encoder.ts'
import { ColorType, InterlaceMethod } from '../api.js'
import type {
  BitDepth,
  IDecodePngOptions,
  IEncodePngOptions,
  IImage32,
  IImage64,
  IPngChunk,
  IPngPalette,
  PngMetadata,
} from '../api.js'

// Re-export types from the api file which cannot be referenced in the out/ directory.
export type {
  BitDepth,
  DefaultParsedChunkTypes,
  IDecodedPng,
  IDecodePngOptions,
  IEncodePngOptions,
  IImage32,
  IImage64,
  IPngChunk,
  IPngDetails,
  IPngMetadataBackgroundColor,
  IPngMetadataCalibrationOfPixelValues,
  IPngMetadataChromaticity,
  IPngMetadataCompressedTextualData,
  IPngMetadataEmbeddedIccProfile,
  IPngMetadataExif,
  IPngMetadataGamma,
  IPngMetadataHistogram,
  IPngMetadataIndicatorOfStereoImage,
  IPngMetadataInternationalTextualData,
  IPngMetadataLastModificationTime,
  IPngMetadataOffset,
  IPngMetadataPhysicalPixelDimensions,
  IPngMetadataPhysicalScaleOfImageSubject,
  IPngMetadataSignificantBits,
  IPngMetadataStandardRgbColorSpace,
  IPngMetadataSuggestedPalette,
  IPngMetadataSuggestedPaletteEntry,
  IPngMetadataTextualData,
  IPngMetadataTransparency,
  OptionalParsedChunkTypes,
  PngMetadata,
} from '../api.js'

export {
  // Enums
  ColorType,
  InterlaceMethod,
  KnownChunkTypes,
  RenderingIntent,
} from '../api.js'

export interface IBaseDecodeContext {
  view: DataView
  image?: IImage32 | IImage64
  palette?: IPngPaletteInternal
  rawChunks?: IPngChunk[]
  /**
   * A Set of chunks already parsed, this can be used to enforce chunk ordering and preventing
   * multiple when only one is allowed.
   */
  parsedChunks: Set<string>
  metadata: PngMetadata[]
  info: string[]
  warnings: DecodeWarning[]
  options: IDecodePngOptions
}

export interface IInitialDecodeContext extends IBaseDecodeContext {
  header?: IPngHeaderDetails
}

export interface IDecodeContext extends IBaseDecodeContext {
  header: IPngHeaderDetails
}

export interface IEncodeContext {
  colorType: ColorType
  bitDepth: BitDepth
  interlaceMethod: InterlaceMethod
  /**
   * All unique colors in the image in `0xRRGGBBAA` format for 8 bit or `0xRRRRGGGGBBBBAAAA` for 16
   * bit.
   */
  colorSet: Set<number>
  palette?: Map<number, number>
  transparentColorCount: number
  firstTransparentColor: number | undefined
  useTransparencyChunk: boolean
  options: IEncodePngOptionsInternal
  warnings: EncodeWarning[]
  info: string[]
}

export interface IPngHeaderDetails {
  width: number
  height: number
  bitDepth: BitDepth
  colorType: ColorType
  interlaceMethod: InterlaceMethod
}

export const enum ChunkPartByteLength {
  Length = 4,
  Type = 4,
  CRC = 4,
}

export interface IPngPaletteInternal extends IPngPalette {
  setRgba(data: Uint8Array, offset: number, colorIndex: number): void
}

export interface IEncodePngOptionsInternal extends IEncodePngOptions {
  /**
   * An optional filter pattern used for testing. This is internal only as it's not useful outside
   * of testing to ensure each permutation is correct, unless the image is analyzed outside of the
   * library but that's out of scope for this library.
   */
  filterPattern?: FilterType[]
}

export const enum FilterMethod {
  Adaptive = 0,
}

export const enum FilterType {
  /**
   * ```
   * Filt(x) = Orig(x)
   * Recon(x) = Filt(x)
   * ```
   */
  None = 0,
  /**
   * ```
   * Filt(x) = Orig(x) - Orig(a)
   * Recon(x) = Filt(x) + Recon(a)
   * ```
   */
  Sub = 1,
  /**
   * ```
   * Filt(x) = Orig(x) - Orig(b)
   * Recon(x) = Filt(x) + Recon(b)
   * ```
   */
  Up = 2,
  /**
   * ```
   * Filt(x) = Orig(x) - floor((Orig(a) + Orig(b)) / 2)
   * Recon(x) = Filt(x) + floor((Recon(a) + Recon(b)) / 2)
   * ```
   */
  Average = 3,
  /**
   * ```
   * Filt(x) = Orig(x) - PaethPredictor(Orig(a), Orig(b), Orig(c))
   * Recon(x) = Filt(x) + PaethPredictor(Recon(a), Recon(b), Recon(c))
   * ```
   */
  Paeth = 4,
}

# @lunapaint/png-codec

This is a PNG decoder and encoder library for JavaScript that runs in both the browser and in Node.js. It is used in [Luna Paint](https://marketplace.visualstudio.com/items?itemName=Tyriar.luna-paint) (an image editor for VS Code) to work with PNG files.

You can try it out on [`vscode.dev`](https://vscode.dev/) by installing the Luna Paint extension and opening a png file.

## Features

- **Performance**: Just like Luna Paint, performance is a priority. This includes code splitting such that code that parses optional chunks are only loaded as needed.
- **Correctness**: The library has > 97% code coverage via over 7500 tests, including full coverage of [PngSuite](https://github.com/lunapaint/pngsuite)—the "official" test suite for PNG.
- **Simple API**: The API is a well documented [TypeScript declaration file](https://github.dev/lunapaint/png-codec/blob/main/typings/api.d.ts).
- **Metadata**: All supported metadata is exposed on the API such as text, gamma, default background color, etc.
- **Readable Codebase**: A big part of this was a learning exercise for me so I put some effort in to make the code as readable as possible to help others on the same journey.
- **Error tolerant**: Images will still load with warnings unless a critical error is hit.

## Install

The supported way of installing the project is through npm:

```
npm install @lunapaint/png-codec
```

Alternatively, you could add the repo as a git submodule, or download the source from the GitHub [releases page](https://github.com/lunapaint/png-codec/releases).

## API

Basic usage:

```ts
import { decodePng, encodePng } from '@lunapaint/png-codec'
import * as fs from 'fs/promises'

async function decode(filepath) {
  const data = await fs.readFile(filepath)
  const decoded = await decodePng(data)
  console.log('decoded image', decoded.image.data)
  // [r, g, b, a, ...]
}

async function encode(data, width, height, filepath) {
  const encoded = await encodePng({ data, width, height })
  await fs.writeFile(filepath, encoded.data)
  console.log('encoded image', encoded.data)
  // [...binary data]
}
```

The full API is documented as a TypeScript `.d.ts` declaration file. The view the API:

- [github.dev](https://github.dev/lunapaint/png-codec/blob/main/typings/api.d.ts): View on the web in VS Code, which has symbol support out of the box. Try showing the Outline view and triggering the `Go to Symbol in Editor` command
- [github.com](https://github.com/lunapaint/png-codec/blob/main/typings/api.d.ts): View the raw file in github.com.

## Decoder chunk support

PNGs are made up of a fixed signature followed by a series of chunks. The following chunks can be decoded supported, with some notes provided where applicable:

**Critical chunks:**

| Chunk  | Name          | Notes                                                                                     |
| ------ | ------------- | ----------------------------------------------------------------------------------------- |
| [IHDR] | Image header  |
| [PLTE] | Palette       |
| [IDAT] | Image data    | Full filtering and interlacing support for all bit depths (1, 2, 4, 8, 16) are supported. |
| [IEND] | Image trailer |

**Ancillary chunks:**

| Chunk  | Name                                   | Notes                                                                                                                               |
| ------ | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| [bKGD] | Background color                       |
| [cHRM] | Primary chromaticities and white point |
| [eXIf] | Exchangeable image file format         | Approved 2017/7                                                                                                                     |
| [gAMA] | Image gamma                            | Gamma values are provided, but are not applied to the resulting image (see [#11](https://github.com/lunapaint/png-codec/issues/11)) |
| [hIST] | Image histogram                        |
| [iCCP] | Embedded ICC profile                   | Exposes the profile as a byte array                                                                                                 |
| [iTXt] | International textual data             |
| [oFFs] | Image offset                           | 🧪 Limited testing<br>Extension to the PNG 1.2 Specification v1.2.0                                                                 |
| [pCAL] | Calibration of pixel values            | 🧪 Limited testing<br>Extension to the PNG 1.2 Specification v1.2.0                                                                 |
| [pHYs] | Physical pixel dimensions              |
| [sBIT] | Significant bits                       | Since the decoded buffer uses a minimum of uint8, this is only when the significant bits are in the range of 9-15                   |
| [sCAL] | Physical scale of image subject        | 🧪 Limited testing<br>Extension to the PNG 1.2 Specification v1.2.0                                                                 |
| [sPLT] | Suggested palette                      |
| [sRGB] | Standard RGB colour space              |
| [sTER] | Indicator of stereo image              | 🧪 Limited testing<br>Extension to the PNG 1.2 Specification v1.3.0                                                                 |
| [tEXt] | Textual data                           |
| [tIME] | Image last-modification time           |
| [tRNS] | Transparency                           | Since this chunk modifies the resulting image, you cannot skip this chunk                                                           |
| [zTXt] | Compressed textual data                |

## Why does this exist?

These are the main reasons:

- To deeply understand the format.
- To integrate better with Luna Paint and my other existing and future decoders that depend on the png format.
- The scope is limited, this project will eventually be "done" and need minimal maintenance.
- I didn't want to go the wasm route in Luna Paint (yet?).
- To have full control over how the code is loaded, for example Luna Paint uses dynamic imports extensively to reduce the amount of code loaded to combat slow startup times.
- As an educational resource.
- To have some fun.

## Dependencies

The library has the single runtime dependency [pako](https://github.com/nodeca/pako) which provides the compression/decompression capabilities needed to read various png chunks.

## References

- https://www.w3.org/TR/2003/REC-PNG-20031110
- http://www.libpng.org/pub/png/spec/1.2/PNG-Contents.html
- http://www.libpng.org/pub/png/spec/register/pngext-1.4.0-pdg.html
- http://ftp-osl.osuosl.org/pub/libpng/documents/proposals/eXIf/png-proposed-eXIf-chunk-2017-06-15.html

[IHDR]: https://www.w3.org/TR/2003/REC-PNG-20031110/#11IHDR
[PLTE]: https://www.w3.org/TR/2003/REC-PNG-20031110/#11PLTE
[IDAT]: https://www.w3.org/TR/2003/REC-PNG-20031110/#11IDAT
[IEND]: https://www.w3.org/TR/2003/REC-PNG-20031110/#11IEND
[bKGD]: https://www.w3.org/TR/2003/REC-PNG-20031110/#11bKGD
[cHRM]: https://www.w3.org/TR/2003/REC-PNG-20031110/#11cHRM
[eXIf]: http://ftp-osl.osuosl.org/pub/libpng/documents/proposals/eXIf/png-proposed-eXIf-chunk-2017-06-15.html#C.eXIf
[gAMA]: https://www.w3.org/TR/2003/REC-PNG-20031110/#11gAMA
[hIST]: https://www.w3.org/TR/2003/REC-PNG-20031110/#11hIST
[iCCP]: https://www.w3.org/TR/2003/REC-PNG-20031110/#11iCCP
[iTXt]: https://www.w3.org/TR/2003/REC-PNG-20031110/#11iTXt
[oFFs]: http://www.libpng.org/pub/png/spec/register/pngext-1.4.0-pdg.html#C.oFFs
[pCAL]: http://www.libpng.org/pub/png/spec/register/pngext-1.4.0-pdg.html#C.pCAL
[pHYs]: https://www.w3.org/TR/2003/REC-PNG-20031110/#11pHYs
[sBIT]: https://www.w3.org/TR/2003/REC-PNG-20031110/#11sBIT
[sCAL]: http://www.libpng.org/pub/png/spec/register/pngext-1.4.0-pdg.html#C.sCAL
[sPLT]: https://www.w3.org/TR/2003/REC-PNG-20031110/#11sPLT
[sRGB]: https://www.w3.org/TR/2003/REC-PNG-20031110/#11sRGB
[sTER]: http://www.libpng.org/pub/png/spec/register/pngext-1.4.0-pdg.html#C.sTER
[tEXt]: https://www.w3.org/TR/2003/REC-PNG-20031110/#11tEXt
[tIME]: https://www.w3.org/TR/2003/REC-PNG-20031110/#11tIME
[tRNS]: https://www.w3.org/TR/2003/REC-PNG-20031110/#11tRNS
[zTXt]: https://www.w3.org/TR/2003/REC-PNG-20031110/#11zTXt

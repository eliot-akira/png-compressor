# PNG Compressor

> Compress and encode data as Portable Network Graphics (PNG) image

![Screenshot](screenshot.jpg)

## Why

It can be useful to encode data, such as application state, into an image file that can be shared easily, for example, compared to exporting JSON or ZIP file.

## How

The data is compressed using the [Compression Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Compression_Streams_API). The PNG format uses the same algorithm as `gzip`, but it was discovered that the compression ratio is dramatically better when the data is compressed before encoding as image.

Each byte of the given data is written into the color channels (red/green/blue) of a canvas. The opacity (alpha) channel is not used because it can change color values. The canvas is then exported as a [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob).

## TODO

- Use a [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Worker) to render image on [OffscreenCanvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas) processed in a separate thread, then transfer the result.
- Benchmark

## Install

```sh
npm install --save png-compressor
```

## Usage

#### Encode/decode JSON-serializable value

```ts
import { encode, decode } from 'png-compressor'

const object = { key: 'value' }

const pngImage = await encode(object)
const decoded =  await decode(pngImage)

assert.deepEqual(decoded, object)
```

#### Encode/decode binary (array buffer)

```ts
import { encodeBuffer, decodeBuffer } from 'png-compressor'

const buffer = new ArrayBuffer(8)

const pngImage = await encodeBuffer(buffer)
const decoded =  await decodeBuffer(pngImage)

assert.deepEqual(decoded, buffer)
```

#### Create image element

```ts
import { encodeToImage } from 'png-compressor'

const object = { key: 'value' }

const image = await encodeToImage(object)
```

Or pass an image element as second argument to render into it.

```ts
const image = document.createElement('img')

await encodeToImage(object, image)
```

#### Download as image

```ts
import { encodeToBlob, downloadImage } from 'png-compressor'

const blob = await encodeToBlob(object)

downloadImage(blob, 'example.png')
```

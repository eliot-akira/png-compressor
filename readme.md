# PNG Compressor

> Compress and encode data as PNG image

![Screenshot](screenshot.jpg)

## Why

It can be useful to encode data, such as application state, into an image file that can be shared easily.

## How

For `gzip` compression and decompression, it uses the [Compression Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Compression_Streams_API), well-supported by browsers and on server side.

To convert the compressed data into PNG image, a [web worker](https://developer.mozilla.org/en-US/docs/Web/API/Worker) renders to [OffscreenCanvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas) on a separate thread and transfers the result.

## Install

```sh
npm install --save png-compressor
```

## Usage

Encode/decode JSON-serializable JavaScript value

```ts
import { encode, decode } from 'png-compressor'

const object = {
  key: 'value'
}

const pngImage = await encode(object)
const decoded =  await decode(pngImage)

assert.deepEqual(decoded, object)
```

Encode/decode binary (array buffer)

```ts
import { encodeBinary, decodeBinary } from 'png-compressor'

const buffer = new ArrayBuffer(8)

const pngImage = await encodeBinary(buffer)
const decoded =  await decodeBinary(pngImage)

assert.deepEqual(decoded, buffer)
```

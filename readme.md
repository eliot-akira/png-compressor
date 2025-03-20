# PNG Compressor

> Compress and encode data as Portable Network Graphics (PNG) image

![](screenshot.jpg)

**[Demo](https://eliot-akira.github.io/png-compressor/) · [API](https://eliot-akira.github.io/png-compressor/api/) · [Source](https://github.com/eliot-akira/png-compressor)**

## Why

It can be useful to encode data or application state into an image file for sharing easily - compared to JSON or ZIP format, which might not be possible to upload to a discussion forum.

Such images are sometimes called "cartridges", referring to retro game ROM cards.

## How

The data is `gzip` compressed using the [Compression Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Compression_Streams_API), well-supported by browsers and server-side JavaScript runtimes. The PNG format uses the same algorithm, but I found that the compression ratio is dramatically better when the data is compressed before encoding as image.

Each byte of the given data is written into the color channels (red/green/blue) of an image. The opacity (alpha) channel is not used because it can change color values.

In the browser, this encoded buffer can be turned into an image element and downloaded as a PNG file. On the server, it can be written to a file.

## Install

```sh
npm install --save png-compressor
```

## Usage

### Encode/decode JSON-serializable value

```ts
import { encode, decode } from 'png-compressor'

const object = { key: 'value' }

const pngImage = await encode(object)
const decoded =  await decode(pngImage)

assert.deepEqual(decoded, object)
```

### Encode/decode binary (array buffer)

```ts
import { encodeBinary, decodeBinary } from 'png-compressor'

const buffer = new ArrayBuffer(8)

const pngImage = await encodeBinary(buffer)
const decoded =  await decodeBinary(pngImage)

assert.deepEqual(decoded, buffer)
```

## Browser

### Create image element

```ts
import * as png from 'png-compressor'

const object = { key: 'value' }

const image = await png.encodeToImage(object)
```

Or pass an image element as second argument to render into it.

```ts
const image = document.createElement('img')

await png.encodeToImage(object, image)
```

### Download as image

```ts
const blob = await png.encodeToBlob(object)

png.downloadImage(blob, 'example.png')
```

## Server (Node.js)

### Write to image file

```ts
import fs from 'node:fs/promises'
import * as png from 'png-compressor'

const object = { key: 'value' }

const encoded = await png.encode(source)
await fs.writeFile('test.png', Buffer.from(encoded))
```

### Read from image file

```ts
const buffer = await fs.readFile('test.png')
const decoded = await png.decode(buffer.buffer)
```

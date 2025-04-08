# PNG Compressor

> Compress and encode data as Portable Network Graphics (PNG) image

![](screenshot.jpg)

**[Demo](https://eliot-akira.github.io/png-compressor/) · [API](https://eliot-akira.github.io/png-compressor/api/) · [Source](https://github.com/eliot-akira/png-compressor)**

## Why

It can be useful to encode data or application state into an image file for sharing easily - compared to JSON or ZIP format, which might not be possible to upload to a discussion forum.

Such images are sometimes called "cartridges", referring to retro game ROM cards.

## How

There are two ways to store data in a PNG image.

1. Create an image by encoding the data into [color channels](#color-channels)
2. Attach invisible [data blocks](#data-blocks) to an existing image

Optionally the data is `gzip` compressed using the [Compression Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Compression_Streams_API), well-supported by browsers and server-side JavaScript runtimes.

## Install

```sh
npm install --save png-compressor
```

## Color channels

The given data is converted into an image by encoding every byte into the color channels (red/green/blue). The opacity (alpha) channel is not used because it affects color values.

The encoded buffer is written to a file, or rendered as an image element and downloaded.

### Encode JSON-serializable value

```ts
import { encode, decode } from 'png-compressor'

const object = { key: 'value' }

const pngImage = await encode(object)
const decoded = await decode(pngImage)

assert.deepEqual(decoded, object)
```

### Encode binary data

```ts
import { encodeBinary, decodeBinary } from 'png-compressor'

const buffer = new ArrayBuffer(8)

const pngImage = await encodeBinary(buffer)
const decoded = await decodeBinary(pngImage)

assert.deepEqual(decoded, buffer)
```

## Data blocks

Blocks of data can be attached to an existing image.

### Encode

Each block is given a keyword, which can be used to identify a single block or group multiple blocks.

```ts
import fs from 'node:fs/promises'
import {
  encodeImageWithDataBlocks,
  createDataBlock,
  getDataBlockValue,
  getDataBlockValues.
} from 'png-compressor

const imageBuffer = await fs.readFile('./example.png')

const image = encodeImageWithDataBlocks(imageBuffer, [
  createDataBlock('text', 'hello'),
  createDataBlock('object', { key: 'value' }),
  createDataBlock('file', new ArrayBuffer(8)),
  createDataBlock('products', '12345'),
  createDataBlock('products', '67890'),
])

await fs.writeFile('./example-with-data.png', image.data)

const { blocks } = decodeImageWithDataBlocks(image.data)

const text = getDataBlockValues('text', blocks)
const json = getDataBlockValues('object', blocks)
const file = getDataBlockValues('file', blocks)
const products = getDataBlockValues('products', blocks)
```

### Decode

### Text block

### JSON block

### Binary block

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

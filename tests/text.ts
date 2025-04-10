import fs from 'node:fs/promises'
import { test, is, ok, run } from 'testra'
import {
  decodeImageDataBlocks,
  encodeImageDataBlocks,
  getDataBlock,
} from './common.ts'

export function testEncodeImageTextBlock({ id, sourceBuffer, value }) {
  /**
   * Data block - Text
   */
  test(`Data block with text - Image #${id}`, async () => {
    // Source image

    const buffer = sourceBuffer // await fs.readFile(sourcePng)

    // ok(true, 'load source image')
    // ok(buffer instanceof Buffer, 'got image buffer')
    // console.log('Souce image size', buffer.byteLength, 'bytes')

    // Encode image with data blocks

    const encodedKey = `example-${id}`
    let encoded = await encodeImageDataBlocks(buffer, {
      [encodedKey]: value,
    })
    let encodedImageSize = encoded.byteLength
    // console.log('Encoded image size', encodedImageSize)

    // Target image

    let targetImage = `./tests/generated/embed-text-${id}.png`
    await fs.writeFile(targetImage, encoded)

    ok(true, `wrote target image: ${targetImage}`)

    // Decode

    let targetBuffer = await fs.readFile(targetImage)

    ok(true, 'load target image')
    ok(targetBuffer instanceof Buffer, 'got image buffer')
    is(
      encodedImageSize,
      targetBuffer.byteLength,
      'target image buffer is same size as encoded image'
    )
    // console.log('Target image size', targetBuffer.byteLength, 'bytes')

    let targetDecoded = await decodeImageDataBlocks(targetBuffer)
    ok(true, 'decoded image metadata')
    // console.log(targetDecoded.blocks)

    const decodedBuffer = getDataBlock(encodedKey, targetDecoded.blocks)

    is(value, decodedBuffer, 'decoded value is the same as encoded value')
  })
}

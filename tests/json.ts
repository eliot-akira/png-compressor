import fs from 'node:fs/promises'
import { test, is, ok, run } from 'testra'
import {
  decodeImageDataBlocks,
  encodeImageDataBlocks,
  getDataBlock,
} from './common.ts'

export function testEncodeImageJsonBlock({ id, sourceBuffer, value }) {
  /**
   * Data block - JSON (compressed)
   */
  test(`Data block with JSON (compressed) - Image #${id}`, async () => {
    const buffer = sourceBuffer // await fs.readFile(sourcePng)

    const encodedKey = `example-${id}`

    let encoded = await encodeImageDataBlocks(buffer, {
      [encodedKey]: value,
    })
    let encodedImageSize = encoded.byteLength

    ok(true, 'compressed JSON block')
    // console.log('Encoded image size', encodedImageSize)

    let targetImage = `./tests/generated/embed-json-compressed-${id}.png`
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

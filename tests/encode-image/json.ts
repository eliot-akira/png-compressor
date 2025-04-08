import fs from 'node:fs/promises'
import { test, is, ok, run } from 'testra'
import {
  decodeImageWithDataBlocks,
  encodeImageWithDataBlocks,
  getDataBlockValue,
} from '../common.ts'

export function testEncodeImageJsonBlock({
  id,
  sourceBuffer,
  value
}) {

  /**
   * Data block - JSON (compressed)
   */
  test(`Data block with JSON (compressed) - Image #${id}`, async () => {

    const buffer = sourceBuffer // await fs.readFile(sourcePng)

    const encodedKey = `example-${id}`

    let encoded = await encodeImageWithDataBlocks(buffer, [
      {
        type: 'json',
        name: encodedKey,
        value,
      },
    ])
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

    let targetDecoded = await decodeImageWithDataBlocks(targetBuffer)
    ok(true, 'decoded image metadata')

    // console.log(targetDecoded.blocks)

    const decodedBuffer = getDataBlockValue(
      encodedKey,
      targetDecoded.blocks
    )

    is(value, decodedBuffer, 'decoded value is the same as encoded value')
  })

}
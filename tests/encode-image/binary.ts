import fs from 'node:fs/promises'
import { test, is, ok, run } from 'testra'
import {
  decodeImageWithDataBlocks,
  encodeImageWithDataBlocks,
  getDataBlockValue,
} from '../common.ts'

export function testEncodeImageBinaryBlock({ id, sourceBuffer, value }) {
  /**
   * Data block - Binary (compressed)
   */
  test(`Data block with binary (compressed) - Image #${id}`, async () => {
    const encodedKey = `example-${id}`
    let encoded = await encodeImageWithDataBlocks(sourceBuffer, [
      {
        type: 'bin',
        name: encodedKey,
        value,
      },
    ])
    ok(encoded, 'encoded binary')
    let encodedImageSize = encoded.byteLength

    let targetImage = `./tests/generated/embed-binary-compressed-${id}.png`
    await fs.writeFile(targetImage, encoded)

    ok(true, `wrote target image: ${targetImage}`)

    // Decode

    let targetBuffer = await fs.readFile(targetImage)

    // ok(targetBuffer, 'load target image')
    // ok(targetBuffer instanceof Buffer, 'got image buffer')
    is(
      encodedImageSize,
      targetBuffer.byteLength,
      'target image buffer is same size as encoded image'
    )
    // console.log('Target image size', targetBuffer.byteLength, 'bytes')

    let targetDecoded = await decodeImageWithDataBlocks(targetBuffer)
    ok(true, 'decoded image metadata')

    const decodedBuffer = getDataBlockValue(
      encodedKey,
      targetDecoded.blocks
    )

    is(
      value.byteLength,
      decodedBuffer.byteLength,
      'decoded value has the same length'
    )
    is(
      value,
      decodedBuffer,
      'decoded value is the same as encoded value'
    )
  })
}

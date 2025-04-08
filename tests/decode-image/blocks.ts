import { test, is, ok, run } from 'testra'
import {
  decodeImageWithDataBlocks,
} from '../common.ts'

export function testDecodeImageDataBlocks({
  id,
  sourceBuffer
}) {

  /**
   * Decode with data blocks
   */
  test(`Decode with data blocks image #${id}`, async () => {
    const buffer = sourceBuffer

    const { image, blocks } = await decodeImageWithDataBlocks(buffer)

    ok(true, 'decoded image metadata')
    // console.log('decoded', decoded)

    ok(image, 'has image')
    is('number', typeof image.width, 'has image width')
    is('number', typeof image.height, 'has image height')
    is(true, image.data instanceof Uint8Array, 'image data is Uint8Array')
    is(true, Array.isArray(blocks), 'has data blocks')
  })

}
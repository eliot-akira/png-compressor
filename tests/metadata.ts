import { test, is, ok, run } from 'testra'
import {
  decodeImageMetadata
} from './common.ts'

export function testDecodeImage({
  id,
  sourceBuffer
}) {

  /**
   * Decode image
   */
  test(`Decode source image #${id}`, async () => {

    const buffer = sourceBuffer
    const {
      image
    } = await decodeImageMetadata(buffer)

    ok(true, 'decoded image metadata')

    ok(image, 'has image')
    is('number', typeof image.width, 'has image width')
    is('number', typeof image.height, 'has image height')
    is(true, image.data instanceof Uint8Array, 'image data is Uint8Array')

  })
}
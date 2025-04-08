import fs from 'node:fs/promises'
import { test, is, ok, run } from 'testra'
import {
  encode,
  decode,
} from '../common.ts'

export function testEncodeImageColors({ value }) {
  test('Encode and decode string into color channels', async () => {

    const values: any[] = []
    for (let i=0; i < 10; i++) {
      values.push(value)
    }

    const encoded = await encode(values)
    const testPng = './tests/fixtures/colors.png'

    await fs.writeFile(testPng, Buffer.from(encoded))

    const buffer = await fs.readFile(testPng)
    const decoded = await decode(buffer.buffer)

    is(values, decoded, 'decoded exactly the same')
  })
}

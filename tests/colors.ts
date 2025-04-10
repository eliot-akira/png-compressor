import fs from 'node:fs/promises'
import { test, is, ok, run } from 'testra'
import {
  encodeImageData,
  decodeImageData
} from './common.ts'

export function testDecodeImageColors() {
  test(`Decode string from color channels`, async () => {

    const value = 123
    const values: any[] = []
    for (let i=0; i < 10; i++) {
      values.push(value)
    }

    const testPng = `./tests/fixtures/colors.png`

    const encoded = await encodeImageData(values)
    await fs.writeFile(testPng, Buffer.from(encoded))

    const buffer = await fs.readFile(testPng)
    const decoded = await decodeImageData(buffer)

    is(values, decoded, 'decoded exactly the same')
  })
}

export function testEncodeImageColors({
  id,
  value
}) {
  test(`Encode and decode string into color channels - #${id}`, async () => {

    const values: any[] = []
    for (let i=0; i < 10; i++) {
      values.push(value)
    }

    const encoded = await encodeImageData(values)
    const testPng = `./tests/generated/colors-${id}.png`

    await fs.writeFile(testPng, Buffer.from(encoded))

    const buffer = await fs.readFile(testPng)
    const decoded = await decodeImageData(buffer)

    is(values, decoded, 'decoded exactly the same')
  })
}

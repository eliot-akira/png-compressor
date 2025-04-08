import fs from 'node:fs/promises'
import { test, is, ok, run } from 'testra'
import {
  testEncodeImageColors,
  testEncodeImageTextBlock,
  testEncodeImageJsonBlock,
  testEncodeImageBinaryBlock,
} from './encode-image'
import { testDecodeImage, testDecodeImageDataBlocks } from './decode-image'

run(async () => {
  const jsonValue = JSON.parse(
    await fs.readFile('./tests/fixtures/example.json', 'utf8')
  )

  testEncodeImageColors({
    value: jsonValue,
  })

  const testImageIds = [1, 2]

  for (const id of testImageIds) {
    const sourcePng = `./tests/fixtures/embed-source-${id}.png`
    const sourceBuffer = await fs.readFile(sourcePng)

    const sourceTextFile = `./tests/fixtures/example-${id}.txt`
    const textValue = await fs.readFile(sourceTextFile, 'utf8')
    const bufferValue = await fs.readFile(sourceTextFile)

    const testData = {
      id,
      sourceBuffer,
      value: textValue,
    }

    testDecodeImage(testData)
    testDecodeImageDataBlocks(testData)
    testEncodeImageTextBlock(testData)
    testEncodeImageJsonBlock({
      ...testData,
      value: jsonValue,
    })
    testEncodeImageBinaryBlock({
      ...testData,
      value: bufferValue,
    })
  }
})

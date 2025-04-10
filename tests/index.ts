import fs from 'node:fs/promises'
import { test, is, ok, run } from 'testra'
import { testDecodeImageColors, testEncodeImageColors } from './colors.ts'
import { testEncodeImageTextBlock } from './text.ts'
import { testEncodeImageJsonBlock } from './json.ts'
import { testEncodeImageBinaryBlock } from './binary.ts'
import { testDecodeImageDataBlocks } from './blocks.ts'
import { testDecodeImage } from './metadata'

run(async () => {

  const jsonValue = JSON.parse(
    await fs.readFile('./tests/fixtures/example.json', 'utf8')
  )

  testDecodeImageColors()

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

    testEncodeImageColors({
      id,
      value: textValue,
    })  
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

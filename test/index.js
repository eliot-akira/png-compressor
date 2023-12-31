import test from 'node:test'
import assert from 'node:assert'
import fs from 'node:fs/promises'
import { encode, decode } from '../build/esm/index.js'

const encodableDataTypes = [
  ['string', 'Hello, world'],
  ['number', 123],
  ['boolean', true],
  ['null', null],
]

// Array of all types
const arrayTypeValues = encodableDataTypes.map(([_, value]) => value)
arrayTypeValues.push(JSON.parse(JSON.stringify(arrayTypeValues)))

// Object of all types
const objectTypeValue = encodableDataTypes.reduce((obj, [key, value]) => {
  obj[key] = value
  return obj
}, {})
arrayTypeValues.push(JSON.parse(JSON.stringify(objectTypeValue)))

encodableDataTypes.push(['array', arrayTypeValues])
encodableDataTypes.push(['object', objectTypeValue])

test('Encode and decode string', async () => {

  const source = encodableDataTypes
  console.log('encode', source)

  const encoded = await encode(source)

  const testPng = './test/test.png'

  await fs.writeFile(testPng, Buffer.from(encoded))
  const buffer = await fs.readFile('./test/test.png')

  const decoded = await decode(buffer.buffer)

  console.log('decoded', decoded)

  assert.deepEqual(source, decoded)

  await fs.rm(testPng)
})

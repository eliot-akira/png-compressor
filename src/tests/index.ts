import { test, runTests } from './runner.ts'
import type * as PNGCompressor from '../index.ts'

// Tests

const { PNGCompressor: png } = window as Window &
  typeof globalThis & {
    PNGCompressor: typeof PNGCompressor
  }

console.log('PNGCompressor', png)

const encodableDataTypes: [key: string, value: any][] = [
  ['string', 'Hello, world'],
  ['number', 123],
  ['boolean', true],
  ['null', null],
]

// Array of all types
const arrayTypeValues: any[] = encodableDataTypes.map(([_, value]) => value)
arrayTypeValues.push(JSON.parse(JSON.stringify(arrayTypeValues)))

// Object of all types
const objectTypeValue: {
  [key: string]: any
} = encodableDataTypes.reduce((obj, [key, value]) => {
  obj[key] = value
  return obj
}, {} as any)
arrayTypeValues.push(JSON.parse(JSON.stringify(objectTypeValue)))

encodableDataTypes.push(['array', arrayTypeValues])
encodableDataTypes.push(['object', objectTypeValue])

test('Array buffer', async (it, is) => {
  for (const [type, source] of encodableDataTypes) {
    const encoded = await png.valueToArrayBuffer(source)

    it(
      `valueToArrayBuffer() converts ${type} to array buffer`,
      encoded instanceof ArrayBuffer,
    )

    const decoded = await png.arrayBufferToValue(encoded)

    it(
      `arrayBufferToValue() converts array buffer to original value (${type})`,
      is(decoded, source),
    )
  }
})

test('Compress', async (it, is) => {
  for (const [type, source] of encodableDataTypes) {
    const encoded = await png.compress(await png.valueToArrayBuffer(source))

    it(
      `compress() compresses ${type} to array buffer`,
      encoded instanceof ArrayBuffer,
    )

    const decoded = await png.arrayBufferToValue(await png.decompress(encoded))

    it(
      `decompress() decompresses array buffer to original value (${type})`,
      is(decoded, source),
    )
  }
})

// ...

test('PNG', async (it, is) => {
  for (const [type, source] of encodableDataTypes) {
    const encoded = await png.encodeImageData(source)

    it(
      `encode() encodes ${type} to array buffer`,
      encoded instanceof ArrayBuffer,
    )

    const decoded = await png.decodeImageData(encoded)

    it(
      `decode() decodes array buffer to original value (${type})`,
      is(decoded, source),
    )
  }
})

// Report

const style = document.createElement('style')
style.innerText = `
html, body { margin: 0 }
body { margin: 2rem; }
.success { color: green }    
.fail { color: red }      
`
document.head.appendChild(style)

const $result = document.createElement('div')
document.body.appendChild($result)

runTests().then((results) => {
  const { tests, pass, fail, total } = results

  $result.innerHTML = `

  <h1>Tests</h1>

  <h2>Total <span class=${
    pass === total ? 'success' : 'fail'
  }>${pass} / ${total}</span> pass</h2>

  ${tests
    .map(
      ({ title, assertions, error }) => `

    <h3>${title}</h3>

    ${assertions
      .map(
        ({ title, result }) => `
      <p class=${result ? 'success' : 'fail'}>${
        result ? '✔' : '✖'
      } ${title}</p>
    `,
      )
      .join('')}

    ${error ? '<p class=fail>' + error + '</p>' : ''}

  `,
    )
    .join('')}
`
})

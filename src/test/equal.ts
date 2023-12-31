// Equality

const { getOwnPropertySymbols, is, keys, prototype } = Object
const { hasOwnProperty, valueOf } = prototype
const { isView } = ArrayBuffer
const { Node } = globalThis

const isEqualArray = (
  a: unknown[],
  b: unknown[],
  compareMap: Map<unknown, unknown>,
): boolean => {
  if (a.length !== b.length) return false

  for (let i = a.length - 1; i >= 0; i--) {
    if (!isEqualGeneral(a[i], b[i], compareMap)) return false
  }

  return true
}

const isEqualMapAdvanced = (
  a: Map<unknown, unknown>,
  b: Map<unknown, unknown>,
  compareMap: Map<unknown, unknown>,
): boolean => {
  const entriesA = Array.from(a.entries())
  const entriesB = Array.from(b.entries())

  /* eslint-disable no-labels */
  outer: for (let i = entriesA.length - 1; i >= 0; i--) {
    const entryA = entriesA[i]

    for (let j = entriesB.length - 1; j >= 0; j--) {
      const entryB = entriesB[j]

      if (
        isEqualGeneral(entryA[0], entryB[0], compareMap) &&
        isEqualGeneral(entryA[1], entryB[1], compareMap)
      ) {
        entriesB.splice(j, 1)

        continue outer
      }
    }

    return false
  }

  return true
}

const isEqualMap = (
  a: Map<unknown, unknown>,
  b: Map<unknown, unknown>,
  compareMap: Map<unknown, unknown>,
): boolean => {
  if (a.size !== b.size) return false

  for (const [key, valueA] of a.entries()) {
    const valueB = b.get(key)

    if (!isEqualGeneral(valueA, valueB, compareMap)) {
      return isEqualMapAdvanced(a, b, compareMap)
    }

    if (valueB === undefined && !b.has(key)) return false
  }

  return true
}

const isEqualSetAdvanced = (
  a: Set<unknown>,
  b: Set<unknown>,
  compareMap: Map<unknown, unknown>,
): boolean => {
  const valuesA = Array.from(a.values())
  const valuesB = Array.from(b.values())

  outer: for (let i = valuesA.length - 1; i >= 0; i--) {
    const valueA = valuesA[i]

    for (let j = valuesB.length - 1; j >= 0; j--) {
      const valueB = valuesB[j]

      if (isEqualGeneral(valueA, valueB, compareMap)) {
        valuesB.splice(j, 1)

        continue outer
      }
    }

    return false
  }

  return true
}

const isEqualSet = (
  a: Set<unknown>,
  b: Set<unknown>,
  compareMap: Map<unknown, unknown>,
): boolean => {
  if (a.size !== b.size) return false

  for (const [valueA] of a.entries()) {
    if (!b.has(valueA)) return isEqualSetAdvanced(a, b, compareMap)
  }

  return true
}

const isEqualDate = (a: Date, b: Date): boolean => {
  return is(a.getTime(), b.getTime())
}

const isEqualRegExp = (a: RegExp, b: RegExp): boolean => {
  return a.source === b.source && a.flags === b.flags
}

const isEqualArrayBuffer = (a: ArrayBuffer, b: ArrayBuffer): boolean => {
  if (a.byteLength !== b.byteLength) return false

  return isEqualTypedArray(new Uint8Array(a), new Uint8Array(b))
}

function isEqualTypedArray<
  T extends
    | Int8Array
    | Uint8Array
    | Uint8ClampedArray
    | Int16Array
    | Uint16Array
    | Int32Array
    | Uint32Array
    | Float32Array
    | Float64Array
    | BigInt64Array
    | BigUint64Array,
>(a: T, b: T): boolean {
  if (a.length !== b.length) return false

  for (let i = a.length - 1; i >= 0; i--) {
    if (a[i] !== b[i]) return false
  }

  return true
}

const isEqualValueOf = (
  a: object,
  b: object,
  compareMap: Map<unknown, unknown>,
): boolean => {
  return isEqualGeneral(a.valueOf(), b.valueOf(), compareMap)
}

const isEqualObject = (
  a: Record<string | number | symbol, unknown>,
  b: Record<string | number | symbol, unknown>,
  compareMap: Map<unknown, unknown>,
): boolean => {
  const propertiesA = keys(a)
  const propertiesB = keys(b)

  if (propertiesA.length !== propertiesB.length) return false

  for (let i = propertiesA.length - 1; i >= 0; i--) {
    const property = propertiesA[i]
    const valueA = a[property]
    const valueB = b[property]

    if (!isEqualGeneral(valueA, valueB, compareMap)) return false

    if (valueB === undefined && !hasOwnProperty.call(b, property)) return false
  }

  const symbolsA = getOwnPropertySymbols(a)
  const symbolsB = getOwnPropertySymbols(b)

  if (symbolsA.length !== symbolsB.length) return false

  for (let i = symbolsA.length - 1; i >= 0; i--) {
    const symbol = symbolsA[i]
    const valueA = a[symbol]
    const valueB = b[symbol]

    if (!isEqualGeneral(valueA, valueB, compareMap)) return false

    if (valueB === undefined && !hasOwnProperty.call(b, symbol)) return false
  }

  return true
}

function isEqualGeneral(
  a: any,
  b: any,
  compareMap: Map<unknown, unknown>,
): boolean {
  if (is(a, b)) return true

  if (
    typeof a !== 'object' ||
    typeof b !== 'object' ||
    a === null ||
    b === null
  ) {
    return false
  }

  const { constructor } = a
  const { constructor: constructorB } = b

  if (constructor && constructorB && constructor !== constructorB) {
    return false
  }

  if (compareMap.get(a) === b) return true

  compareMap.set(a, b)

  if (!constructor || !constructorB) {
    if (
      (!constructor || constructor === Object) &&
      (!constructorB || constructorB === Object)
    ) {
      return isEqualObject(a, b, compareMap)
    }
    return false
  }
  if (constructor === Array) {
    return isEqualArray(a, b, compareMap)
  }
  if (constructor === Map) {
    return isEqualMap(a, b, compareMap)
  }
  if (constructor === Set) {
    return isEqualSet(a, b, compareMap)
  }
  if (constructor === Date) {
    return isEqualDate(a, b)
  }
  if (constructor === RegExp) {
    return isEqualRegExp(a, b)
  }
  if (constructor === ArrayBuffer) {
    return isEqualArrayBuffer(a, b)
  }
  if (isView(a)) {
    return isEqualTypedArray(a, b)
  }
  if (
    constructor === Promise ||
    constructor === WeakMap ||
    constructor === WeakSet ||
    constructor === Node
  ) {
    return false
  }
  if (a.valueOf !== valueOf) {
    return isEqualValueOf(a, b, compareMap)
  }
  return isEqualObject(a, b, compareMap)
}

export function isEqual(a: unknown, b: unknown): boolean {
  return isEqualGeneral(a, b, new Map())
}

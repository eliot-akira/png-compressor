import { isEqual } from './equal.ts'
// Test runner

const tests: Test[] = []

export type Test = {
  title: string
  callback: TestCallback
  assertions: Assertion[]
  result?: boolean
  error?: unknown
}

export type TestCallback = (it: Function, is: Function) => any

export type Assertion = {
  title: string
  result: boolean
}

export const test = (title: string, callback: TestCallback) =>
  tests.push({
    title,
    callback,
    assertions: [],
    result: undefined,
    error: undefined,
  })

export const runTests = async (report = consoleReporter) => {
  report('tests', tests)
  for (const test of tests) {
    report('test', { test })
    const it = (title: string, result: boolean) => {
      report('assert', { title, result })
      test.assertions.push({ title, result })
    }
    try {
      await test.callback(it, isEqual)
      test.result = test.assertions.filter((a) => !a.result).length === 0
    } catch (error) {
      report('error', error)
      test.result = false
      test.error = error
    }
    report('testEnd', test)
  }

  // Report

  const pass = tests.map((test) => test.result).filter((r) => r).length
  const total = tests.length
  const fail = total - pass

  const results = {
    tests,
    pass,
    fail,
    total,
  }

  report('testsEnd', results)

  return results
}

// Reporter

export function consoleReporter(type: string, data: any) {
  switch (type) {
    case 'tests':
      console.log('Tests')
      break
    case 'testsEnd':
      {
        const { pass, total } = data
        console.log(pass, '/', total)
      }
      break
    case 'test':
      {
        const { test } = data
        console.group(test.title)
      }
      break
    case 'testEnd':
      console.groupEnd()
      break
    case 'assert':
      {
        const { title, result } = data
        console[result ? 'log' : 'warn'](title, !!result)
      }
      break
    case 'error':
      console.error(data)
      break
    default:
      break
  }
}

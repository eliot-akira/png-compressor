import esbuild from 'esbuild'
import fs from 'node:fs/promises'
import { transformExtPlugin } from '@gjsify/esbuild-plugin-transform-ext'

const args = process.argv.slice(2)
let command = args.shift() || 'build'
const isDev = command === 'dev'

if (isDev) command = args.shift() // Optional: cjs, esm, web

;(async () => {

  const { name } = JSON.parse(await fs.readFile('./package.json'))

  const esbuildOptions = {
    entryPoints: [
      `./src/${name}.ts`,
      './src/test/index.ts'
    ],
    // outfile: `./docs/${name}.js`,
    outdir: './docs',
    assetNames: '',
    format: 'iife',
    // globalName: 'PNGCompressor',
    platform: 'browser',
    logLevel: 'info',
    bundle: true,
    minify: !isDev,
    sourcemap: true,
    jsx: 'automatic',
    plugins: [
      /**
       * Built ES module format expects import from .js
       */
      transformExtPlugin({ outExtension: { '.ts': '.js' } })
    ]
  }

  if (command === 'cjs') {

    // Individual files
    delete esbuildOptions.outfile

    Object.assign(esbuildOptions, {
      entryPoints: ['./src/**/*.ts'],
      outdir: './build/cjs',
      format: 'cjs',
      platform: 'node',
      bundle: false,
      minify: false,
      sourcemap: false,
    })
  } else if (command === 'esm') {

    delete esbuildOptions.outfile

    Object.assign(esbuildOptions, {
      entryPoints: ['./src/**/*.ts'],
      outdir: './build/esm',
      format: 'esm',
      platform: 'node',
      bundle: false,
      minify: false,
      sourcemap: false,
    })
  } else if (command === 'web') {

    // Object.assign(esbuildOptions, {
    //   outfile: `./build/web/${name}.js`,
    // })

  } else {

    // docs

  }

  const context = await esbuild.context(esbuildOptions)

  await context.rebuild()

  if (command === 'cjs') {
    await fs.writeFile(`build/cjs/package.json`, `{"type": "commonjs"}`)
  } else if (command === 'esm') {
    await fs.writeFile(`build/esm/package.json`, `{"type": "module"}`)
  } else if (command === 'web') {
    // Copy from docs
    await Promise.all([
      fs.copyFile(`./docs/${name}.js`, `./build/web/${name}.js`),
      fs.copyFile(`./docs/${name}.js.map`, `./build/web/${name}.js.map`)
    ])
  }

  if (isDev) {
    await context.watch()
    await context.serve({
      port: 8080,
      servedir: './docs'
    })
  } else {
    process.exit()
  }

})().catch((error) => {
  console.error(error)
  process.exit(1)
})

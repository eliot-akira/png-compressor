import esbuild from 'esbuild'
import fs from 'node:fs/promises'

const name = 'png-compressor'

const command = process.argv.slice(2).shift() || 'build' // or dev

const isDev = command === 'dev'
const onError = (error) => {
  console.error(error)
  process.exit(1)
}

;(async () => {

  const esbuildOptions = {
    entryPoints: ['./src/index.ts'],
    outfile: `./docs/${name}.js`,
    format: 'iife',
    globalName: 'PNGCompressor',
    platform: 'browser',
    logLevel: 'info',
    bundle: true,
    minify: !isDev,
    sourcemap: true,
    jsx: 'automatic',
  }

  if (command === 'cjs') {
    Object.assign(esbuildOptions, {
      entryPoints: ['./src/index.ts'],
      outfile: './build/cjs/index.js',
      format: 'cjs',
      platform: 'node',
    })
  } else if (command === 'esm') {

    delete esbuildOptions.outfile

    Object.assign(esbuildOptions, {
      entryPoints: ['./src/**/*.ts'],
      outdir: './build/esm/',
      format: 'esm',
      platform: 'node',
    })
  } else if (command === 'web') {
    Object.assign(esbuildOptions, {
      outfile: `./build/web/${name}.js`,
    })
  }

  const context = await esbuild.context(esbuildOptions)

  await context.rebuild()

  if (command === 'cjs') {
    await fs.writeFile(`build/cjs/package.json`, `{"type": "commonjs"}`)
  } else if (command === 'esm') {
    await fs.writeFile(`build/esm/package.json`, `{"type": "module"}`)
  } else if (command === 'web') {
    // Copy to docs
    await Promise.all([
      fs.copyFile(esbuildOptions.outfile, `./docs/${name}.js`),
      fs.copyFile(esbuildOptions.outfile + '.map', `./docs/${name}.js.map`)
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

})().catch(onError)

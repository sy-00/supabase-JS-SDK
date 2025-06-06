import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
//import { glob } from 'node:fs/promises'
import { readdir, stat } from 'node:fs/promises'
import tailwindcss from '@tailwindcss/vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function findHtmlFiles(dir) {
  let results = []
  const entries = await readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = resolve(dir, entry.name)
    if (entry.isDirectory()) {
      const subFiles = await findHtmlFiles(fullPath)
      results = results.concat(subFiles)
    } else if (entry.isFile() && fullPath.endsWith('.html')) {
      results.push(fullPath)
    }
  }

  return results
}

const inputs = await findHtmlFiles(resolve(__dirname, 'src'))

console.log(inputs)

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],

  base: '/supabase-JS-SDK/',

  root: resolve(__dirname, 'src'),
  build: {
    emptyOutDir: true,
    rollupOptions: {
      input: inputs,
    },
    outDir: resolve(__dirname, 'dist'),
  },
})
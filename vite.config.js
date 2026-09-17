import { defineConfig } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import { resolve } from 'path'
import { globSync } from 'glob'

const inputs = globSync('src/**/index.html').reduce((acc, file) => {
    const relativePath = file.replace(/^src\//, '')
    const name = relativePath === 'index.html' ? 'main' : relativePath.replace(/\/index\.html$/, '')
    acc[name] = resolve(__dirname, file)
    return acc
}, {})

export default defineConfig({
    // Si hébergé sur https://utilisateur.github.io/mon-projet/, décommente et ajuste la ligne suivante :
    // base: '/mon-projet/',
    root: 'src',

    plugins: [
        createHtmlPlugin({
            minify: true,
        }),
    ],

    build: {
        outDir: '../docs',
        emptyOutDir: true,
        rollupOptions: {
            input: inputs,
        },
    },
})

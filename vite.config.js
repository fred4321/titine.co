import { defineConfig } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import { resolve } from 'path'
import { globSync } from 'glob'
import ejs from 'ejs'

const inputs = globSync('src/**/index.html').reduce((acc, file) => {
    const relativePath = file.replace(/^src\//, '')
    const name = relativePath === 'index.html' ? 'main' : relativePath.replace(/\/index\.html$/, '')
    acc[name] = resolve(__dirname, file)
    return acc
}, {})

const renderPartials = {
    name: 'render-html-partials',
    enforce: 'pre',
    transformIndexHtml: {
        order: 'pre',
        handler(html, context) {
            return ejs.render(html, {}, {
                filename: context.filename,
                root: resolve(__dirname, 'src'),
            })
        },
    },
}

export default defineConfig({
    // Si hébergé sur https://utilisateur.github.io/mon-projet/, décommente et ajuste la ligne suivante :
    // base: '/mon-projet/',
    root: 'src',

    plugins: [
        renderPartials,
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

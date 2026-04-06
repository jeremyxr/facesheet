import { defineConfig, loadEnv } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'

function feedbackDevHandler(): Plugin {
  return {
    name: 'feedback-dev-handler',
    configureServer(server) {
      server.middlewares.use('/api/feedback', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }
        let body = ''
        req.on('data', (chunk: Buffer) => { body += chunk.toString() })
        req.on('end', () => {
          const data = JSON.parse(body)
          console.log('\n📝 [Feedback received]', {
            user: data.userName,
            comment: data.comment,
            route: data.route,
            element: data.feedbackId || data.elementSelector,
          })
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ ok: true, dev: true }))
        })
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), feedbackDevHandler()],
    server: {
      proxy: {
        '/api/claude': {
          target: 'https://api.anthropic.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/claude/, ''),
          headers: {
            'x-api-key': env.VITE_ANTHROPIC_API_KEY ?? '',
            'anthropic-version': '2023-06-01',
          },
        },
      },
    },
  }
})

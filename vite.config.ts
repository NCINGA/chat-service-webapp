import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
  },
  build: {
    lib: {
      entry: 'src/main.tsx',
      name: 'ChatWidget',
      fileName: (format) => `chat-widget.${format}.js`
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    },
    emptyOutDir: false,
    outDir: '/var/www/html/dist',
  },
  server: {
    proxy: {
      '/backend': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/backend/, ''),
        ws: true,
      },
    },
  },
});

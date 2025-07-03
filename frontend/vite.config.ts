import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks - bibliotecas principais
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          
          // UI chunks - componentes Radix UI
          ui: [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-collapsible',
            '@radix-ui/react-label',
            '@radix-ui/react-menubar',
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-separator',
            '@radix-ui/react-slot',
            '@radix-ui/react-switch',
            '@radix-ui/react-toggle',
            '@radix-ui/react-toggle-group',
            '@radix-ui/react-tooltip',
          ],
          
          // Chart chunks - bibliotecas de gráficos
          charts: ['chart.js', 'react-chartjs-2', 'recharts'],
          
          // Calendar chunks - FullCalendar
          calendar: [
            '@fullcalendar/core',
            '@fullcalendar/react',
            '@fullcalendar/daygrid',
            '@fullcalendar/timegrid',
            '@fullcalendar/interaction',
          ],
          
          // Form chunks - formulários e validação
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          
          // Query chunks - React Query
          query: ['@tanstack/react-query', '@tanstack/react-query-devtools'],
          
          // Table chunks - React Table
          table: ['@tanstack/react-table'],
          
          // Icons chunks - ícones
          icons: ['lucide-react', 'react-icons', '@tabler/icons-react'],
          
          // Utils chunks - utilitários
          utils: ['date-fns', 'class-variance-authority', 'tailwind-merge', 'clsx'],
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'axios',
      'react-router-dom',
      '@tanstack/react-query',
      'lucide-react',
      'date-fns',
    ],
    exclude: [
      '@tanstack/react-query-devtools', // Excluir devtools do bundle de produção
    ],
  },
  server: {
    hmr: {
      overlay: false,
    },
  },
  preview: {
    port: 4173,
    host: true,
  },
})

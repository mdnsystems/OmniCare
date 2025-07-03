import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'sonner'

import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext'
import { ClinicaProvider } from './contexts/ClinicaContext'
import { SocketProvider } from './contexts/socket-context'
import { ThemeProvider } from './components/theme-provider'
import './index.css'
import { ClinicaLoader } from './contexts/ClinicaLoader'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <AuthProvider>
          <ClinicaProvider>
            <ClinicaLoader>
              <SocketProvider>
                <App />
                <Toaster />
              </SocketProvider>
            </ClinicaLoader>
          </ClinicaProvider>
        </AuthProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </BrowserRouter>,
)

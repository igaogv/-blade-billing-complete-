import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App'

// FORCE REBUILD TRIGGER - 2025-12-15 15:53:30
// Change timestamp to force Vercel to rebuild completely without cache
console.log('🔧 BUILD TIMESTAMP: 2025-12-15 15:53:30')
console.log('✅ Cache clear enforced')

// Cria uma instância do QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      retry: 1,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)

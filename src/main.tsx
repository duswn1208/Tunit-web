import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import '@/shared/css/multi-level-selector/mls-base.css';
import '@/shared/css/multi-level-selector/mls-container.css';
import '@/shared/css/multi-level-selector/mls-grid.css';
import '@/shared/css/multi-level-selector/mls-list.css';
import '@/shared/css/ui/ui-button.css';
import '@/shared/css/ui/ui-tokens.css';
import '@/shared/css/ui/ui-card.css';
import '@/shared/css/ui/ui-form.css';
import '@/shared/css/ui/ui-input.css';
import '@/shared/css/ui/ui-button.css';
import App from './App.tsx';

// React Query 클라이언트 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // 실패시 재시도 횟수
      staleTime: 300000, // 5분 동안 데이터를 신선한 상태로 유지
      gcTime: 600000, // 10분 동안 캐시 유지
    },
  },
});

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
  // </StrictMode>
);

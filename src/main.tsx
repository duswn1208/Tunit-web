import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './css/multi-level-selector/mls-base.css';
import './css/multi-level-selector/mls-container.css';
import './css/multi-level-selector/mls-grid.css';
import './css/multi-level-selector/mls-list.css';
import './css/ui/ui-button.css';
import './css/ui/ui-tokens.css';
import './css/ui/ui-card.css';
import './css/ui/ui-form.css';
import './css/ui/ui-input.css';
import './css/ui/ui-button.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

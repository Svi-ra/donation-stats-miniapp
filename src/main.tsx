import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { language, t } from './i18n';
import { initTelegram } from './lib/telegram';
import './styles.css';

initTelegram();
document.documentElement.lang = language;
document.title = t.title;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);


import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Helmet, HelmetProvider } from 'react-helmet-async';

console.log('main.tsx: Starting application initialization');

console.log('main.tsx: About to render app');

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);

console.log('main.tsx: App render initiated');

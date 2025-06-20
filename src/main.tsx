
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Helmet, HelmetProvider } from 'react-helmet-async';

console.log('main.tsx: Starting application initialization');

const csp = `
  default-src 'self' https://iqdiaqepjekcqievefvp.supabase.co;
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https://placehold.co https://iqdiaqepjekcqievefvp.supabase.co;
  connect-src 'self' https://iqdiaqepjekcqievefvp.supabase.co wss://iqdiaqepjekcqievefvp.supabase.co;
  frame-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
`;

console.log('main.tsx: About to render app');

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <Helmet>
      <meta http-equiv="Content-Security-Policy" content={csp.replace(/\s{2,}/g, ' ').trim()} />
      <meta http-equiv="X-Content-Type-Options" content="nosniff" />
    </Helmet>
    <App />
  </HelmetProvider>
);

console.log('main.tsx: App render initiated');

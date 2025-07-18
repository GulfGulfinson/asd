import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { getCookieConsent } from './utils/cookieConsent';

// Conditionally load analytics and marketing scripts based on consent
const consent = getCookieConsent();
if (consent.analytics) {
  // Example: Google Analytics
  const script = document.createElement('script');
  script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
  script.async = true;
  document.head.appendChild(script);

  // Declare dataLayer globally
  (window as any).dataLayer = (window as any).dataLayer || [];
}
// gtag function must be global
function gtag(...args: any[]) {
  (window as any).dataLayer.push(args);
}
if (consent.analytics) {
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
}
if (consent.marketing) {
  // Example: Load marketing pixel or script here
  // const marketingScript = document.createElement('script');
  // marketingScript.src = 'https://example.com/marketing.js';
  // document.head.appendChild(marketingScript);
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

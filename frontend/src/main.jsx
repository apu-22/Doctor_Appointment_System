import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// App import 
import App from './App.jsx';

// Entry Point 
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

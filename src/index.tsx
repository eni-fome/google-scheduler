import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createClient } from '@supabase/supabase-js';
import { SessionContextProvider } from '@supabase/auth-helpers-react';

const supabase = createClient(
  "https://xypexkoiuotgjzdsxxuz.supabase.co", 
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5cGV4a29pdW90Z2p6ZHN4eHV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDA2NDI4NzEsImV4cCI6MjAxNjIxODg3MX0.w_iyp-Go467sW4WSGw5VL83HRtiytmWMIwiIzbYXyLA"
)

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
    <App />
    </SessionContextProvider>
  </React.StrictMode>
);


// reportWebVitals.ts
const reportWebVitals = (onPerfEntry?: any) => {
  // Dummy implementation, you can leave it empty or log something to the console
  console.log("Web Vitals Report:", onPerfEntry);
};
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createClient } from '@supabase/supabase-js';
import { SessionContextProvider } from '@supabase/auth-helpers-react';

const SUPABASE_CLIENT = process.env.REACT_APP_SUPABASE_CLIENT;
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;

if (!SUPABASE_CLIENT || !SUPABASE_URL) {
   throw new Error('Supabase environment variables not found');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_CLIENT);

const root = ReactDOM.createRoot(
   document.getElementById('root') as HTMLElement,
);
root.render(
   <React.StrictMode>
      <SessionContextProvider supabaseClient={supabase}>
         <App />
      </SessionContextProvider>
   </React.StrictMode>,
);

// reportWebVitals.ts
const reportWebVitals = (onPerfEntry?: any) => {
   // Dummy implementation, you can leave it empty or log something to the console
   console.log('Web Vitals Report:', onPerfEntry);
};
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
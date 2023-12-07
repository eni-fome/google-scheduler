import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// @ts-expect-error TS(6142): Module './App' was resolved to 'C:/Users/fomea/One... Remove this comment to see the full error message
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createClient } from '@supabase/supabase-js'
import { SessionContextProvider } from '@supabase/auth-helpers-react';

const supabase = createClient(
  "https://xypexkoiuotgjzdsxxuz.supabase.co", 
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5cGV4a29pdW90Z2p6ZHN4eHV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDA2NDI4NzEsImV4cCI6MjAxNjIxODg3MX0.w_iyp-Go467sW4WSGw5VL83HRtiytmWMIwiIzbYXyLA"
)

// @ts-expect-error TS(2345): Argument of type 'HTMLElement | null' is not assig... Remove this comment to see the full error message
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
  <React.StrictMode>
    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    <SessionContextProvider supabaseClient={supabase}>
      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
      <App />
    </SessionContextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
reportWebVitals();

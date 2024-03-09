import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { createClient } from '@supabase/supabase-js';
import { SessionContextProvider } from '@supabase/auth-helpers-react';

const SUPABASE_CLIENT = import.meta.env.VITE_SUPABASE_CLIENT;
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

try {
    if (!SUPABASE_CLIENT || !SUPABASE_URL) {
        throw new Error(
            'Supabase environment variables not found. Make sure both REACT_APP_SUPABASE_CLIENT and REACT_APP_SUPABASE_URL are defined.',
        );
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
} catch (error: any) {
    // Render an error message in case of an error during initialization
    const root = document.getElementById('root');
    if (root) {
        root.innerHTML = `<div style="font-family: sans-serif; padding: 20px; color: red;">${error.message}</div>`;
    }
}

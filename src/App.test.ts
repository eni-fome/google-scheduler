import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App'; // Replace with correct import path


jest.mock('@supabase/auth-helpers-react', () => ({
  useSession: jest.fn(),
}));




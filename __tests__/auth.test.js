import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Auth from '../src/components/Auth';

describe('Auth Component', () => {
  it('renders the email input field', () => {
    render(<Auth />);
    const emailInput = screen.getByPlaceholderText('Email');
    expect(emailInput).toBeInTheDocument();
  });

  it('renders the password input field', () => {
    render(<Auth />);
    const passwordInput = screen.getByPlaceholderText('Password');
    expect(passwordInput).toBeInTheDocument();
  });

  it('renders the correct button text based on registration state', () => {
    render(<Auth />);

    // Check for "Switch to Register" button text
    const registerButton = screen.getByText('Switch to Register');
    expect(registerButton).toBeInTheDocument();
  });
});

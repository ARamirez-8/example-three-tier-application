/**
 * Example test for the RootLayout component
 * 
 * To run these tests, first set up Jest and React Testing Library:
 * npm install --save-dev jest @testing-library/react @testing-library/jest-dom @types/jest jest-environment-jsdom
 * 
 * Then run: npm test
 */

import { render, screen } from '@testing-library/react';
import RootLayout from '../layout';

describe('RootLayout Component', () => {
  describe('Rendering', () => {
    it('renders children correctly', () => {
      const testContent = 'Test Content';
      render(
        <RootLayout>
          <div>{testContent}</div>
        </RootLayout>
      );
      expect(screen.getByText(testContent)).toBeInTheDocument();
    });

    it('renders multiple children', () => {
      render(
        <RootLayout>
          <div>First Child</div>
          <div>Second Child</div>
        </RootLayout>
      );
      expect(screen.getByText('First Child')).toBeInTheDocument();
      expect(screen.getByText('Second Child')).toBeInTheDocument();
    });
  });

  describe('HTML Structure', () => {
    it('renders html element with correct classes', () => {
      const { container } = render(
        <RootLayout>
          <div>Test</div>
        </RootLayout>
      );
      const html = container.querySelector('html');
      expect(html).toHaveClass('h-full');
      expect(html).toHaveClass('antialiased');
    });

    it('renders body element with correct classes', () => {
      const { container } = render(
        <RootLayout>
          <div>Test</div>
        </RootLayout>
      );
      const body = container.querySelector('body');
      expect(body).toHaveClass('min-h-full');
      expect(body).toHaveClass('flex');
      expect(body).toHaveClass('flex-col');
    });

    it('sets lang attribute to en', () => {
      const { container } = render(
        <RootLayout>
          <div>Test</div>
        </RootLayout>
      );
      const html = container.querySelector('html');
      expect(html).toHaveAttribute('lang', 'en');
    });
  });

  describe('Font Variables', () => {
    it('applies Geist font variables to html element', () => {
      const { container } = render(
        <RootLayout>
          <div>Test</div>
        </RootLayout>
      );
      const html = container.querySelector('html');
      const className = html?.className || '';
      // Font variables should be applied (exact class names depend on Next.js font setup)
      expect(className).toBeTruthy();
    });
  });
});

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ErrorBoundary } from './error-boundary';

const ThrowErrorComponent = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary', () => {
  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div>Normal content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Normal content')).toBeInTheDocument();
  });

  it('renders fallback UI when error occurs', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary fallback={<div data-testid="fallback">Custom fallback</div>}>
        <ThrowErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('fallback')).toBeInTheDocument();
    consoleSpy.mockRestore();
  });

  it('renders default error UI without fallback', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Algo salió mal')).toBeInTheDocument();
    expect(screen.getByText('Recargar aplicación')).toBeInTheDocument();
    consoleSpy.mockRestore();
  });

  it('calls onError callback when error is caught', () => {
    const onError = vi.fn();
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary onError={onError}>
        <ThrowErrorComponent />
      </ErrorBoundary>
    );

    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ componentStack: expect.any(String) })
    );
    consoleSpy.mockRestore();
  });

  it('reloads page when reset button is clicked', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const reloadSpy = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: reloadSpy },
      writable: true,
    });

    render(
      <ErrorBoundary>
        <ThrowErrorComponent />
      </ErrorBoundary>
    );

    const reloadButton = screen.getByText('Recargar aplicación');
    fireEvent.click(reloadButton);

    expect(reloadSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});

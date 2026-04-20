import { Component, type ReactNode, type ErrorInfo } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[400px] items-center justify-center p-4">
          <Card className="max-w-md border-destructive/50 bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Algo salió mal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive">
                <AlertDescription className="text-sm">
                  {this.state.error?.message || 'Ha ocurrido un error inesperado'}
                </AlertDescription>
              </Alert>
              {import.meta.env.DEV && this.state.error?.stack && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-xs text-muted-foreground">
                    Ver detalles técnicos (desarrollo)
                  </summary>
                  <pre className="mt-2 max-h-40 overflow-auto rounded bg-muted p-2 text-xs">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={this.handleReset} variant="outline" className="w-full">
                <RefreshCcw className="mr-2 h-4 w-4" />
                Recargar aplicación
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

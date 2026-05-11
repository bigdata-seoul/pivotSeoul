import { RouterProvider } from 'react-router';
import { router } from './routes';
import { PivotProvider } from './context/PivotContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'sonner';

/**
 * Front app composition root.
 *
 * Provider nesting order:
 * 1) ThemeProvider: visual system (light/dark, tokens)
 * 2) PivotProvider: domain state (profile, scenario A/B, risk calc)
 * 3) RouterProvider: page-level flow and route rendering
 */
export default function App() {
  return (
    <ThemeProvider>
      <PivotProvider>
        <RouterProvider router={router} />
        <Toaster position="top-center" richColors closeButton />
      </PivotProvider>
    </ThemeProvider>
  );
}

import { RouterProvider } from 'react-router';
import { router } from './routes';
import { PivotProvider } from './context/PivotContext';
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <PivotProvider>
        <RouterProvider router={router} />
      </PivotProvider>
    </ThemeProvider>
  );
}

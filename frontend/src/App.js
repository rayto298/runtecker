import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from "./routes";
import { AppProvider } from 'providers/auth';

export const App = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
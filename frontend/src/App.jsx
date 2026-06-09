import { BrowserRouter } from 'react-router-dom';

// AuthProvider — global user state 
import { AuthProvider } from './context/AuthContext';

import AppRoutes from './routes/AppRoutes';

//App Component 
const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;

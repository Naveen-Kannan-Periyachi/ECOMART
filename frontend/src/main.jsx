import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { ThemeProvider, createTheme } from '@mui/material'
import { store } from './app/store'
import { initializeAuth } from './utils/authInit'
import ErrorBoundary from './components/ErrorBoundary'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'
import App from './App.jsx'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Initialize authentication state
initializeAuth(store).then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <ErrorBoundary>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <Router>
              <App />
              <ToastContainer />
            </Router>
          </ThemeProvider>
        </Provider>
      </ErrorBoundary>
    </StrictMode>
  );
});

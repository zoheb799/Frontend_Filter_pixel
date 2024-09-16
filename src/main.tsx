import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import App from './App';
import theme from './theme'
import './css/style.css';
import './css/satoshi.css';


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ThemeProvider theme={theme}>
  <React.StrictMode>
    <Router>
      <App />
      
    </Router>
  </React.StrictMode>,
  </ThemeProvider>,

  
);

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './styles/theme';
import HomePage from './pages/Home/HomePage';
import ChatPage from './pages/Chat/ChatPage';
import LoginPage from './pages/Login/LoginPage';
import { ROUTES } from './constants/routes';
import { ChatProvider } from './context/ChatContext';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ChatProvider>
        <Router>
          <Routes>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.CHAT} element={<ChatPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </Router>
      </ChatProvider>
    </ThemeProvider>
  );
}

export default App;

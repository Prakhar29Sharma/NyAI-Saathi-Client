import React from 'react';
import ReactDOM from 'react-dom/client';
import AOS from 'aos';
import 'aos/dist/aos.css';
import App from './App';
import './index.css';
import './styles.css';

// Initialize AOS
AOS.init({
  duration: 1000,
  once: true,
  easing: 'ease-out',
  delay: 100
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
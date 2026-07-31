import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './Components/App';
import '../css/app.css'; // Mengimpor CSS global Laravel (Tailwind/default)

// Mencari elemen dengan id="app" di dalam welcome.blade.php
const rootElement = document.getElementById('app');

if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
} else {
    console.error("Error: Elemen dengan id='app' tidak ditemukan di HTML!");
}
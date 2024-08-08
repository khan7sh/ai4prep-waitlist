import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

console.log('index.js is running');

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    ReactDOM.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
      rootElement
    );
    console.log('App rendered successfully');
  } catch (error) {
    console.error('Error rendering the app:', error);
    rootElement.innerHTML = `<div style="color: red;">An error occurred while loading the app. Please check the console for more details.</div>`;
  }
} else {
  console.error("Failed to find the root element");
}
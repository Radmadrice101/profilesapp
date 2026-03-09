// frontend/src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import { Authenticator } from '@aws-amplify/ui-react';

// Import first, at top of file (CRA rule): the config file is inside src/
import outputs from './amplify_outputs.json';

// Configure Amplify before rendering
Amplify.configure(outputs);

// Render the app, wrapping with the Authenticator (inside render, not at top-level)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Authenticator>
      <App />
    </Authenticator>
  </React.StrictMode>
);
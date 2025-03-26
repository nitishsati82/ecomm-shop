import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from "react-oidc-context";
import 'bootstrap/dist/css/bootstrap.min.css';

const cognitoAuthConfig = {
  authority: "https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_kbml7T4Jr",
  client_id: "7gp6ln0g9gek7h4nkjru0d98tm",
  //redirect_uri: "http://localhost:3000/",
  redirect_uri: "https://13.235.208.227/",
  response_type: "code",
  scope: "aws.cognito.signin.user.admin email openid phone profile",
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
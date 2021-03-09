import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";


import { GlobalProvider } from './context/GlobalState';
import BaseRouter from './routes';

function App() {
  return (
    <GlobalProvider>
      <Router>
        <BaseRouter/>
      </Router>
    </GlobalProvider>
  );
}

export default App;
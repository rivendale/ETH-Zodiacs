import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import Layout from './components/common/layout';

import { GlobalProvider } from './context/GlobalState';

function App() {
  return (
    <GlobalProvider>
      <Router>
        <Layout />
      </Router>
    </GlobalProvider>
  );
}

export default App;
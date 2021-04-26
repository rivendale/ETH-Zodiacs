import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import Layout from './components/common/layout';

import { EthProvider } from './context/EthContext';
import { GlobalProvider } from './context/GlobalState';

function App() {
  return (
    <GlobalProvider>
      <EthProvider>
        <Router>
          <Layout />
        </Router>
      </EthProvider>
    </GlobalProvider>
  );
}

export default App;
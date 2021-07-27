import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import Layout from './components/common/layout';
import { DeviceProvider } from './context/DeviceContext';

import { EthProvider } from './context/EthContext';
import { GlobalProvider } from './context/GlobalState';

function App() {
  return (
    <GlobalProvider>
      <EthProvider>
        <DeviceProvider>
          <Router>
            <Layout />
          </Router>
        </DeviceProvider>
      </EthProvider>
    </GlobalProvider>
  );
}

export default App;
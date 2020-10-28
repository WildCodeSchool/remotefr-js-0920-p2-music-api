import React, { useEffect } from 'react';
import './App.css';
import { AuthTokens, getServicesLocalStorage, ServiceName, TokenContext, useServices } from './TokenContext';
import AuthButton from './components/AuthButton';

const App = (): JSX.Element => {
  const [services, setToken, removeToken] = useServices(getServicesLocalStorage());
  const tokenContextValue: AuthTokens = { services, setToken, removeToken };

  // Verification timeStamp
  useEffect(() => {
    for (const [name, service] of Object.entries(services)) {
      if (service.expirationStamp !== -1 && Date.now() > service.expirationStamp) {
        removeToken(name as ServiceName);
      }
    }
  }, []);

  return (
    <TokenContext.Provider value={tokenContextValue}>
      <div className="App">
        <AuthButton />
      </div>
    </TokenContext.Provider>
  );
};

export default App;

import React, { useEffect, useState } from 'react';
import './App.css';
import { AuthToken, AuthTokens, ServiceName, TokenContext } from './TokenContext';
import LoginButton from './components/LoginButton';

function getServicesLocalStorage(): Record<ServiceName, AuthToken> {
  return (
    JSON.parse(String(localStorage.getItem('services'))) ?? {
      spotify: {
        token: null,
        expirationStamp: -1,
      },
      youtube: {
        token: null,
        expirationStamp: -1,
      },
    }
  );
}

// Custom hook to handle services (service / setToken / removeToken)
function useServices(
  initServices: Record<ServiceName, AuthToken>
): [
  Record<ServiceName, AuthToken>,
  (name: ServiceName, value: string, expiresIn: number) => void,
  (name: ServiceName) => void
] {
  const [services, setService] = useState(initServices);

  const setToken = (name: ServiceName, value: string, expiresIn: number): void => {
    services[name].token = value;
    // expiresIn is in seconds, so we convert it to miliseconds before adding it to the current timestamp
    services[name].expirationStamp = Date.now() + expiresIn * 1000;

    localStorage.setItem('services', JSON.stringify(services));
    setService({ ...services });
  };

  const removeToken = (name: ServiceName): void => {
    services[name].token = null;
    services[name].expirationStamp = -1;

    localStorage.setItem('services', JSON.stringify(services));
    setService({ ...services });
  };

  return [services, setToken, removeToken];
}

// export default App;
const App = (): JSX.Element => {
  const [services, setToken, removeToken] = useServices(getServicesLocalStorage());

  const value: AuthTokens = { services, setToken, removeToken };

  // Verification timeStamp
  useEffect(() => {
    Object.entries(services).forEach(([name, service]): void => {
      if (service.expirationStamp !== -1 && Date.now() > service.expirationStamp) {
        removeToken(name as ServiceName);
      }
    });
  }, []);

  return (
    <TokenContext.Provider value={value}>
      <div className="App">
        <LoginButton service="spotify" />
        <LoginButton service="youtube" />
      </div>
    </TokenContext.Provider>
  );
};

export default App;

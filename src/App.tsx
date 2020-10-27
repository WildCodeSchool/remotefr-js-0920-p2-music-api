import React from 'react';
import './App.css';
import { AuthToken, AuthTokens, ServiceName, TokenContext } from './TokenContext';
import LoginButton from './components/LoginButton';

class App extends React.Component<unknown, { tokens: AuthTokens }> {
  constructor(props) {
    super(props);

    // Load from localstorage or default null values
    const defaultServices: Record<ServiceName, AuthToken> = JSON.parse(String(localStorage.getItem('services'))) ?? {
      spotify: {
        token: null,
        expirationStamp: -1,
      },
      youtube: {
        token: null,
        expirationStamp: -1,
      },
    };

    this.state = {
      tokens: {
        services: defaultServices,
        setToken: (name, value, expiresIn): void => {
          const { tokens } = this.state;
          tokens.services[name].token = value;
          // expiresIn is in seconds, so we convert it to miliseconds before adding it to the current timestamp
          tokens.services[name].expirationStamp = Date.now() + expiresIn * 1000;

          localStorage.setItem('services', JSON.stringify(tokens.services));
          this.setState({ tokens });
        },
        removeToken: (name): void => {
          const { tokens } = this.state;
          tokens.services[name].token = null;
          tokens.services[name].expirationStamp = -1;

          localStorage.setItem('services', JSON.stringify(tokens.services));
          this.setState({ tokens });
        },
      },
    };

    // Remove expired tokens
    const { tokens } = this.state;
    Object.entries(tokens.services).forEach(([name, service]): void => {
      if (service.expirationStamp !== -1 && Date.now() > service.expirationStamp) {
        tokens.removeToken(name as ServiceName);
      }
    });
  }

  render(): JSX.Element {
    const { tokens } = this.state;

    return (
      <TokenContext.Provider value={tokens}>
        <div className="App">
          <LoginButton service="spotify" />
          <LoginButton service="youtube" />
        </div>
      </TokenContext.Provider>
    );
  }
}

export default App;

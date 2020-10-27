import React from 'react';
import './App.css';
import { AuthTokens, TokenContext } from './TokenContext';
import LoginButton from './components/LoginButton';

class App extends React.Component<unknown, { tokens: AuthTokens }> {
  constructor(props) {
    super(props);

    // Load from localstorage or default null values
    const defaultTokens: AuthTokens = JSON.parse(String(localStorage.getItem('tokens'))) ?? {
      spotifyToken: null,
      youtubeToken: null,
    };

    this.state = {
      tokens: {
        ...defaultTokens,
        setToken: (key, value): void => {
          const { tokens } = this.state;
          tokens[key] = value;

          localStorage.setItem('tokens', JSON.stringify(tokens));
          this.setState({ tokens });
        },
      },
    };
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

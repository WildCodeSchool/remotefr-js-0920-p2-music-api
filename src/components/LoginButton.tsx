import React from 'react';
import OAuth2Login from 'react-simple-oauth2-login';
import { AuthTokens, TokenContext } from '../TokenContext';

interface LoginButtonConfig {
  authorizationUrl: string;
  cliendId: string;
  scope: string;
  tokenName: Exclude<keyof AuthTokens, 'setToken'>;
}

const configs: Record<string, LoginButtonConfig> = {
  spotify: {
    authorizationUrl: 'https://accounts.spotify.com/authorize',
    cliendId: process.env.REACT_APP_SPOTIFY_CLIENT_ID as string,
    scope: 'user-read-private',
    tokenName: 'spotifyToken',
  },
  youtube: {
    authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    cliendId: process.env.REACT_APP_YOUTUBE_CLIENT_ID as string,
    scope: 'https://www.googleapis.com/auth/youtube.force-ssl',
    tokenName: 'youtubeToken',
  },
};

class LoginButton extends React.Component<{ service: 'spotify' | 'youtube' }> {
  static contextType = TokenContext;

  context!: React.ContextType<typeof TokenContext>;

  onSuccess = (response): void => {
    const { service } = this.props;
    const { setToken } = this.context;

    setToken(configs[service].tokenName, response.access_token);
  };

  onFailure = (): void => undefined;

  render(): JSX.Element {
    const { service } = this.props;
    const { authorizationUrl, cliendId, scope } = configs[service];
    return (
      <OAuth2Login
        className={`btn btn-outline-${service}`}
        authorizationUrl={authorizationUrl}
        responseType="token"
        clientId={cliendId}
        scope={scope}
        redirectUri={process.env.REACT_APP_REDIRECT_URI}
        onSuccess={this.onSuccess}
        onFailure={this.onFailure}
      >
        <i className={`fab fa-${service} fa-lg`} /> Login with {service}
      </OAuth2Login>
    );
  }
}

export default LoginButton;

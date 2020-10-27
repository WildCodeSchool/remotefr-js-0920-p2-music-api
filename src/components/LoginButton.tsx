import React from 'react';
import OAuth2Login from 'react-simple-oauth2-login';
import { ServiceName, TokenContext } from '../TokenContext';

interface LoginButtonConfig {
  authorizationUrl: string;
  cliendId: string;
  scope: string;
}

const configs: Record<ServiceName, LoginButtonConfig> = {
  spotify: {
    authorizationUrl: 'https://accounts.spotify.com/authorize',
    cliendId: process.env.REACT_APP_SPOTIFY_CLIENT_ID as string,
    scope: 'user-read-private',
  },
  youtube: {
    authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    cliendId: process.env.REACT_APP_YOUTUBE_CLIENT_ID as string,
    scope: 'https://www.googleapis.com/auth/youtube.force-ssl',
  },
};

class LoginButton extends React.Component<{ service: ServiceName }> {
  static contextType = TokenContext;

  context!: React.ContextType<typeof TokenContext>;

  onSuccess = (response): void => {
    const { service } = this.props;
    const { setToken } = this.context;

    setToken(service, response.access_token, response.expires_in);
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

import React, { useContext } from 'react';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import { ServiceName, TokenContext } from '../TokenContext';

interface TokenConfig {
  authorizationUrl: string;
  cliendId: string;
  scope: string;
  redirectUri: string;
}

const configs: Record<ServiceName, TokenConfig> = {
  spotify: {
    authorizationUrl: 'https://accounts.spotify.com/authorize',
    cliendId: process.env.REACT_APP_SPOTIFY_CLIENT_ID as string,
    scope: 'user-read-private',
    redirectUri: process.env.REACT_APP_REDIRECT_URI as string,
  },
  youtube: {
    authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    cliendId: process.env.REACT_APP_YOUTUBE_CLIENT_ID as string,
    scope: 'https://www.googleapis.com/auth/youtube.force-ssl',
    redirectUri: process.env.REACT_APP_REDIRECT_URI as string,
  },
};

const AuthButton = (): JSX.Element => {
  const { services } = useContext(TokenContext);
  return (
    <>
      <h2>Component AuthButton</h2>
      {Object.entries(configs).map(([name, conf]) => {
        return services[name].token ? (
          <LogoutButton key={name} service={name as ServiceName} />
        ) : (
          <LoginButton key={name} service={name as ServiceName} config={conf} />
        );
      })}
    </>
  );
};

export default AuthButton;

import React, { useCallback, useContext } from 'react';
import OAuth2Login from 'react-simple-oauth2-login';
import { ServiceName, TokenContext } from '../TokenContext';

interface TokenConfig {
  authorizationUrl: string;
  cliendId: string;
  scope: string;
  redirectUri: string;
}

const LoginButton = ({ service, config }: { service: ServiceName; config: TokenConfig }): JSX.Element => {
  const { setToken } = useContext(TokenContext);

  const handleSuccess = useCallback(
    (response): void => {
      setToken(service, response.access_token, response.expires_in);
    },
    [setToken, service]
  );

  const handleFailure = useCallback((): void => undefined, []);

  const { authorizationUrl, cliendId, scope, redirectUri } = config;
  return (
    <OAuth2Login
      className={`btn btn-outline-${service} btn-auth`}
      authorizationUrl={authorizationUrl}
      responseType="token"
      clientId={cliendId}
      scope={scope}
      redirectUri={redirectUri}
      onSuccess={handleSuccess}
      onFailure={handleFailure}
    >
      <i className={`fab fa-${service} fa-lg`} /> Connexion à {service}
    </OAuth2Login>
  );
};

export default LoginButton;

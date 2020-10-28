import React, { useContext } from 'react';
import { ServiceName, TokenContext } from '../TokenContext';

const LogoutButton = ({ service }: { service: ServiceName }): JSX.Element => {
  const { removeToken } = useContext(TokenContext);

  const handleClickLogout = (): void => {
    removeToken(service);
  };

  return (
    <button type="button" className="btn btn-outline-dark btn-auth" onClick={handleClickLogout}>
      <i className={`fab fa-${service} fa-lg`} /> Logout {service}
    </button>
  );
};

export default LogoutButton;

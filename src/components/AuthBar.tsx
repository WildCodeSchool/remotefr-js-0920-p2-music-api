import React, { useState } from 'react';
import { serviceNames } from '../TokenContext';
import LoginButton from './LoginButton';
import Panel from './Panel';

const AuthBar = (): JSX.Element => {
  const [panelActive, setPanelActive] = useState(false);

  return (
    <aside className="d-flex justify-content-end p-2">
      {/* Desktop */}
      {serviceNames.map((serviceName) => (
        <div className="d-none d-md-block m-2" key={serviceName}>
          <LoginButton service={serviceName} />
        </div>
      ))}
      {/* Mobile */}
      <button type="button" className="d-md-none btn btn-outline-dark" onClick={(): void => setPanelActive(true)}>
        Connexion/Déconnexion
      </button>

      <Panel className="d-md-none" active={panelActive} onClose={(): void => setPanelActive(false)}>
        <div className="d-flex flex-column align-items-center">
          {serviceNames.map((serviceName) => (
            <div className="m-2" key={serviceName}>
              <LoginButton service={serviceName} />
            </div>
          ))}
        </div>
      </Panel>
    </aside>
  );
};
export default AuthBar;

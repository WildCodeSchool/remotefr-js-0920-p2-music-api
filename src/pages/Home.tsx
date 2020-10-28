import React, { useContext, useMemo } from 'react';
import { Jumbotron } from 'reactstrap';
import LoginButton from '../components/LoginButton';
import { serviceNames, TokenContext } from '../TokenContext';

const UnauthenticatedHome = (): JSX.Element => (
  <main className="container d-flex justify-content-center align-items-center vw-100 vh-100">
    <Jumbotron className="m-2 shadow d-flex flex-column align-items-center">
      <h1>Connectez-vous pour accéder à votre musique</h1>

      {serviceNames.map((serviceName) => (
        <div className="m-2" key={serviceName}>
          <LoginButton service={serviceName} />
        </div>
      ))}
    </Jumbotron>
  </main>
);

const Home = (): JSX.Element => {
  const { services } = useContext(TokenContext);

  const isLoggedIn = useMemo(() => Object.values(services).some((service) => service.token != null), [services]);

  return <>{isLoggedIn ? 'Logged in' : <UnauthenticatedHome />}</>;
};
export default Home;

import React, { useContext, useMemo } from 'react';
import { Switch, Route, NavLink } from 'react-router-dom';
import { TokenContext } from '../TokenContext';
import AuthBar from '../components/AuthBar';
import AuthButtons from '../components/AuthButtons';
import SearchAndTrending from './SearchAndTrending';

const UnauthenticatedHome = (): JSX.Element => (
  <main className="container d-flex justify-content-center align-items-center vw-100 vh-100">
    <div className="jumbotron m-2 shadow d-flex flex-column align-items-center">
      <h1 className="title-md-small text-center">Connectez-vous pour accéder à votre musique</h1>
      <AuthButtons />
    </div>
  </main>
);

const AuthenticatedHome = (): JSX.Element => (
  <>
    <AuthBar />
    <div className="container">
      <nav>
        <ul className="nav nav-tabs d-flex justify-content-center">
          <li className="nav-item">
            <NavLink className="nav-link" to="/">
              Recherche
            </NavLink>
          </li>
        </ul>
      </nav>

      <main>
        <Switch>
          <Route exact path="/">
            <SearchAndTrending />
          </Route>
        </Switch>
      </main>
    </div>
  </>
);

const Home = (): JSX.Element => {
  const { services } = useContext(TokenContext);

  const isLoggedIn = useMemo(() => Object.values(services).some((service) => service.token != null), [services]);

  return isLoggedIn ? <AuthenticatedHome /> : <UnauthenticatedHome />;
};
export default Home;

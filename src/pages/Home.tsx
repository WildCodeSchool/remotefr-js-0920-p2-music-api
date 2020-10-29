import React, { useContext, useMemo } from 'react';
import { Jumbotron } from 'reactstrap';
import { Switch, Route, NavLink } from 'react-router-dom';
import { TokenContext } from '../TokenContext';
import AuthBar from '../components/AuthBar';
import AuthButtons from '../components/AuthButtons';
import SongCard from '../components/SongCard';

const UnauthenticatedHome = (): JSX.Element => (
  <main className="container d-flex justify-content-center align-items-center vw-100 vh-100">
    <Jumbotron className="m-2 shadow d-flex flex-column align-items-center">
      <h1 className="title-md-small text-center">Connectez-vous pour accéder à votre musique</h1>
      <AuthButtons />
    </Jumbotron>
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
            <div className="d-flex flex-column align-items-center">
              <SongCard
                title="Here Comes The Sun - Remastered 2009"
                author="The Beatles"
                image="https://i.scdn.co/image/ab67616d0000b273dc30583ba717007b00cceb25"
                duration="3:05"
                link="https://open.spotify.com/track/6dGnYIeXmHdcikdzNNDMm2"
                service="spotify"
              />
              <hr className="w-75" />
              <SongCard
                title="Queen – Bohemian Rhapsody (Official Video Remastered)"
                author="Queen Official"
                image="https://images-na.ssl-images-amazon.com/images/I/71WVq7VqUkL._SX522_.jpg"
                duration="5:59"
                link="https://www.youtube.com/watch?v=fJ9rUzIMcZQ"
                service="youtube"
              />
            </div>
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

import React, { useState, useContext, useCallback, useEffect } from 'react';
import { TokenContext } from '../TokenContext';
import { SongCardList } from '../components/SongCard';
import { debounce } from '../apis/utils';
import { searchServices, SongInfo, trendingServices } from '../apis/requestServices';

const SearchResults = ({ songs }: { songs: SongInfo[] }): JSX.Element =>
  songs.length > 0 ? <SongCardList songs={songs} /> : <p className="text-center">Aucun résultat</p>;

function Search({ query }: { query: string }): JSX.Element {
  const { services } = useContext(TokenContext);
  const [isLoading, setIsLoading] = useState(true);
  const [songs, setSongs] = useState<SongInfo[]>([]);

  const debouncedSearch = useCallback(
    debounce((query_: string) => {
      if (query_ === '') return;

      setIsLoading(true);
      searchServices(services, query_, 20)
        .then(setSongs)
        .finally(() => setIsLoading(false));
    }, 1000),
    [services]
  );
  useEffect(() => {
    debouncedSearch(query);
  }, [query, services]);

  return isLoading ? (
    <div className="d-block m-auto spinner-border" role="status">
      <span className="sr-only">Chargement...</span>
    </div>
  ) : (
    <SearchResults songs={songs} />
  );
}

function Trending(): JSX.Element {
  const { services } = useContext(TokenContext);
  const [isLoading, setIsLoading] = useState(true);
  const [songs, setSongs] = useState<SongInfo[]>([]);

  useEffect(() => {
    setIsLoading(true);

    trendingServices(services)
      .then((songs_) => {
        setSongs(songs_);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [services]);

  return (
    <>
      <h1>Tendances</h1>
      {isLoading ? (
        <div className="d-block m-auto spinner-border" role="status">
          <span className="sr-only">Chargement...</span>
        </div>
      ) : (
        <SearchResults songs={songs} />
      )}
    </>
  );
}

export default function SearchAndTrending(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState('');
  const showTrending = searchQuery === '';

  return (
    <>
      <input
        className="form-control form-control-lg my-3"
        type="text"
        value={searchQuery}
        onChange={(e): void => setSearchQuery(e.target.value)}
        placeholder="Rechercher une musique..."
        aria-label="Nom à rechercher"
      />

      {showTrending ? <Trending /> : <Search query={searchQuery} />}
    </>
  );
}

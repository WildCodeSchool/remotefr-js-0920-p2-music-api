import React, { useState, useContext, useCallback, useEffect, useMemo } from 'react';
import { TokenContext } from '../TokenContext';
import SongCard from '../components/SongCard';
import { debounce } from '../apis/utils';
import { searchServices, SongInfo } from '../apis/requestServices';

const SearchResults = ({ songs }: { songs: SongInfo[] }): JSX.Element =>
  songs.length > 0 ? (
    <ul className="list-unstyled d-flex flex-column align-items-center">
      {songs.map((song, i) => (
        <li className="w-100" key={song.url}>
          <SongCard
            title={song.title}
            author={song.artist}
            image={song.image}
            duration={song.duration}
            link={song.url}
            service={song.service}
          />
          {/* HR except on last iteration */}
          {i + 1 !== songs.length && <hr />}
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-center">Aucun résultat</p>
  );

function Search({ query }: { query: string }): JSX.Element {
  const { services } = useContext(TokenContext);
  const [isLoading, setIsLoading] = useState(true);
  const [searchSongs, setSearchSongs] = useState<SongInfo[]>([]);

  const debouncedSearch = useCallback(
    debounce((query_: string) => {
      if (query_ === '') return;

      setIsLoading(true);
      searchServices(services, query_, 20)
        .then(setSearchSongs)
        .finally(() => setIsLoading(false));
    }, 1000),
    [services]
  );
  useEffect(() => {
    debouncedSearch(query);
  }, [query, services]);

  return isLoading ? (
    <div className="d-block m-auto spinner-border" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  ) : (
    <SearchResults songs={searchSongs} />
  );
}

export default function SearchAndTrending(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState('');
  const showTrends = useMemo(() => searchQuery === '', [searchQuery]);

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

      {showTrends ? <span>Trends here</span> : <Search query={searchQuery} />}
    </>
  );
}

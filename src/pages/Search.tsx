import React, { useState, useContext, useCallback } from 'react';
import { TokenContext } from '../TokenContext';
import SongCard from '../components/SongCard';
import { debounce } from '../apis/utils';
import { searchServices, SongInfo } from '../apis/requestServices';

const SearchResults = ({ songs }: { songs: SongInfo[] }): JSX.Element =>
  songs.length > 0 ? (
    <ul className="list-unstyled d-flex flex-column align-items-center">
      {songs.map((song, i) => (
        <li className="w-100">
          <SongCard
            key={song.url}
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

export default function Search(): JSX.Element {
  const { services } = useContext(TokenContext);
  const [isLoading, setIsLoading] = useState(false);
  const [songs, setSongs] = useState<SongInfo[]>([]);

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setIsLoading(true);
      searchServices(services, query, 20)
        .then(setSongs)
        .finally(() => setIsLoading(false));
    }, 1000),
    [services]
  );

  return (
    <>
      <input
        className="form-control form-control-lg my-3"
        type="text"
        onChange={(e): void => debouncedSearch(e.target.value)}
        placeholder="Rechercher une musique..."
        aria-label="Nom à rechercher"
      />

      {isLoading ? (
        <div className="d-block m-auto spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        <SearchResults songs={songs} />
      )}
    </>
  );
}

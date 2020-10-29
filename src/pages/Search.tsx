import React, { useState, useEffect, useContext } from 'react';
import { TokenContext } from '../TokenContext';
import { searchOnSpotify } from '../apis/requestSpotify';
import SongCard from '../components/SongCard';
import SearchField from '../components/SearchField';
import { SongInfo, limitCalculQueryFromConnectedService } from '../apis/utils';

export default function Search(): JSX.Element {
  const { services } = useContext(TokenContext);
  const [fieldValue, setFieldValue] = useState('');
  const [submitValue, setSubmitValue] = useState('');
  const [dataSpotify, setDataSpotify] = useState<SongInfo[]>([]);

  const limit = limitCalculQueryFromConnectedService(20, services);

  useEffect(() => {
    (async (): Promise<Array<SongInfo>> => {
      const d = await searchOnSpotify(services.spotify.token as string, submitValue, limit);
      setDataSpotify(d);
      return d;
    })();
  }, [submitValue, limit]);

  const handleOnSubmit = (e): void => {
    e.preventDefault();
    if (fieldValue === '') alert('Le champs est vide');
    else setSubmitValue(fieldValue);
  };
  return (
    <div>
      <SearchField handleOnSubmit={handleOnSubmit} fieldValue={fieldValue} setFieldValue={setFieldValue} />
      {dataSpotify.length > 0
        ? dataSpotify.map(
            (i): JSX.Element => {
              return (
                <SongCard
                  key={i.url}
                  title={i.title}
                  author={i.artist}
                  image={i.image}
                  duration={i.duration}
                  link={i.url}
                  service="spotify"
                />
              );
            }
          )
        : 'Aucun résultat'}
    </div>
  );
}

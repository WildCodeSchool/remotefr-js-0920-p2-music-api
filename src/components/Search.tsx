import React, { useState, useEffect, useContext } from 'react';
import { TokenContext } from '../TokenContext';
import { ItemPush, searchOnSpotify } from '../apis/RequestSpotify';
import SongCard from './SongCard';
import SearchField from './SearchField';
import limitCalculQueryFromConnectedService from '../apis/utils';

export default function Search(): JSX.Element {
  const { services } = useContext(TokenContext);
  const [fieldValue, setFieldValue] = useState('');
  const [submitValue, setSubmitValue] = useState('');
  const [dataSpotify, setDataSpotify] = useState<Array<ItemPush>>([]);
  const limit = limitCalculQueryFromConnectedService(20, services);
  useEffect(() => {
    (async (): Promise<Array<ItemPush>> => {
      const d = await searchOnSpotify(services.spotify.token, submitValue, limit);
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
              return <SongCard key={i.url} title={i.title} author={i.artist} image={i.image} service="spotify" />;
            }
          )
        : 'Aucun résultat'}
    </div>
  );
}

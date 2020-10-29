import React, { useState, useEffect, useContext } from 'react';
import { TokenContext } from '../TokenContext';
import { ItemPush, searchOnSpotify } from './RequestSpotify';

export default function SearchField(): JSX.Element {
  const { services } = useContext(TokenContext);
  const [fieldValue, setFieldValue] = useState('');
  const [submitValue, setSubmitValue] = useState('');
  const [dataShow, setDataShow] = useState<Array<ItemPush>>([]);

  useEffect(() => {
    (async (): Promise<Array<ItemPush>> => {
      const d = await searchOnSpotify(services.spotify.token, submitValue);
      setDataShow(d);
      return d;
    })();
  }, [submitValue]);

  const handleOnSubmit = (e): void => {
    e.preventDefault();
    if (fieldValue === '') alert('Le champs est vide');
    else setSubmitValue(fieldValue);
  };
  return (
    <div>
      Result : {dataShow.length > 0 ? dataShow[0].title : 'plein'} <br />
      <form onSubmit={(e): void => handleOnSubmit(e)}>
        <input type="text" value={fieldValue} onChange={(e): void => setFieldValue(e.target.value)} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

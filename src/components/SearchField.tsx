import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { TokenContext } from '../TokenContext';

function makeObjectOfDataRequest(data): Array<Record<string, any>> {
  const dataTracks: Array<Record<string, any>> = [];
  interface ItemPush {
    title: string;
    url: string;
    image: string;
    type: string;
  }

  data.tracks.items.forEach((item: Record<string, any>) => {
    const i: ItemPush = {
      title: item.name,
      url: item.external_urls.spotify,
      image:
        item.album.images !== undefined && item.album.images.length > 0 ? item.album.images[0].url : 'noImageFound',
      type: item.type,
    };
    dataTracks.push(i);
  });
  return dataTracks;
}

async function searchOnSpotify(token, word = 'julien'): Promise<any> {
  if (word === '') return [];

  const spotifyToken = token;
  const url = 'https://api.spotify.com/v1/search';
  const config = {
    params: {
      q: word,
      type: 'track',
    },
    headers: {
      Authorization: `Bearer ${spotifyToken}`,
    },
  };

  return axios
    .get(url, config)
    .then((response) => response.data)
    .then((data) => {
      return makeObjectOfDataRequest(data);
    })
    .catch((e) => console.error(e.response));
}

export default function SearchField(): JSX.Element {
  interface DataShow {
    title: string;
    url: string;
    image: string;
    type: string;
  }
  const { services } = useContext(TokenContext);
  const [fieldValue, setFieldValue] = useState('');
  const [submitValue, setSubmitValue] = useState('');
  const [dataShow, setDataShow] = useState<Array<Record<string, DataShow>>>([]);

  useEffect(() => {
    (async (): Promise<any> => {
      const d = await searchOnSpotify(services.spotify.token, submitValue);
      setDataShow(d);
      return d;
    })();
  }, [submitValue]);

  const handleOnSubmit = (e): void => {
    e.preventDefault();
    setSubmitValue(fieldValue);
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

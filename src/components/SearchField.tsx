import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { TokenContext } from '../TokenContext';

interface ItemPush {
  title: string;
  artist: string;
  url: string;
  image: string;
}

function makeObjectOfDataRequest(data): Array<ItemPush> {
  const dataTracks: Array<ItemPush> = [];

  data.tracks.items.forEach((item: Record<string, any>) => {
    const i: ItemPush = {
      title: item.name,
      url: item.external_urls.spotify,
      image:
        item.album.images !== undefined && item.album.images.length > 0 ? item.album.images[0].url : 'noImageFound',
      artist: item.artists.name,
    };
    dataTracks.push(i);
  });
  return dataTracks;
}

async function searchOnSpotify(token, word = 'julien'): Promise<Array<ItemPush>> {
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
    .catch((e) => {
      if (e.response.status !== 200) {
        alert(e.response.data.error.message);
      }
      return [];
    });
}

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

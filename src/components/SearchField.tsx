import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { TokenContext } from '../TokenContext';

function makeObjectOfDataRequest(data): Record<string, any> {
  const dataAlbums: Array<Record<string, any>> = [];
  const dataArtists: Array<Record<string, any>> = [];
  const dataTracks: Array<Record<string, any>> = [];
  const dataPlaylist: Array<Record<string, any>> = [];
  const dataToShow: Record<string, any> = {};
  const type = Object.keys(data); // Albums, Artists, playlist ....
  interface ItemPush {
    title: string;
    url: string;
    image: string;
    type: string;
  }

  type.forEach((t) => {
    data[t].items.forEach((item) => {
      const i: ItemPush = {
        title: item.name,
        url: item.external_urls.spotify,
        image: item.images !== undefined && item.images.length > 0 ? item.images[0].url : 'noImageFound',
        type: item.type,
      };
      switch (t) {
        case 'albums':
          dataAlbums.push(i);
          break;
        case 'artists':
          dataArtists.push(i);
          break;
        case 'tracks':
          dataTracks.push(i);
          break;
        case 'playlists':
          dataPlaylist.push(i);
          break;
        default:
          break;
      }
    });
  });

  dataToShow.albums = dataAlbums;
  dataToShow.artists = dataArtists;
  dataToShow.tracks = dataTracks;
  dataToShow.playlists = dataPlaylist;
  return dataToShow;
}

async function searchOnSpotify(token, word = 'julien'): Promise<any> {
  if (word === '') return [];

  const spotifyToken = token;
  const url = 'https://api.spotify.com/v1/search';
  const config = {
    params: {
      q: word,
      type: 'album,artist,playlist,track',
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
    .catch((e) => console.log(e.response));
}

export default function SearchField(): JSX.Element {
  // let dataShow = {};
  const { services } = useContext(TokenContext);

  const [fieldValue, setFieldValue] = useState('');
  const [submitValue, setSubmitValue] = useState('');
  const [dataShow, setDataShow] = useState<any>({});

  useEffect(() => {
    (async function () {
      const d = await searchOnSpotify(services.spotify.token, submitValue);
      console.log('in useEffect: d :>> ', d);
      setDataShow(d);
      return d;
    })();
  }, [submitValue]);

  const handleOnSubmit = (e): void => {
    e.preventDefault();
    setSubmitValue(fieldValue);
  };

  // console.log('dataShow :>> ', dataShow);

  // eslint-disable-next-line
  // debugger;
  return (
    <div>
      Result : {dataShow.artists ? dataShow.artists[0].title : 'plein'} <br />
      <form onSubmit={(e) => handleOnSubmit(e)}>
        <input type="text" value={fieldValue} onChange={(e) => setFieldValue(e.target.value)} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

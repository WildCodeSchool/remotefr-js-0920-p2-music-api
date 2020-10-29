import axios from 'axios';
import { SongInfo, millisToMinutesAndSeconds } from './utils';

function makeObjectOfDataRequest(data): SongInfo[] {
  return data.tracks.items.map((item) => {
    return {
      title: item.name,
      url: item.external_urls.spotify,
      image:
        item.album.images !== undefined && item.album.images.length > 0 ? item.album.images[0].url : 'noImageFound',
      artist: item.artists[0].name,
      duration: millisToMinutesAndSeconds(item.duration_ms),
    };
  });
}

// eslint-disable-next-line import/prefer-default-export
export async function searchOnSpotify(token: string, word: string, limitSearch = 20): Promise<SongInfo[]> {
  if (word === '') return [];

  const spotifyToken = token;
  const url = 'https://api.spotify.com/v1/search';
  const config = {
    params: {
      q: word,
      type: 'track',
      limit: limitSearch,
    },
    headers: {
      Authorization: `Bearer ${spotifyToken}`,
    },
  };

  try {
    const response = await axios.get(url, config);
    return makeObjectOfDataRequest(response.data);
  } catch (error) {
    if (error.response.status !== 200) {
      alert(error.response.data.error.message);
    }
    return [];
  }
}

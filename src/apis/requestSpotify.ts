import axios from 'axios';
import { millisToMinutesAndSeconds } from './utils';
import { SongInfo } from './requestServices';

function makeObjectOfDataRequest(data): SongInfo[] {
  return data.tracks.items.map((item) => ({
    title: item.name,
    url: item.external_urls.spotify,
    image: item.album.images !== undefined && item.album.images.length > 0 ? item.album.images[0].url : 'noImageFound',
    artist: item.artists[0].name,
    duration: millisToMinutesAndSeconds(item.duration_ms),
    service: 'spotify',
  }));
}

// eslint-disable-next-line import/prefer-default-export
export async function searchSpotify(token: string, query: string, limit = 20): Promise<SongInfo[]> {
  if (query === '') return [];

  const spotifyToken = token;
  const url = 'https://api.spotify.com/v1/search';
  const config = {
    params: {
      q: query,
      type: 'track',
      limit,
    },
    headers: {
      Authorization: `Bearer ${spotifyToken}`,
    },
  };

  const response = await axios.get(url, config);
  return makeObjectOfDataRequest(response.data);
}

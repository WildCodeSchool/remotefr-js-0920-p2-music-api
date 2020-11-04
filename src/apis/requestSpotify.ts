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

export async function trendingSpotify(token: string, limit = 20, playlistId?: string): Promise<SongInfo[]> {
  const idTop50France = '37i9dQZEVXbIPWwFssbupI';
  const idForUrl = playlistId ?? idTop50France;
  const url = `https://api.spotify.com/v1/playlists/${idForUrl}`;
  const config = {
    params: {
      fields: 'tracks.items.track',
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const { data } = await axios.get(url, config);
  data.tracks.items = data.tracks.items.map((item) => item.track);
  return makeObjectOfDataRequest(data).slice(0, limit);
}

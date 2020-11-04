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

function makeObjectOfDataTrendRequest(data): SongInfo[] {
  return data.tracks.items.map((item) => ({
    title: item.track.name,
    url: item.track.external_urls.spotify,
    image:
      item.track.album.images !== undefined && item.track.album.images.length > 0
        ? item.track.album.images[0].url
        : 'noImageFound',
    artist: item.track.artists[0].name,
    duration: millisToMinutesAndSeconds(item.track.duration_ms),
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

export async function trendingSpotify(token: string, playlistId?: string): Promise<SongInfo[]> {
  const idForUrl = playlistId || '37i9dQZEVXbIPWwFssbupI';
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
  return makeObjectOfDataTrendRequest(data);
}

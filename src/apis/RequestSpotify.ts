import axios from 'axios';

export interface ItemPush {
  title: string;
  artist: string;
  url: string;
  image: string;
  duration: string;
}

function millisToMinutesAndSeconds(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds.padStart(2, '0')}`;
}

function makeObjectOfDataRequest(data): Array<ItemPush> {
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

export async function searchOnSpotify(token, word = 'julien', limitSearch = 20): Promise<Array<ItemPush>> {
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

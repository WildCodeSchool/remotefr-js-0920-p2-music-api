import axios from 'axios';

export interface ItemPush {
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

export async function searchOnSpotify(token, word = 'julien'): Promise<Array<ItemPush>> {
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

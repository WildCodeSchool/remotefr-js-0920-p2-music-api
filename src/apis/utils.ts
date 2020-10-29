// Interface identique Spotify/Youtube
export interface ItemPush {
  title: string;
  artist: string;
  url: string;
  image: string;
  // duration: number; // milliseconde
}

export const transformDataYoutube = (data: Record<string, any>): Array<ItemPush> => {
  const ret: Array<ItemPush> = [];

  data.items.forEach((obj: Record<string, any>) => {
    const item: ItemPush = {
      title: obj.snippet.title,
      artist: obj.snippet.channelTitle,
      image: obj.snippet.thumbnails.medium.url,
      url: `https://www.youtube.com/watch?v=${obj.id.videoId}`,
    };
    ret.push(item);
  });
  return ret;
};

export function toQuery(params, delimiter = '&'): string {
  const keys = Object.keys(params);

  return keys.reduce((str, key, index) => {
    let query = `${str}${key}=${params[key]}`;

    if (index < keys.length - 1) {
      query += delimiter;
    }

    return query;
  }, '');
}

// Interface identique Spotify/Youtube
export interface SongInfo {
  title: string;
  artist: string;
  url: string;
  image: string;
  duration: string;
}

export const youtubeDataToSongInfo = (data: Record<string, any>): Array<SongInfo> => {
  const ret: Array<SongInfo> = [];

  data.items.forEach((obj: Record<string, any>) => {
    const regexTime = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
    const tab = regexTime.exec(obj.contentDetails.duration) as RegExpExecArray;

    const item: SongInfo = {
      title: obj.snippet.title,
      artist: obj.snippet.channelTitle,
      image: obj.snippet.thumbnails.medium.url,
      url: `https://www.youtube.com/watch?v=${obj.id}`,
      duration: `${tab[2]}:${tab[3].padStart(2, '0')}`,
    };
    ret.push(item);
  });
  return ret;
};

function toQuery(params, delimiter = '&'): string {
  const keys = Object.keys(params);

  return keys.reduce((str, key, index) => {
    let query = `${str}${key}=${params[key]}`;

    if (index < keys.length - 1) {
      query += delimiter;
    }

    return query;
  }, '');
}

export const getUrl = (baseUrl, queryType, params): string => {
  return encodeURI(`${baseUrl}${queryType}?${toQuery({ ...params })}`);
};

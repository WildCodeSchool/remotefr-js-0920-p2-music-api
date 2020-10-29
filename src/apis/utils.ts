import axios from 'axios';

// Interface identique Spotify/Youtube
export interface SongInfo {
  title: string;
  artist: string;
  url: string;
  image: string;
  duration: string;
}

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

export const fetchApi = async (
  token: string,
  baseUrl: string,
  queryType: string,
  params
): Promise<Record<string, any>> => {
  try {
    const url = getUrl(baseUrl, queryType, params);
    const response = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('error.response :>> ', error.response);
    return error.response;
  }
};

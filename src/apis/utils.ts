import axios from 'axios';
import { ServiceName, AuthToken } from '../TokenContext';

export function limitCalculQueryFromConnectedService(
  nbTotalShow: number,
  services: Record<ServiceName, AuthToken>
): number {
  let nbServ = 0;
  Object.values(services).forEach((service: AuthToken) => {
    if (service.token !== null) nbServ += 1;
  });
  return nbTotalShow / nbServ;
}

export function millisToMinutesAndSeconds(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds.padStart(2, '0')}`;
}

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
    alert(error.response.data.error.message);
    return error.response;
  }
};

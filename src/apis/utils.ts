import axios from 'axios';

export function millisToMinutesAndSeconds(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds.padStart(2, '0')}`;
}

export function debounce<F extends (...args: never[]) => void>(fn: F, wait = 1): (...args: Parameters<F>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args): void => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  };
}

export function interleave<T>(arrays: T[][]): T[] {
  if (arrays.length === 0) return [];

  const flattenArray: T[] = [];

  for (let i = 0; i < arrays[0].length; i += 1) {
    for (let j = 0; j < arrays.length; j += 1) {
      flattenArray.push(arrays[j][i]);
    }
  }

  return flattenArray;
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

export const fetchApi = async <T>(
  token: string,
  baseUrl: string,
  queryType: string,
  params
): Promise<Record<string, T>> => {
  const url = getUrl(baseUrl, queryType, params);
  const response = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
  return response.data;
};

import axios from 'axios';
import { getUrl, SongInfo, youtubeDataToSongInfo } from './utils';

const baseURL = 'https://youtube.googleapis.com/youtube/v3/';

type TypeYoutube = 'video' | 'playlist' | 'channel';
type OrderYoutube = 'date' | 'rating' | 'relevance' | 'title' | 'videoCount' | 'viewCount';

interface ResquestInterfaceYoutube {
  token: string;
  query: string;
  type?: TypeYoutube;
  order?: OrderYoutube;
  maxResults?: number;
}

const fetchApi = async (url: string, token: string): Promise<Record<string, any>> => {
  try {
    const response = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('error.response :>> ', error.response);
    return error.response;
  }
};

const getAllIdVideo = (data): Array<string> => {
  const dataId: Array<string> = [];
  data.items.forEach((obj) => dataId.push(obj.id.videoId));
  return dataId;
};

const requestYoutube = async ({
  token,
  query,
  type = 'video',
  order = 'relevance',
  maxResults = 5,
}: ResquestInterfaceYoutube): Promise<Array<SongInfo>> => {
  try {
    const paramsUrlSearch = { q: query, type, order, maxResults };
    const urlSearch = getUrl(baseURL, 'search', paramsUrlSearch);
    const dataSearch = await fetchApi(urlSearch, token);

    const allIdVideo = getAllIdVideo(dataSearch);
    const paramsUrlVideos = { part: 'id,contentDetails,snippet', id: allIdVideo.join(',') };
    const urlVideos = getUrl(baseURL, 'videos', paramsUrlVideos);
    const dataVideos = await fetchApi(urlVideos, token);

    return youtubeDataToSongInfo(dataVideos);
  } catch (error) {
    return error.response;
  }
};

export default requestYoutube;

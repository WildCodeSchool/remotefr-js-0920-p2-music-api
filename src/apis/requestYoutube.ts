import { fetchApi, SongInfo, youtubeDataToSongInfo } from './utils';

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
    const dataSearch = await fetchApi(token, baseURL, 'search', paramsUrlSearch);

    const allIdVideo = getAllIdVideo(dataSearch);
    const paramsUrlVideos = { part: 'id,contentDetails,snippet', id: allIdVideo.join(',') };
    const dataVideos = await fetchApi(token, baseURL, 'videos', paramsUrlVideos);

    return youtubeDataToSongInfo(dataVideos);
  } catch (error) {
    return error.response;
  }
};

export default requestYoutube;

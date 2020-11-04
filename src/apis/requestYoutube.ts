import { fetchApi } from './utils';
import { SongInfo } from './requestServices';

const baseURL = 'https://youtube.googleapis.com/youtube/v3/';

type TypeYoutube = 'video' | 'playlist' | 'channel';
type OrderYoutube = 'date' | 'rating' | 'relevance' | 'title' | 'videoCount' | 'viewCount';

interface ResquestInterfaceYoutube {
  token: string;
  query?: string;
  type?: TypeYoutube;
  order?: OrderYoutube;
  maxResults?: number;
  regionCode?: string;
  videoCategoryId?: number;
}

const getAllIdVideo = (data): string[] => data.items.map((obj) => obj.id.videoId || obj.id);

const fechtApiDetailsVideo = async <T>(token, data): Promise<Record<string, T>> => {
  const allIdVideo = getAllIdVideo(data);
  const paramsUrlVideos = { part: 'id,contentDetails,snippet', id: allIdVideo.join(',') };

  return fetchApi(token, baseURL, 'videos', paramsUrlVideos);
};

const regexISODuration = /P((([0-9]*\.?[0-9]*)Y)?(([0-9]*\.?[0-9]*)M)?(([0-9]*\.?[0-9]*)W)?(([0-9]*\.?[0-9]*)D)?)?(T(([0-9]*\.?[0-9]*)H)?(([0-9]*\.?[0-9]*)M)?(([0-9]*\.?[0-9]*)S)?)?/;

export const youtubeDataToSongInfo = (data): Array<SongInfo> => {
  return data.items.map((obj) => {
    const match = regexISODuration.exec(obj.contentDetails.duration) as RegExpExecArray;
    const hours = Number(match[12] ?? 0);
    const minutes = Number(match[14] ?? 0);
    const seconds = match[16] ?? '0';

    return {
      title: obj.snippet.title,
      artist: obj.snippet.channelTitle,
      image: obj.snippet.thumbnails.medium.url,
      url: `https://www.youtube.com/watch?v=${obj.id}`,
      duration: `${hours * 60 + minutes}:${seconds.padStart(2, '0')}`,
      service: 'youtube',
    };
  });
};

export const searchYoutube = async ({
  token,
  query,
  type = 'video',
  order = 'relevance',
  maxResults = 5,
}: ResquestInterfaceYoutube): Promise<Array<SongInfo>> => {
  const paramsUrlSearch = { q: query, type, order, maxResults };
  const dataSearch = await fetchApi(token, baseURL, 'search', paramsUrlSearch);

  const dataVideos = await fechtApiDetailsVideo(token, dataSearch);

  return youtubeDataToSongInfo(dataVideos);
};

// trendingYoutube
export const trendingYoutube = async ({
  token,
  regionCode = 'fr',
  videoCategoryId = 10,
  maxResults = 5,
}: ResquestInterfaceYoutube): Promise<Array<SongInfo>> => {
  const paramsUrlTrend = { chart: 'mostPopular', regionCode, videoCategoryId, maxResults };
  const dataTrend = await fetchApi(token, baseURL, 'videos', paramsUrlTrend);

  const dataVideos = await fechtApiDetailsVideo(token, dataTrend);

  return youtubeDataToSongInfo(dataVideos);
};

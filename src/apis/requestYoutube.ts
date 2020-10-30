import { fetchApi } from './utils';
import { SongInfo } from './requestServices';

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

const getAllIdVideo = (data): string[] => data.items.map((obj) => obj.id.videoId);

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

  const allIdVideo = getAllIdVideo(dataSearch);
  const paramsUrlVideos = { part: 'id,contentDetails,snippet', id: allIdVideo.join(',') };
  const dataVideos = await fetchApi(token, baseURL, 'videos', paramsUrlVideos);

  return youtubeDataToSongInfo(dataVideos);
};

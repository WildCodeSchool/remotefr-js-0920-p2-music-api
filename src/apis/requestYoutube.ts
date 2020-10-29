import { fetchApi, SongInfo } from './utils';

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

export const youtubeDataToSongInfo = (data: Record<string, any>): Array<SongInfo> => {
  return data.items.map((obj) => {
    const regexTime = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
    const tab = regexTime.exec(obj.contentDetails.duration) as RegExpExecArray;

    return {
      title: obj.snippet.title,
      artist: obj.snippet.channelTitle,
      image: obj.snippet.thumbnails.medium.url,
      url: `https://www.youtube.com/watch?v=${obj.id}`,
      duration: `${tab[2]}:${tab[3].padStart(2, '0')}`,
    };
  });
};

const searchYoutube = async ({
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

export default searchYoutube;

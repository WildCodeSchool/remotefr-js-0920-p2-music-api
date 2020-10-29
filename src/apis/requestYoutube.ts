import axios from 'axios';
import { toQuery, ItemPush, transformDataYoutube } from './utils';

const urlSearch = 'https://youtube.googleapis.com/youtube/v3/search?';

type TypeYoutube = 'video' | 'playlist' | 'channel';
type OrderYoutube = 'date' | 'rating' | 'relevance' | 'title' | 'videoCount' | 'viewCount';

interface ResquestInterfaceYoutube {
  token: string;
  query: string;
  type?: TypeYoutube;
  order?: OrderYoutube;
  maxResults?: number;
}

const requestYoutube = ({
  token,
  query,
  type = 'video',
  order = 'relevance',
  maxResults = 5,
}: ResquestInterfaceYoutube): Promise<Array<ItemPush>> => {
  const url = encodeURI(
    `${urlSearch}${toQuery({
      part: 'snippet',
      q: query,
      type,
      order,
      maxResults,
    })}`
  );

  const searchYoutube = async (): Promise<Array<ItemPush>> => {
    try {
      const response = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
      return transformDataYoutube(response.data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('error.response :>> ', error.response);
      return error.response;
    }
  };

  return searchYoutube();
};

export default requestYoutube;

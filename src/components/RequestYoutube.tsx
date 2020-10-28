import { useContext } from 'react';
import axios from 'axios';
import { TokenContext } from '../TokenContext';
import toQuery from './utils';

// Interface identique Spotify/Youtube
interface ItemPush {
  title: string;
  artist: string;
  url: string;
  image: string;
}

const transformDataYoutube = (data: Record<string, any>): Array<ItemPush> => {
  const ret: Array<ItemPush> = [];

  data.items.forEach((obj: Record<string, any>) => {
    const item: ItemPush = {
      title: obj.snippet.title,
      artist: obj.snippet.channelTitle,
      image: obj.snippet.thumbnails.medium.url,
      url: `https://www.youtube.com/watch?v=${obj.id.videoId}`,
    };
    ret.push(item);
  });
  return ret;
};

const urlSearch = 'https://youtube.googleapis.com/youtube/v3/search?';

type TypeYoutube = 'video' | 'playlist' | 'channel';
type OrderYoutube = 'date' | 'rating' | 'relevance' | 'title' | 'videoCount' | 'viewCount';

interface ResquestInterfaceYoutube {
  query: string;
  type?: TypeYoutube;
  order?: OrderYoutube;
  maxResults?: number;
}

const RequestYoutube = ({
  query,
  type = 'video',
  order = 'relevance',
  maxResults = 5,
}: ResquestInterfaceYoutube): Promise<Array<ItemPush>> => {
  const {
    services: { youtube },
  } = useContext(TokenContext);

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
      const response = await axios.get(url, { headers: { Authorization: `Bearer ${youtube.token}` } });
      return transformDataYoutube(response.data);
    } catch (error) {
      console.log('error.response :>> ', error.response);
      return error.response;
    }
  };

  return searchYoutube();
};

export default RequestYoutube;

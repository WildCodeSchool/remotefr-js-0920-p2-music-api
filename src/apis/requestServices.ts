import { AuthToken, ServiceName } from '../TokenContext';
import { searchSpotify, trendingSpotify } from './requestSpotify';
import { searchYoutube, trendingYoutube } from './requestYoutube';
import { interleave } from './utils';

// Interface identique Spotify/Youtube
export interface SongInfo {
  title: string;
  artist: string;
  url: string;
  image: string;
  duration: string;
  service: ServiceName;
}

export function limitPerService(totalToShow: number, services: Record<ServiceName, AuthToken>): number {
  const serviceCount = Object.values(services).reduce(
    (count, service) => (service.token !== null ? count + 1 : count),
    0
  );

  return Math.floor(totalToShow / serviceCount);
}

export async function searchServices(
  services: Record<ServiceName, AuthToken>,
  query: string,
  limit = 20
): Promise<SongInfo[]> {
  const requests: Promise<SongInfo[]>[] = [];

  const perService = limitPerService(limit, services);

  if (services.spotify.token != null) {
    requests.push(searchSpotify(services.spotify.token, query, perService));
  }
  if (services.youtube.token != null) {
    requests.push(
      searchYoutube({
        token: services.youtube.token,
        query,
        maxResults: perService,
      })
    );
  }

  const songs: SongInfo[][] = [];

  for (const request of await Promise.allSettled(requests)) {
    // Log rejected promises
    if (request.status === 'rejected') {
      // eslint-disable-next-line no-console
      console.error(request.reason);
    }
    // Only keep results from fufilled requests
    else {
      songs.push(request.value);
    }
  }

  return interleave(songs);
}

export async function trendingServices(services: Record<ServiceName, AuthToken>, limit = 20): Promise<SongInfo[]> {
  const requests: Promise<SongInfo[]>[] = [];

  const perService = limitPerService(limit, services);

  if (services.spotify.token != null) {
    requests.push(trendingSpotify(services.spotify.token, perService));
  }
  if (services.youtube.token != null) {
    requests.push(trendingYoutube({ token: services.youtube.token, maxResults: perService }));
  }

  const songs: SongInfo[][] = [];

  for (const request of await Promise.allSettled(requests)) {
    // Log rejected promises
    if (request.status === 'rejected') {
      // eslint-disable-next-line no-console
      console.error(request.reason);
    }
    // Only keep results from fufilled requests
    else {
      songs.push(request.value);
    }
  }

  return interleave(songs);
}

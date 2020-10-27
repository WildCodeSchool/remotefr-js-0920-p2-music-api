import React from 'react';

export interface AuthTokens {
  spotifyToken: string | null;
  youtubeToken: string | null;

  setToken: (key: Exclude<keyof AuthTokens, 'setToken'>, value: string | null) => void;
}

export const TokenContext = React.createContext<AuthTokens>({
  spotifyToken: null,
  youtubeToken: null,
  setToken() {
    // default
  },
});

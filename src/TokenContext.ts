import React from 'react';

export type ServiceName = 'spotify' | 'youtube';

export interface AuthToken {
  token: string | null;
  expirationStamp: number;
}

export interface AuthTokens {
  services: Record<ServiceName, AuthToken>;

  setToken: (name: ServiceName, token: string, expiresIn: number) => void;
  removeToken: (name: ServiceName) => void;
}

export const TokenContext = React.createContext<AuthTokens>({
  services: {
    spotify: {
      token: null,
      expirationStamp: -1,
    },
    youtube: {
      token: null,
      expirationStamp: -1,
    },
  },
  setToken() {
    throw new Error('Not implemented');
  },
  removeToken() {
    throw new Error('Not implemented');
  },
});

import React, { useState } from 'react';

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

const defaultServices: Record<ServiceName, AuthToken> = {
  spotify: {
    token: null,
    expirationStamp: -1,
  },
  youtube: {
    token: null,
    expirationStamp: -1,
  },
};

export const TokenContext = React.createContext<AuthTokens>({
  services: defaultServices,
  setToken() {
    throw new Error('Not implemented');
  },
  removeToken() {
    throw new Error('Not implemented');
  },
});

export function getServicesLocalStorage(): Record<ServiceName, AuthToken> {
  return JSON.parse(String(localStorage.getItem('services'))) ?? defaultServices;
}

// Custom hook to handle services (service / setToken / removeToken)
export function useServices(
  initServices: Record<ServiceName, AuthToken>
): [
  Record<ServiceName, AuthToken>,
  (name: ServiceName, value: string, expiresIn: number) => void,
  (name: ServiceName) => void
] {
  const [services, setService] = useState(initServices);

  const setToken = (name: ServiceName, value: string, expiresIn: number): void => {
    services[name] = {
      token: value,
      // expiresIn is in seconds, so we convert it to miliseconds before adding it to the current timestamp
      expirationStamp: Date.now() + expiresIn * 1000,
    };

    localStorage.setItem('services', JSON.stringify(services));
    setService({ ...services });
  };

  const removeToken = (name: ServiceName): void => {
    services[name] = { token: null, expirationStamp: -1 };

    localStorage.setItem('services', JSON.stringify(services));
    setService({ ...services });
  };

  return [services, setToken, removeToken];
}

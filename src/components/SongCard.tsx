import React from 'react';
import { SongInfo } from '../apis/requestServices';
import { ServiceName } from '../TokenContext';

interface SongCardProps {
  title: string;
  author: string;
  image: string;
  duration: string;
  link: string;
  service: ServiceName;
}

export const SongCard = ({ title, author, image, duration, link, service }: SongCardProps): JSX.Element => (
  <a className="song-card-a" href={link} rel="noopener noreferrer" target="_blank">
    <article className={`song-card song-card-${service}`}>
      <img className="image" src={image} alt={`Miniature de ${title}`} />
      <h5 className="title">{title}</h5>
      <span className="author">{author}</span>
      <i className={`icon fab fa-${service} text-${service}`} />
      <span className="duration">{duration}</span>
    </article>
  </a>
);

export const SongCardList = ({ songs }: { songs: SongInfo[] }): JSX.Element => (
  <ul className="list-unstyled d-flex flex-column align-items-center">
    {songs.map((song, i) => (
      <li className="w-100" key={song.url}>
        <SongCard
          title={song.title}
          author={song.artist}
          image={song.image}
          duration={song.duration}
          link={song.url}
          service={song.service}
        />
        {/* HR except on last iteration */}
        {i + 1 !== songs.length && <hr />}
      </li>
    ))}
  </ul>
);

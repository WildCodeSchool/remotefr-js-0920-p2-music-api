import React from 'react';
import { ServiceName } from '../TokenContext';

interface SongCardProps {
  title: string;
  author: string;
  image: string;
  duration: string;
  link: string;
  service: ServiceName;
}

const SongCard = ({ title, author, image, duration, link, service }: SongCardProps): JSX.Element => (
  <a className="song-card-a" href={link} rel="noopener noreferrer" target="_blank">
    <article className={`song-card song-card-${service}`}>
      <img className="image" src={image} alt={`Miniature de ${title}`} />
      <h6 className="title">{title}</h6>
      <span className="author">{author}</span>
      <i className={`icon fab fa-${service} text-${service}`} />
      <span className="duration">{duration}</span>
    </article>
  </a>
);
export default SongCard;

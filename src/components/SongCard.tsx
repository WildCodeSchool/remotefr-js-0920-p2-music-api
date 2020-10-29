import React from 'react';
import { ServiceName } from '../TokenContext';

interface SongCardProps {
  title: string;
  author: string;
  image: string;
  service: ServiceName;
}

const SongCard = ({ title, author, image, service }: SongCardProps): JSX.Element => (
  <article className={`song-card song-card-${service}`}>
    <img src={image} alt={`Miniature de ${title}`} />
    <h3>{title}</h3>
    <span>{author}</span>
  </article>
);
export default SongCard;

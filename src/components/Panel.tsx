import React, { PropsWithChildren } from 'react';

interface PanelProps {
  className: string;
  active: boolean;
  onClose: () => unknown;
}

const Panel = ({ children, className, active, onClose }: PropsWithChildren<PanelProps>): JSX.Element => {
  return (
    <article className={`${className} panel ${active ? 'active' : ''} p-2 shadow`}>
      <button className="btn btn-outline-danger" type="button" aria-label="Fermer le panneau" onClick={onClose}>
        <i className="fas fa-times" />
      </button>
      <div>{children}</div>
    </article>
  );
};
Panel.defaultProps = {
  className: '',
};
export default Panel;

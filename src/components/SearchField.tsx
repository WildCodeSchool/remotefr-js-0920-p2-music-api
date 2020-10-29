/* eslint-disable react/prop-types */
import React from 'react';

export default function SearchField({ handleOnSubmit, fieldValue, setFieldValue }): JSX.Element {
  return (
    <div>
      <form onSubmit={(e): void => handleOnSubmit(e)}>
        <input type="text" value={fieldValue} onChange={(e): void => setFieldValue(e.target.value)} />
        <button type="submit">Envoyer</button>
      </form>
    </div>
  );
}

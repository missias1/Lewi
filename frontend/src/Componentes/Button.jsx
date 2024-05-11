import React from 'react';
import './Button.css';

function Button({ children, onClick, type }) {
  return (
    <button className={`button ${type}`} onClick={onClick}>
      {children}
    </button>
  );
}


export default Button;
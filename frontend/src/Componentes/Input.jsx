import React from 'react';
import './Input.css'

const Input = ({ topic, onChange, type }) => {
  return (
    <div className="input-topic">
      <input
        type={type}
        placeholder="Escreva o tópico que deseja ser questionado"
        value={topic}
        onChange={onChange} 
      />
    </div>
  );
};

export default Input;
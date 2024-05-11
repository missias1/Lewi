import React from 'react';
import './Input.css'

const Input = ({ topic, onChange }) => {
  return (
    <div className="input-topic">
      <input
        type="text"
        placeholder="Escreva o tópico que deseja ser questionado"
        value={topic}
        onChange={onChange} 
      />
    </div>
  );
};

export default Input;
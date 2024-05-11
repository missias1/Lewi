import React from 'react';
import './Input.css'

const Input = ({ topic, onChange }) => {
  return (
    <div className="input-topic">
      <input
        type="text"
        placeholder="Escreva o tópico que deseja ser questionado"
        value={topic} // Exibe o valor do estado
        onChange={onChange} // Chama a função de atualização do pai
      />
    </div>
  );
};

export default Input;
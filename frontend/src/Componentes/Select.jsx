import React from 'react';
import './Select.css'

const Select = ({ options, placeholder, handleChangeSelect, selectedOption, posicao }) => {

  return (
    <div className={`select-container ${posicao}`} >
      <select value={selectedOption} onChange={handleChangeSelect}>
        <option value="" disabled>{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
};

export default Select;
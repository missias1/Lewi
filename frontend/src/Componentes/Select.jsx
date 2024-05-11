import React, { useState } from 'react';
import './Select.css'

const Select = ({ options, placeholder, handleChangeSelect, selectedOption }) => {
  //const [selectedOption, setSelectedOption] = useState('');

  /*const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };*/

  return (
    <div className="select-container" >
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
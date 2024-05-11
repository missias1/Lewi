import React, { useState } from "react";
import Select from './Select';
import Input from './Input';
import Button from './Button';
import './Form.css'

function Form(){
  const [topic, setTopic] = useState('');

  const handleTopicChange = (event) => {
    setTopic(event.target.value);
  };

  const handleAIResponse = () => {

  };

  return (
    <>
        <div className="form-group">
          <div className="selects">
            <Select
              options={['Facil', 'Médio', 'Dificil', 'Misturado']}
              placeholder="Dificuldade"
            />
            <Select
              options={['Pergunta e Resposta', 'Verdadeiro e Falso', 'Multipla Escolha']}
              placeholder="Modalidade"
            />
            <Select
              options={['5', '10', '15', '20']}
              placeholder="Quantidade"
            />
          </div>
        <Input topic={topic} onChange={handleTopicChange} />

        <Button type="btn-criar" onClick={handleAIResponse} >
          {"+ Criar"}
        </Button>
      </div>
    </>
  )

}

export default Form;
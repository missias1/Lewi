import React, { useState } from 'react';
import Header from '../Componentes/Header';
import Card from '../Componentes/Card';
import Button from '../Componentes/Button';
import Select from '../Componentes/Select';
import Input from '../Componentes/Input';
import '../Componentes/Form.css'
import GetQuestionsByText from '../Services/GetQuestionsByText';

function LewiTematica() {
  const [respostas, setRespostas] = useState({
    seiResponder: 0,
    achoQueSei: 0,
    naoSei: 0
  });
  const [selects, setSelects] = useState({
    dificuldade: "Facil",
    modalidade: "Pergunta e Resposta",
    quantidade: 5
  });
  const [topic, setTopic] = useState('');
  const [data, setData] = useState([{
    pergunta: "Qual a capital do Brazil?",
    resposta: "Brasilia"
  }, 
  {
    pergunta: "Qual a capital do Espirito Santo?",
    resposta: "Vitoria"
  },
  {
    pergunta: "Qual a capital da Bahia?",
    resposta: "Salvador"
  }]);

  const [controllerQuestion, setControllerQuestion] = useState(0);


  const handleTopicChange = (event) => {
    setTopic(event.target.value);
  };
  const handleAIResponse = async () => {

    setData([{
      pergunta: "",
      resposta: ""
    }]);

    try{
      const questionsByAI = await GetQuestionsByText(topic, selects);
      const jsonQuestions = JSON.parse(questionsByAI.response);

      if(questionsByAI.status && typeof(jsonQuestions) === 'object'){
        setData(jsonQuestions);
      }
    } catch {
      const error = {
        pergunta: "Houve um erro ao solicitar a criação de perguntas",
        resposta: "Tente mais tarde"
      }
      setData([error])

    }
  };

  // Funções de clique para cada botão
  const handleSeiResponder = () => {
    setRespostas(prevRespostas => ({
      ...prevRespostas,
      seiResponder: prevRespostas.seiResponder + 1
    }));
  };

  const handleAchoQueSei = () => {
    setRespostas(prevRespostas => ({
      ...prevRespostas,
      achoQueSei: prevRespostas.achoQueSei + 1
    }));
  };

  const handleNaoSei = () => {
    setRespostas(prevRespostas => ({
      ...prevRespostas,
      naoSei: prevRespostas.naoSei + 1
    }));
  };

  const handleChangeSelect = (event) => {

    if(event.target[0].text == "Dificuldade"){
      setSelects(prevRespostas => ({
        ...prevRespostas,
        dificuldade: event.target.value
      }));
    }
    else if (event.target[0].text == "Modalidade"){
      setSelects(prevRespostas => ({
        ...prevRespostas,
        modalidade: event.target.value
      }));
    }
    else {
      setSelects(prevRespostas => ({
        ...prevRespostas,
        quantidade: event.target.value
      }));
    }
  };

  const proximaPergunta = () => {
    const index = controllerQuestion + 1;
    if (index >= data.length){
      setControllerQuestion(0)
    } else {
      setControllerQuestion(index)
    }

  }

  // Calculando a pontuação (adapte a lógica conforme necessário)
  const pontuacao = respostas.seiResponder * 2 + respostas.achoQueSei;

  return (
    <>
      <Header pontuacao={pontuacao} />
      <Card pergunta={data[controllerQuestion].pergunta} resposta={data[controllerQuestion].resposta } proximaPergunta={proximaPergunta} modalidade={selects.modalidade} />
      <div className="botoes">
        <Button type="sei-responder" onClick={handleSeiResponder}>
          Sei responder
        </Button>
        <Button type="acho-que-sei" onClick={handleAchoQueSei}>
          Acho que sei
        </Button>
        <Button type="nao-sei" onClick={handleNaoSei}>
          Não sei
        </Button>
      </div>

      <div className="form-group">
          <div className="selects">
            <Select
              options={['Facil', 'Médio', 'Dificil', 'Misturado']}
              placeholder="Dificuldade"
              handleChangeSelect={handleChangeSelect}
              selectedOption={selects.dificuldade}
            />
            <Select
              options={['Pergunta e Resposta', 'Verdadeiro e Falso']}
              placeholder="Modalidade"
              handleChangeSelect={handleChangeSelect}
              selectedOption={selects.modalidade}
            />
            <Select
              options={['5', '10', '15', '20']}
              placeholder="Quantidade"
              handleChangeSelect={handleChangeSelect}
              selectedOption={selects.quantidade}
            />
          </div>
        <Input topic={topic} onChange={handleTopicChange} />

        <Button type="btn-criar" onClick={handleAIResponse} >
          {"+ Criar"}
        </Button>
      </div>

    </>
  );
}

export default LewiTematica;
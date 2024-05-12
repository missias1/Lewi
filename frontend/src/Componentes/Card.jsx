import React, { useState } from 'react';
import './Card.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import GetFeedbackAnswer from '../Services/GetFeedbackAnswer';
import Loading from './Loading';

function Card({ pergunta, resposta, proximaPergunta, isLoadingAnswer }) {
  const [hasProcessCompleted, setHasProcessCompleted] = useState(false);
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [recognizedText, setRecognizedText] = useState('');
  const mediaRecorderRef = React.useRef(null);
  const recognitionRef = React.useRef(null);
  const [dataFeedback, setDataFeedback] = useState({
    "feedback": "",
    "sugestao": ""
  });

  const [mostrarOpcoes, setMostrarOpcoes] = useState(false);
  const [expandir, setExpandir] = useState(false);
  const [verResposta, setVerResposta] = useState(false);
  const [fixarOpcoes, setFixarOpcoes] = useState(false);
  const [isLoading, setIsLoading] = useState(null);


  const handleClickCard = () => {
    setMostrarOpcoes(!mostrarOpcoes);
    setFixarOpcoes(!fixarOpcoes);
    setVerResposta(false)
  };

  const handleClickVerResposta = (event) => {
    event.stopPropagation();
    setVerResposta(!verResposta);
  };

  const handleClickExpandir = (event) => {
    event.stopPropagation();
    setExpandir(!expandir);
  };

  const handleProximaPergunta = (event) => {
    event.stopPropagation();
    setMostrarOpcoes(false);
    setVerResposta(false);
    setFixarOpcoes(false);
    setDataFeedback({
      "feedback": "",
      "sugestao": ""
  });
  setHasProcessCompleted(false);
  setAudioBlob(null);
    proximaPergunta();
  };

  const startRecording = (event) => {
    event.stopPropagation();
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();;
        recognition.lang = 'pt-BR';
        recognition.continuous = true;
        recognitionRef.current = recognition;
        
        recognition.onstart = () => {
          mediaRecorder.start();
        };

          recognition.onresult = (event) => {
            
            const transcript = event.results[event.results.length - 1][0].transcript;
            setRecognizedText(prevText => prevText + ' ' + transcript);

        }

        recognition.start();

        mediaRecorder.ondataavailable = (event) => {
          const blob = new Blob([event.data], { type: 'audio/wav' });
          setAudioBlob(blob);
        };
      })
      .catch((error) => {
        console.error('Erro ao acessar o microfone:', error);
      });

    setRecording(true);
  };

  const stopRecording = (event) => {
    event.stopPropagation();
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      recognitionRef.current.stop();
      setRecording(false);
      setHasProcessCompleted(true);
    }
  };

  async function handleAIResponse(event){
    event.stopPropagation();
    try {
      setIsLoading(true);
      const feedbackByAI = await GetFeedbackAnswer(pergunta, recognizedText)
      if(feedbackByAI.status){
        const jsonQuestions = JSON.parse(feedbackByAI.response);
        setIsLoading(false);
        setDataFeedback(jsonQuestions);
      }
      setRecognizedText("");
  
    } catch (error) {
      console.error('Erro ao enviar transcrição para o backend:', error);
    }
  }

  return (
    <div className={`card ${mostrarOpcoes ? 'mostrar-resposta' : ''} ${expandir ? 'expandido' : ''}`} onClick={handleClickCard}>
      {(isLoadingAnswer || isLoading) && <Loading />} 
      <h3>{pergunta}</h3>
      {fixarOpcoes && (
        <>
          {dataFeedback.feedback !== "" && (
            <div className='feedback'>
              <p>{dataFeedback.feedback}</p>
              <p>{dataFeedback.sugestao}</p>
            </div>
          )}
          <div className='opcoes-container'>
              <div className='opcoes-btn'>
                <button onClick={handleClickVerResposta}>Ver resposta</button>
                {!recording ? (
                  <button onClick={startRecording}>
                    Quero responder
                  </button>
                ) : (
                  <button onClick={stopRecording}>
                    Parar Gravação</button>
                )}

                {hasProcessCompleted &&
                  <button className="btn-feedback-ai" onClick={handleAIResponse}>Enviar resposta para avaliação</button>
                }
              </div>

                {audioBlob && (
                  <audio controls>
                    <source src={URL.createObjectURL(audioBlob)} type="audio/wav" />
                  </audio>
                )}

          </div>


        </>
      )}

      {verResposta &&
          <p className='resposta'>{resposta}</p>
      }

      <button className="proximo-botao" onClick={handleProximaPergunta}>
        <FontAwesomeIcon icon={faArrowRight} />
      </button>

      <button onClick={handleClickExpandir} className="botao-expandir">
        <FontAwesomeIcon icon={faExpand} className="icone-expandir" />
      </button>

    </div>
  );
}

export default Card;
import React, { useState } from 'react';

const VoiceRecorderTranscript = () => {
  const [hasProcessCompleted, setHasProcessCompleted] = useState(false);
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [recognizedText, setRecognizedText] = useState('');
  const mediaRecorderRef = React.useRef(null);

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();;
        recognition.lang = 'pt-BR';
        recognition.continuous = true;

        recognition.onstart = () => {
          console.log('Transcrição iniciada.');
        };

          recognition.onresult = (event) => {
            
            const transcript = event.results[event.results.length - 1][0].transcript;
            console.log('Resultado da transcrição:', transcript);
            setRecognizedText(prevText => prevText + ' ' + transcript);

        }

        recognition.start();

        mediaRecorder.start();
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

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setRecording(false);
      setHasProcessCompleted(true);
    }
  };

async function generateAnswer(){
  try {
    const formData = new FormData();
    formData.append('transcript', recognizedText);

    const req = {
      "data": recognizedText
    }

    const response = await fetch('http://localhost:5000/api/transcricao', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // Define o tipo de conteúdo como JSON
      },
      body: JSON.stringify(req)
    });

    if (!response.ok) {
      console.log('Não foi possível obter resposta do usuário');
    }

  } catch (error) {
    console.error('Erro ao enviar transcrição para o backend:', error);
  }
}

  return (
    <div>
      {!recording ? (
        <button onClick={startRecording}>Iniciar Gravação</button>
      ) : (
        <button onClick={stopRecording}>Parar Gravação</button>
      )}
      {hasProcessCompleted &&
        <button onClick={generateAnswer}>Enviar minha resposta</button>
      }

      {recognizedText && <p>Texto Reconhecido: {recognizedText}</p>}

      {audioBlob && (
        <audio controls>
          <source src={URL.createObjectURL(audioBlob)} type="audio/wav" />
        </audio>
      )}
    </div>
  );
};

export default VoiceRecorderTranscript;

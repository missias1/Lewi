async function GetFeedbackAnswer(pergunta, recognizedText){
  try {
    const formData = new FormData();
    formData.append('transcript', recognizedText);

    const command = {
      "pergunta": pergunta,
      "resposta": recognizedText
    }

    const req = {
      "data": command
    }

    const response = await fetch('http://localhost:5000/api/transcricao', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // Define o tipo de conteúdo como JSON
      },
      body: JSON.stringify(req)
    });

    if (!response.ok) {
      return {
        "response": "Não foi possível avaliar sua resposta. Tente mais tarde!",
        "status": false
      }
    }
    else {
      const data = await response.json();
      return {
        "response": data.response,
        "status": response.ok
      }
    }

  } catch {
    return {
      "response": "Não foi possível avaliar sua resposta. Tente mais tarde!",
      "status": false
    }
  }
}

export default GetFeedbackAnswer; 
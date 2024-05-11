async function GetQuestionsByText(inputText, selects){
  try {

    const command = {
      "topic": inputText,
      "selects": selects
    }

    const req = {
      "data": command
    }
    console.log(JSON.stringify(req));

    const response = await fetch('http://localhost:5000/api/quesions-by-text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // Define o tipo de conteúdo como JSON
      },
      body: JSON.stringify(req)
    });


    if (!response.ok) {
      return {
        "response": "",
        "status": response.ok
      }
    }
    else {
      const data = await response.json();
      return {
        "response": data.response,
        "status": response.ok
      }
    }

  } catch (error) {
    return "Erro ao gerar as perguntas. Tente mais tarde";
  }
}

export default GetQuestionsByText;
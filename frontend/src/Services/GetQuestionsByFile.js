const GetQuestionsByFile = async (formData) => {

  try {
    const response = await fetch('http://localhost:5000/api/file', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        return {
          "response": "",
          "status": response.ok
        }
      }
      else {
        const data = await response.json();
        const dataJson = JSON.parse(data.response);
        return {
          "response": dataJson,
          "status": response.ok
        }
      }
  } catch (error) {
    console.error('Erro ao enviar arquivo:', error);
  }
};

export default GetQuestionsByFile;
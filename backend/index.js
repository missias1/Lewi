const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const path = require('path');
const multer = require('multer');

const genAI = new GoogleGenerativeAI("");

const model = genAI.getGenerativeModel({ model: "gemini-pro"});

const app = express();
const port = 5000;

app.use(cors());

app.use(bodyParser.json());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  });
  
  const upload = multer({ storage: storage });

  app.post('/api/transcricao',  upload.single('file'), async (req, res) => {
    try {
        const pergunta = req.body.data.pergunta;
        const resposta = req.body.data.resposta;
        const chat = model.startChat({
           history: []
          });

        const command = `Você é especialista no assunto que aborda a seguinte pergunta: ${pergunta}. Avalie como um professor se a resposta dada faz sentido para a pergunta e se está correta ou não. Dê um feedback positivo se a resposta estiver correta e caso a resposta esteja errada, ou parcialmente correta, descreva a resposta correta para o aluno. Se a resposta não fizer sentido com a pergunta, deixe isso claro também. De acordo com a resposta dada, forneça uma sugestão do que o aluno precisa melhorar se a resposta não estiver certa ou for parcialmente correta. Caso a resposta esteja errada, ofereça uma recomendação para o aluno aprender sobre o tópico da questão. Seja especifico na sugestão. Diga o nome do filme, documentário, série, artigo ou livro para ele aprender. Se a resposta estiver correta, indique um conteúdo para ele continuar aprendendo. Cite fontes confiáveis e seja objetivo na sugestão.
        
        A pergunta e resposta:
        pergunta: ${pergunta}
        resposta: ${resposta}

        Quero a resposta em formato json, mas sem especificar no retorno que é um json. Os valores dentro de "feedback" e "sugestao" não podem conter o caracter asterisco. Quero que a resposta só contenha o json com o feedback para o aluno. Não quero que que a resposta tenha o caracter "*". conforme o exemplo abaixo:

        {
          "feedback": ""
          "sugestao": ""
        }
        `
        console.log(command)
        
        const response = await chat.sendMessage(command);
  
        console.log(response.response.text());
  
        return res.json({response: response.response.text()})
  
    } catch (error) {
        console.error('Erro em obter feedback da resposta do usuário', error);
        res.status(500).json({ error: 'Erro ao converter áudio em texto.' });
    }
  
  });

app.post('/api/quesions-by-text',  upload.single('file'), async (req, res) => {
    try {

        console.log("ENTREI NO QUESTIONS BY TEXT")

        const topic = req.body.data.topic;
        const selects = req.body.data.selects;

        const command = `Você é um especialista no assunto ${topic}. Gere a quantidade de ${selects.quantidade} perguntas na modalidade de ${selects.modalidade}. Quero que o nível das perguntas sejam de nível ${selects.dificuldade} para que eu possa utilizar em um flashCard. Quero a resposta em formato json, mas sem especificar no retorno que é um json. Quero que a resposta só contenha o array dos objetos igual ao formato abaixo:
        
        Se a Modalidade for pergunta e resposta, esse é um exemplo da estrtura da resposta:
        [
          {
            "pergunta": ""
            "resposta": ""
          }
        ]
        
        Se a Modalidade for verdadeiro e falso, esse é um exemplo da estrtura da resposta:
        [
          {
            "pergunta": ""
            "resposta": ""
          }
        ]
        Antes de enviar a resposta, avalie também sua resposta relacionada a pergunta como se fosse um segundo analista corrigindo a sua propria resposta.
        .`
        
        console.log(command)
        
        const chat = model.startChat({
           history: []
          });
        
        const response = await chat.sendMessage(command);

        console.log(response.response.text());

        return res.json({response: response.response.text()})

    } catch (error) {
        console.error('Erro ao criar perguntas:', error);
        res.status(500).json({ error: 'Erro ao criar perguntas:' });
    }

});


app.listen(port, () => {
    console.log(`Servidor está ouvindo na porta ${port}`);
});

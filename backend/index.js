const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();
const bodyParser = require('body-parser');

const genAI = new GoogleGenerativeAI();
const model = genAI.getGenerativeModel({ model: "gemini-pro"});

const app = express();
const port = 5000;

app.use(cors());

app.use(bodyParser.json());

app.post('/api/transcricao', async (req, res) => {
    try {

        console.log(req.body)

        const userCommand = req.body.texto.data;
        const chat = model.startChat({
           history: []
          });
        
        const response = await chat.sendMessage(userCommand);

        console.log(response.response.text());

    } catch (error) {
        console.error('Erro ao converter áudio em texto:', error);
        res.status(500).json({ error: 'Erro ao converter áudio em texto.' });
    }
});

app.listen(port, () => {
    console.log(`Servidor está ouvindo na porta ${port}`);
});

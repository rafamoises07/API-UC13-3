const express = require('express');
const axios = require('axios'); // Biblioteca para requisição HTTP
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Importa o modelo criado
const Address = require("../backend/model/Address");

// Carrega as variáveis de ambiente .ENV
dotenv.config();

// Chama o Express (Servidor)
const app = express();

// Permitir JSON nas requisições
app.use(express.json());

// CORS (Restrito para a origem específica)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // Ajuste conforme necessário
    res.header("Access-Control-Allow-Methods", "GET, POST");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

// Rota GET para buscar informações conforme o CEP informado
app.get('/api/cep/:cep', async (req, res) => {
    const { cep } = req.params; // Extrai o CEP da URL

    try {
        // Faz requisição GET para API ViaCEP, passando o CEP
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json`);
        res.json(response.data);
    } catch (error) {
        console.error(error); // Loga o erro no servidor
        res.status(500).json({ error: "Erro ao buscar o CEP!"});
    }
});

// Rota POST para salvar o endereço no MongoDB
app.post('/api/address', async (req, res) => {
    const { cep, logradouro, bairro, cidade, estado } = req.body; // Extrai o corpo JSON

    try {
        // Cria um novo documento de endereço usando o modelo Address
        const newAddress = new Address({ cep, logradouro, bairro, cidade, estado });
        await newAddress.save(); // Salva no MongoDB
        res
            .status(201)
            .json({ message: "Endereço salvo com sucesso!", data: newAddress });
    } catch (error) {
        console.error(error); // Loga o erro no servidor
        res.status(500).json({ error: "Erro ao salvar o endereço!"});
    }
});

// Obtem as credenciais do MongoDB armazenadas no .env
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

// Cria a string de conexão com o MongoDB
const mongoURI = `mongodb+srv://${dbUser}:${dbPassword}@apiuc13-2.hpq3j.mongodb.net/?retryWrites=true&w=majority&appName=APIUC13-2`;

// Define a porta que o servidor irá executar 
const port = 3000;

mongoose
    .connect(mongoURI) // Conecta ao banco pelo link 
    .then(() => { // Quando for conectado corretamente 
        console.log("Conectou ao banco de dados") // Exibe uma mensagem no console 
        // Inicia o servidor após o banco de dados conectar 
        app.listen(port, () => {
            console.log(`Servidor rodando em http://localhost:${port}`)
        });
    })
    .catch((err) => console.log("Erro ao conectar ao MongoDB!", err)); // Exibe o erro

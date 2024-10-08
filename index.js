const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();

app.use(express.json());  // Middleware para processar JSON no corpo das requisições

// Configuração do MongoDB
const uri = "mongodb://localhost:27017";  // URL do MongoDB (localmente)
const client = new MongoClient(uri);
let db, usersCollection, itemsCollection;

async function connectDB() {
    await client.connect();
    db = client.db('emprestimosDB');  // Nome do banco de dados
    usersCollection = db.collection('usuarios');
    itemsCollection = db.collection('itens');
}

// Inicializar a conexão
connectDB().then(() => console.log("Conectado ao MongoDB"));

// Rotas de Usuários
app.post('/usuarios/:nome/:email', async (req, res) => {
    // Extrair o nome e email dos parâmetros da URL
    const { nome, email } = req.params; 

    // Criar o objeto usuário com os dados extraídos
    const user = {nome , email} 

    // Inserir o usuário no MongoDB
    const result = await usersCollection.insertOne(user);

    // Atribuir o ID gerado ao objeto user
    user.id = result.insertedId;

   // Enviar o objeto user como resposta
    res.status(201).send(user);
});

app.get('/usuarios', async (req, res) => {
    const users = await usersCollection.find().toArray();
    res.send(users);
});

app.get('/usuarios/:id', async (req, res) => {
    const user = await usersCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (user) {
        res.send(user);
    } else {
        res.status(404).send({ message: 'Usuário não encontrado' });
    }
});

app.put('/usuarios/:id', async (req, res) => {
    const result = await usersCollection.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: req.body }
    );
    if (result.matchedCount > 0) {
        res.send(req.body);
    } else {
        res.status(404).send({ message: 'Usuário não encontrado' });
    }
});

app.delete('/usuarios/:id', async (req, res) => {
    const user = await usersCollection.findOne({ _id: new ObjectId(req.params.id) });

    const result = await usersCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    
    if (result.deletedCount > 0) {
        res.status(200).json({ message: `Usuário ${user.nome} removido com sucesso!` });
    } else {
        res.status(404).send({ message: 'Usuário não encontrado' });
    }
});

// Rotas de Itens
app.post('/itens/', async (req, res) => {
    const item = req.body;

    item.emprestado = false; // O item começa como não emprestado
    item.usuarioId = null;   // Inicialmente, sem usuário
    
    const result = await itemsCollection.insertOne(item);
   
    item.id = result.insertedId;

    res.status(201).send(item);
});

app.get('/itens', async (req, res) => {
    
    const items = await itemsCollection.find().toArray();
    
    res.send(items);
});

app.get('/itens/:id', async (req, res) => {
    const item = await itemsCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (item) {
        res.send(item);
    } else {
        res.status(404).send({ message: 'Item não encontrado' });
    }
});

app.put('/itens/:id', async (req, res) => {
    const result = await itemsCollection.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: req.body }
    );
    if (result.matchedCount > 0) {
        res.send(req.body);
    } else {
        res.status(404).send({ message: 'Item não encontrado' });
    }
});

app.delete('/itens/:id', async (req, res) => {
    const result = await itemsCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount > 0) {
        res.status(200).send({ message: 'Item removido com sucesso' });
    } else {
        res.status(404).send({ message: 'Item não encontrado' });
    }
});

app.delete('/itens/', async (req, res) => {
    try {
        // Remove todos os documentos da coleção
        const result = await itemsCollection.deleteMany({});

        // Verifica quantos itens foram removidos
        if (result.deletedCount > 0) {
            res.status(200).send({ message: `Todos os ${result.deletedCount} itens foram removidos com sucesso` });
        } else {
            res.status(404).send({ message: 'Não há itens para remover' });
        }
    } catch (error) {
        // Tratamento de erro
        res.status(500).send({ message: 'Erro ao remover os itens', error });
    }
});

// Empréstimo de Item
app.post('/itens/:id/emprestar/:usuarioId', async (req, res) => {
    const { id, usuarioId } = req.params; // O ID do usuário que pegará o item emprestado
    const item = await itemsCollection.findOne({ _id: new ObjectId(req.params.id) });
    
    if (item && !item.emprestado) {
        // Atualizar o item para definir como emprestado
        await itemsCollection.updateOne(
            { _id: new ObjectId(req.params.id) },
            {
                $set: {
                    emprestado: true,
                    usuarioId: new ObjectId(req.params.usuarioId),  // Relaciona o item ao usuário
                    data_emprestimo: new Date(),
                    data_devolucao: null
                }
            }
        );
        res.json({ message: 'Item emprestado com sucesso', id, usuarioId });
    } else {
        res.status(400).send({ message: 'Item não disponível para empréstimo' });
    }
});

// Devolução de Item
app.post('/itens/:id/devolver/:usuarioId', async (req, res) => {
    const item = await itemsCollection.findOne({ _id: new ObjectId(req.params.id) });
    
    if (item && item.emprestado) {
        // Atualizar o item para marcar como devolvido
        await itemsCollection.updateOne(
            { _id: new ObjectId(req.params.id) },
            {
                $set: {
                    emprestado: false,
                    usuarioId: null,  // Limpa a associação com o usuário
                    data_devolucao: new Date()  // Registra a data de devolução
                }
            }
        );
        res.send({ message: 'Item devolvido com sucesso' });
    } else {
        res.status(400).send({ message: 'Item não está emprestado ou não existe' });
    }
});

// Porta do servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

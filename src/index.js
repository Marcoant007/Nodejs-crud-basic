const express = require('express');
const bodyParser = require('body-parser');
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json())

const projects = [];

function logRequests(request, response, next) {
    const { method, url } = request // aqui eu crio uma request  e coloco o metodo e a url para depois eu pegar
    const logLabel = `[${method.toUpperCase()} ${url} ]`; // aqui eu crio o logLabel para instanciar o metodo e a url e o toUppercase e para passar em maisculo 
    console.time(logLabel); // aqui eu estou realizando um console .time pra saber quanto tempo demora cada requisição minha get, post, put, delete
    next()
    console.timeEnd(logLabel) // aqui é o tempo final
}

function validateProjectId(request, response, next) { //essa função é um middleware 
    const { id } = request.params; // aqui eu estou setando o id e esse request.params ele vai validar de acordo com oq eu passar lá na requisição do site 
    if (!isUuid(id)) { // se o isUuid(que é a instalação do uuid id universal) for false, ele retonar um erro de middleware
        return response.status(400).json({ error: 'Middleware bloqueou seu acesso' });
    }

    return next(); // se não bloquear passa para o proximo
}

app.use(logRequests);
app.use('/projects/:id', validateProjectId) // aqui eu coloco a função do middleware  para toda request.query que tiver o :id setado ou seja para o PUT e para o DELETE

app.get('/projects', (request, response) => { // aqui estou fazendo um get para listar os meus projestos cadastrados 
    const { title, owner } = request.query; // aqui estou definindo uma variavel que recebe titulo, ou qualquer outra coisa que eu quiser incrementar e mando uma request.query 
    // que vai criar um filtro baseado nos paramentros que eu passar para o navegador
    const results = title
        ? projects.filter(project => project.title.includes(title)) : projects; // aqui estou criando um filtro e pedindo para exibir o title se não tiver essa condição exibe vazio

    return response.json(results)
})


app.post('/projects', (request, response) => {

    const { title, owner } = request.body; // aqui estou definindo 2 variaveis title, e owner e mandando um request.body, ou seja essa requisiçção vai ser feita no meu json

    const project = { id: uuid(), title, owner } // aqui eu defino oque eu quero passar para essa json
    projects.push(project)  //inserindo os dados dentro do array que nesse caso é a minha memória

    console.log(project)

    return response.status(200).json(project) // aqui eu coloco o retorno .json e mando meu projeto
})
app.put('/projects/:id', (request, response) => {
    const { id } = request.params; // aqui eu crio a variavel id e faço um request.params que só irá validar de acordo com oq for passado na requisição
    const { title, owner } = request.body; // qui estou definindo 2 variaveis title, e owner e mandando um request.body, ou seja essa requisiçção vai ser feita no meu json

    const projectIndex = projects.findIndex(project => project.id === id) // projectIndex é uma variavel que esta sendo criada e instanciando o 
    //projects.findIndex(O método findIndex() retorna o índice no array do primeiro elemento que satisfizer a função de teste provida. Caso contrário, retorna -1, indicando que nenhum elemento passou no teste.)
    if (projectIndex < 0) { // se o projectIndex for < 0 ou seja o ID < 0 retorna que não existe nenhum projeto para ser alterado
        return response.status(400).json({ error: 'Projeto não existe' })
    }
    const project = {
        id,
        title,
        owner,
    }
    projects[projectIndex] = project
    return response.json(project)
})


app.delete('/projects/:id', (request, response) => {
    const { id } = request.params
    const projectIndex = projects.findIndex(project => project.id === id)

    if (projectIndex < 0) {
        return response.status(400).json({ error: 'Projeto não existe' })
    }

    projects.splice(projectIndex, 1);// splice ultilizado para deletar

    return response.status(204).send()
});


app.listen(3001, () => {
    console.log('✅ Back-end started')
})
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui

    const {username} = request.headers;

    const user = users.find((user) => user.username === username );

    if(!user) {
        return response.status(400).json({error: "Customer not found"})
    }

    request.user = user;

    return next();
    
    }

//cria usuario
app.post('/users', (request, response) => {
  // Complete aqui
    const { username, name} = request.body;
    const id = uuidv4();

    const custumerAlreadyExists = users.some(
        (user) => user.username === username
    );

    if (custumerAlreadyExists){
        console.log('usuario ja existente')
        return response.status(400).json({error: "Essse CPF já tem uma conta cadastrada!!!"})
    }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  };

  users.push(user);

    console.log('conta criada')
    console.log(users);
    return response.status(201).json(user);
});

//lista usuario
app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
    const {user} = request;
    return response.json(user.todos);

});

//cria uma lista todos
app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;
  const { user } = request;

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  user.todos.push(todo);
  return response.status(201).send(todo);
});


app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;
  const { title, deadline } = request.body;
  const {id} = request.params;

  const todo = user.todos.find(todo => todo.id === id);
  if (!todo) {
    response.status(404).json({error: 'Não existe esse todo'})
  }

  todo.title = title;
  todo.deadline = deadline;

    return response.json(todo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;
  const {id} = request.params;

  const todo = user.todos.find(todo => todo.id === id);
  if (!todo) {
    response.status(404).json({error: 'Não existe esse todo'})
  }

  todo.done = true;

    return response.json(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;
  const {id} = request.params;

  const todo = user.todos.findIndex(todo => todo.id === id);
  if (todo === -1) {
    response.status(404).json({error: 'Não é possivel excluir um todo que não exista'})
  }
  user.todos.splice(todo, 1);
  return response.status(204).send();
});

module.exports = app;
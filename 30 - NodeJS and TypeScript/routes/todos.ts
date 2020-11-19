import { Router } from 'express';

import { Todo } from '../models/todo';

type RequestBody = { text: string };
type RequestParams = { todoId: string };

let todos: Array<Todo> = [];

const router = Router();

router.get('/', (req, res, next) => {
  res.status(200).json({ todos: todos });
});

router.post('/todo', (req, res, next) => {
  const body = req.body as RequestBody;

  const newTodo: Todo = {
    id: new Date().toISOString(),
    text: body.text,
  };

  todos.push(newTodo);

  res.status(201).json({
    message: 'Added Todo',
    todo: newTodo,
    todos: todos,
  });
});

router.put('/todo/:todoId', (req, res, next) => {
  const body = req.body as RequestBody;
  const params = req.params as RequestParams;

  const todoText = body.text;
  const todoId = params.todoId;

  const todoIndex = todos.findIndex(todo => todo.id === todoId);

  if (todoIndex >= 0) {
    const todoId = todos[todoIndex].id;
    todos[todoIndex] = { id: todoId, text: todoText };
    return res.status(200).json({ message: 'Updated Todo', todos: todos });
  }

  res.status(404).json({ message: 'Could not find todo for this id.' });
});

router.delete('/todo/:todoId', (req, res, next) => {
  const params = req.params as RequestParams;

  const todoId = params.todoId;
  todos = todos.filter(todo => todo.id !== todoId);

  res.status(200).json({ message: 'Deleted todo', todos: todos });
});

export default router;

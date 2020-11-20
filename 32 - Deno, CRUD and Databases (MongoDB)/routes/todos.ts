import { Router } from 'https://deno.land/x/oak/mod.ts';
import { ObjectId } from 'https://deno.land/x/mongo@v0.13.0/mod.ts';

import { getDb } from '../helpers/db_client.ts';

const router = new Router();

interface Todo {
  id?: string;
  text: string;
}

interface TodoSchema {
  _id: { $oid: string };
  text: string;
}

router.get('/todos', async ctx => {
  const todos = await getDb().collection<TodoSchema>('todos').find(); // {_id: ObjectID(), text: '...'}
  const transformedTodos = todos.map(
    (todo: { _id: ObjectId; text: string }) => {
      return { id: todo._id.$oid, text: todo.text };
    }
  );

  ctx.response.body = { todos: transformedTodos };
});

router.post('/todos', async (ctx: any) => {
  const result = await ctx.request.body();
  const data = await result.value;

  const newTodo: Todo = { text: data.text };

  const id = await getDb().collection<TodoSchema>('todos').insertOne(newTodo);

  newTodo.id = id.$oid;

  ctx.response.body = { message: 'Created todo!', todo: newTodo };
});

router.put('/todos/:todoId', async (ctx: any) => {
  const tid = ctx.params.todoId!;

  const result = await ctx.request.body();
  const data = await result.value;

  await getDb()
    .collection<TodoSchema>('todos')
    .updateOne({ _id: ObjectId(tid) }, { $set: { text: data.text } });

  ctx.response.body = { message: 'Updated todo' };
});

router.delete('/todos/:todoId', async ctx => {
  const tid = ctx.params.todoId!;

  await getDb()
    .collection<TodoSchema>('todos')
    .deleteOne({ _id: ObjectId(tid) });

  ctx.response.body = { message: 'Deleted todo' };
});

export default router;

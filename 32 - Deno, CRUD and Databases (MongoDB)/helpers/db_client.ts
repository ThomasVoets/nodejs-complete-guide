import {
  MongoClient,
  Database,
} from 'https://deno.land/x/mongo@v0.13.0/mod.ts';

let db: Database;

export function connect() {
  const client = new MongoClient();
  client.connectWithUri(
    `mongodb+srv://${Deno.env.get('DB_USER')}:${Deno.env.get(
      'DB_PASSWORD'
    )}@denotodosdb.nwrjr.mongodb.net/?retryWrites=true&w=majority`
  );

  db = client.database('deno-todo-app');
}

export function getDb() {
  return db;
}

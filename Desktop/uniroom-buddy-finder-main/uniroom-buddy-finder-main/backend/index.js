import express from 'express';
import cors from 'cors';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import fs from 'fs';

const app = express();
app.use(cors());
app.use(express.json());

const dbFile = 'db.json';
if (!fs.existsSync(dbFile)) {
  fs.writeFileSync(dbFile, JSON.stringify({ users: [] }, null, 2));
}

// O segundo argumento do Low é o valor padrão
const adapter = new JSONFile(dbFile);
const db = new Low(adapter, { users: [] });
await db.read();

app.get('/api/users', async (req, res) => {
  await db.read();
  res.json(db.data.users);
});

app.post('/api/users', async (req, res) => {
  const user = req.body;
  user.id = Date.now();
  db.data.users.push(user);
  await db.write();
  res.status(201).json(user);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}/api`);
});
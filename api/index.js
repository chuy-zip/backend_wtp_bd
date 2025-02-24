import express from 'express';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Express with vercel!' });
});

app.get('/api/hi', (req, res) => {
  res.json({ message: 'Hi!' });
});

app.get('/api/actionTest', (req, res) => {
  res.json({ message: 'Actions worked!' });
});

export default app;
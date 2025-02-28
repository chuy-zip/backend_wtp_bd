import express from 'express';
import { testConnection, getNodes } from './functions/test.js';
import { createPost , createUser, createComment/*, createTopic, createCountry*/} from './functions/node_creation_functions.js'

const port = 3000

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Express with vercel!' });
});

app.get('/api/hi', (req, res) => {
  res.json({ message: 'Hi!' });
});

app.get('/api/actionTest', async (req, res) => {
  try {
    const result = await getNodes();
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ error: error})
  }
});

app.get('/api/neoTest', async (req, res) => {
  try {
    const result = await testConnection();
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ error: error })
  }
});

// NODE CREATION
// create node post
// por editar
app.post('/api/createPost', async (req, res) => {
  try {
    const {username, text, imagen, hashtags, reposted } = req.body;
    await createPost(username, text, imagen, hashtags, reposted);
    res.status(201).json({ message: 'Post created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register practicamente
app.post('/api/registerUser', async (req, res) => {
  try {
    const { username, password, email, born, first_name, last_name, gender } = req.body;
    await createUser(username, password, email, born, first_name, last_name, gender);
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// comment in a post
app.post('/api/comment', async (req, res) => {
  try {
    const { text, reposted, postId, username, writterIsActive, isPinned, language } = req.body;
    await createComment(text, reposted, postId, username, writterIsActive, isPinned, language)
    res.status(201).json({ message: 'Comment created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://127.0.0.1:${port}`)
})

export default app;
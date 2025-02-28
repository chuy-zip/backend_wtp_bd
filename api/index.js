import express from 'express';
import { testConnection, getNodes } from './functions/test.js';
import { getUserByUsername, getPostsWithLimit, getPostCommentsByID} from './functions/chuy.js';
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

app.get('/api/get-user/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const result = await getUserByUsername(username);

    if (result.status === 'found') {
      res.status(200).json({ message: 'User found', user: result.user });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
});

app.get('/api/get-posts/:posts_limit', async (req, res) => {
  const { posts_limit } = req.params;

  try {
    const result = await getPostsWithLimit(posts_limit);

    if (result.status === 'success') {
      res.status(200).json({ message: 'Found posts', posts: result.posts });
    } else {
      res.status(404).json({ message: 'Posts not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://127.0.0.1:${port}`)
})

export default app;
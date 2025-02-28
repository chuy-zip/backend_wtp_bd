import express from 'express';
import { testConnection, getNodes } from './functions/test.js';
import { createPost , createUser, createComment, /*, createTopic, createCountry*/} from './functions/node_creation_functions.js'


import { getPostCommentsByID, getPostsWithLimit, getUserByUsername, getUniqueCountries, addUserInterest, changeUserCountry } from './functions/chuy.js';


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



app.get('/api/get-user/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const result = await getUserByUsername(username);

    if (result.status === 'found') {
      res.status(200).json({ message: 'User found', user: result.user, country: result.country });
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

app.get('/api/get-comments/:postId', async (req, res) => {
  const { postId } = req.params;

  try {
    const postIdNumber = parseInt(postId, 10);

    const result = await getPostCommentsByID(postIdNumber);

    if (result.status === 'found') {
      res.status(200).json({ message: 'found', comments: result.comments });
    } else {
      res.status(404).json({ message: 'not_found', comments: result.comments });
    }
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
});

app.get('/api/get-countries', async (req, res) => {
  try {
      const result = await getUniqueCountries();

      if (result.status === 'found') {
          res.status(200).json({ message: 'found', countries: result.countries });
      } else {
          res.status(404).json({ message: 'not_found', countries: [] });
      }
  } catch (error) {
      res.status(500).json({ message: 'An error occurred', error: error.message });
  }
});

app.post('/api/add-interest', async (req, res) => {
  const { username, topic } = req.body;

  if (!username || !topic) {
      return res.status(400).json({ message: 'Missing username or topic' });
  }

  try {
      const result = await addUserInterest(username, topic);

      if (result.status === 'success') {
          res.status(200).json(result);
      } else {
          res.status(404).json(result);
      }
  } catch (error) {
      res.status(500).json({ message: 'An error occurred', error: error.message });
  }
});

app.post('/api/change-user-country', async (req, res) => {
  const { user_name, newCountry } = req.body;

  if (!user_name || !newCountry) {
    return res.status(400).json({ message: 'Missing parameters: user_name and newCountry are required' });
  }

  try {
    const result = await changeUserCountry(user_name, newCountry);

    if (result.status === 'success') {
      res.status(200).json({
        message: 'User country updated successfully',
        user: result.user,
        country: result.country2,
      });
    } else {
      res.status(404).json({
        message: 'User not found or country not updated',
      });
    }
  } catch (error) {
    console.error('Error in API:', error);
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://127.0.0.1:${port}`)
})

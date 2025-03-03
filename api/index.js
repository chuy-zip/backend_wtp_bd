import express from 'express';
import { testConnection, getNodes } from './functions/test.js';
import { createPost, createUser, createComment, createTopic, createCountry, connectPostToTopic, likeNode, dislikeNode, followUser, blockUser, createFromRelation, updateUser, deletePostById  } from './functions/node_creation_functions.js'
import cors from 'cors';

import { getPostCommentsByID, getPostsWithLimit, getUserByUsername, getUniqueCountries, addUserInterest, changeUserCountry, searchPostsBySimilarUser, getPostsByUser } from './functions/chuy.js';


const port = 3000

const app = express();
// cors
app.use(cors());

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
    res.status(500).json({ error: error })
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
    const { username, text, imagen, hashtags, reposted } = req.body;
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

// create a topic
app.post('/api/createTopic', async (req, res) => {
  try {
    const { name, description, user_name, source, visibility } = req.body;
    await createTopic(name, description, user_name, source, visibility)
    res.status(201).json({ message: 'Topic created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// connect post to topic*
app.post('/api/postBelongsToTopic', async (req, res) => {
  try {
    const { postId, topicId } = req.body;
    await connectPostToTopic(postId, topicId)
    res.status(201).json({ message: 'Post connected to Topic successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// like y dislike (POSTS Y COMMENTS)*
app.post('/api/likePost', async (req, res) => {
  try {
    const { user_name, nodeId, browser, source } = req.body;
    await likeNode(user_name, nodeId, "Post", browser, source)
    res.status(201).json({ message: 'Post liked successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/dislikePost', async (req, res) => {
  try {
    const { user_name, nodeId, browser, source } = req.body;
    await dislikeNode(user_name, nodeId, "Post", browser, source)
    res.status(201).json({ message: 'Post disliked successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/likeComment', async (req, res) => {
  try {
    const { user_name, nodeId, browser, source } = req.body;
    await likeNode(user_name, nodeId, "Comment", browser, source)
    res.status(201).json({ message: 'Comment liked successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/dislikeComment', async (req, res) => {
  try {
    const { user_name, nodeId, browser, source } = req.body;
    await dislikeNode(user_name, nodeId, "Comment", browser, source)
    res.status(201).json({ message: 'Comment liked successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// follows user -> user*
app.post('/api/follow', async (req, res) => {
  try {
    const { followerUsername, followedUsername, followType } = req.body;
    await followUser(followerUsername, followedUsername, followType)
    res.status(201).json({ message: 'User followed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// bloquear usuario*
app.post('/api/blocked', async (req, res) => {
  try {
    const { blockerUsername, blockedUsername, reason, isPermanent } = req.body;
    await blockUser(blockerUsername, blockedUsername, reason, isPermanent)
    res.status(201).json({ message: 'User followed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// determinar origen de usuario y topic
app.post('/api/userFromCountry', async (req, res) => {
  try {
    const { leftNodeIdentifier, countryName } = req.body;
    await createFromRelation("User", leftNodeIdentifier, countryName)
    res.status(201).json({ message: 'User FROM country relation successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/topicFromCountry', async (req, res) => {
  try {
    const { leftNodeIdentifier, countryName } = req.body;
    await createFromRelation("Topic", leftNodeIdentifier, countryName)
    res.status(201).json({ message: 'Topic FROM country relation successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// editar valores de usuario
app.put('/api/updateUser', async (req, res) => {
  try {
    const { user_name, born, first_name, last_name, gender } = req.body;
    await updateUser(user_name, born, first_name, last_name, gender)
    res.status(201).json({ message: 'Topic FROM country relation successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//eliminar posts
app.delete('api/deletepost/:id', async (req, res) => {
  const { id } = req.params;

  try {
      await deletePostById(id);
      res.status(200).json({ message: `Post con id '${id}' eliminado correctamente.` });
  } catch (error) {
      console.error("Error eliminando el Post:", error);
      res.status(500).json({ error: "Ocurrió un error al eliminar el Post." });
  }
});

// de chuy
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

app.post('/api/createCountry', async (req, res) =>{
  try {
    const { name, description, continent, language, country_code } = req.body;
    await createCountry(name, description, continent, language, country_code)
    res.status(201).json({ message: 'Country created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/get-posts-user/:username', async (req, res) => {
  const { username } = req.params;

  if (!username) {
      return res.status(400).json({ message: 'Missing parameter: username is required' });
  }

  try {
      const result = await getPostsByUser(username);

      if (result.status === 'success') {
          res.status(200).json({
              message: 'Posts found',
              posts: result.posts,
          });
      } else {
          res.status(404).json({
              message: 'No posts found for this user',
              posts: [],
          });
      }
  } catch (error) {
      console.error('Error in API:', error);
      res.status(500).json({ message: 'An error occurred', error: error.message });
  }
});

app.get('/api/search-posts-leven/:username', async (req, res) => {
  const { username } = req.params;

  if (!username) {
      return res.status(400).json({ message: 'Missing parameter: username is required' });
  }

  try {
      const result = await searchPostsBySimilarUser(username);

      if (result.status === 'success') {
          res.status(200).json({
              message: 'Posts found',
              posts: result.posts
          });
      } else {
          res.status(404).json({
              message: 'No posts found',
              posts: []
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

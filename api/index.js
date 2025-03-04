import express from 'express';
import { testConnection, getNodes } from './functions/test.js';
import { createPost, createUser, createComment, createTopic, createCountry, connectPostToTopic, likeNode, dislikeNode, followUser, blockUser, createFromRelation, updateUser, deletePostById, createAdmin, deletePropertiesFromNode, deletePropertiesFromMultipleNodes, deletePropertiesFromAllRelations, deletePropertiesFromRelation  } from './functions/node_creation_functions.js'
import cors from 'cors';

import { getPostCommentsByID, getPostsWithLimit, getUserByUsername, getUniqueCountries, addUserInterest, changeUserCountry, searchPostsBySimilarUser, getPostsByUser, markPostAsBanned, banPostsByTopicName, resetLikesAndDislikesByUser, updateFollowType, updateBlockedReasonIfPermanent} from './functions/chuy.js';


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

app.post('/api/registerAdmin', async (req, res) => {
  try {
    const { username, password, email, born, first_name, last_name, gender } = req.body;
    await createAdmin(username, password, email, born, first_name, last_name, gender);
    res.status(201).json({ message: 'Admin created successfully' });
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

// eliminar 1 o mas atributos de un solo nodo
app.delete("/api/delete-properties-from-node", async (req, res) => {
  const { nodeLabel, nodeKey, keyValue, properties } = req.body;
  if (!nodeLabel || !nodeKey || !keyValue || !properties || !Array.isArray(properties)) {
      return res.status(400).send("Faltan datos o 'properties' no es un array.");
  }

  try {
      await deletePropertiesFromNode(nodeLabel, nodeKey, keyValue, properties);
      res.status(200).send(`Propiedades eliminadas del nodo ${nodeLabel} con ${nodeKey} = '${keyValue}'.`);
  } catch (error) {
      console.error("Error al eliminar propiedades del nodo:", error);
      res.status(500).send("Error al eliminar propiedades del nodo.");
  }
});

//elimina 1 o más propiedades de multiples nodos
app.delete("/api/delete-properties-from-multiple-nodes", async (req, res) => {
  const { nodeLabel, properties } = req.body;

  if (!nodeLabel || !properties || !Array.isArray(properties)) {
      return res.status(400).send("Faltan datos o 'properties' no es un array.");
  }

  try {
      await deletePropertiesFromMultipleNodes(nodeLabel, properties);
      res.status(200).send(`Propiedades eliminadas de todos los nodos ${nodeLabel}.`);
  } catch (error) {
      console.error("Error al eliminar propiedades de múltiples nodos:", error);
      res.status(500).send("Error al eliminar propiedades de múltiples nodos.");
  }
});


// eliminar 1 o más propiedades de 1 relación especifica entre 2 nodos
app.delete('/api/delete-relation-properties-between-nodes', async (req, res) => {
  const {
      node1Type,
      node1IdentifierName,
      node1IdentifierValue,
      node2Type,
      node2IdentifierName,
      node2IdentifierValue,
      relationType,
      propertiesToDelete
  } = req.body;

  try {
      await deletePropertiesFromRelation(
          node1Type,
          node1IdentifierName,
          node1IdentifierValue,
          node2Type,
          node2IdentifierName,
          node2IdentifierValue,
          relationType,
          propertiesToDelete
      );
      res.status(200).send({ message: 'Propiedades eliminadas de la relación.' });
  } catch (error) {
      res.status(500).send({
          error: 'Error eliminando propiedades de la relación.',
          details: error.message
      });
  }
});

// eliminar 1 o más atributos de todas las relaciones llamadas de la misma forma
app.delete('/api/delete-relation-properties', async (req, res) => {
  const { relationType, propertiesToDelete } = req.body;

  try {
      await deletePropertiesFromAllRelations(relationType, propertiesToDelete);
      res.status(200).send({ message: 'Propiedades eliminadas de todas las relaciones.' });
  } catch (error) {
      res.status(500).send({ error: 'Error eliminando propiedades.', details: error.message });
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

  console.log( user_name, newCountry)

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

app.post('/api/mark-post-banned/:postId', async (req, res) => {
  const { postId } = req.params; 

  if (!postId) {
      return res.status(400).json({ message: 'Missing parameter: postId is required' });
  }

  try {
      const result = await markPostAsBanned(postId);

      console.log(postId); // Para depuración
      if (result.status === 'success') {
          res.status(200).json({
              message: 'Post marked as banned successfully',
              post: result.post,
          });
      } else if (result.status === 'post_not_found') {
          res.status(404).json({
              message: 'Post not found',
          });
      }
  } catch (error) {
      console.error('Error in API:', error);
      res.status(500).json({ message: 'An error occurred', error: error.message });
  }
});

app.post('/api/ban-posts-by-topic-name/:topicName', async (req, res) => {
  const { topicName } = req.params;

  if (!topicName) {
      return res.status(400).json({ message: 'Missing parameter: topicName is required' });
  }

  try {
      const result = await banPostsByTopicName(topicName);

      if (result.status === 'success') {
          res.status(200).json({
              message: 'Posts banned successfully',
              bannedPosts: result.bannedPosts,
          });
      } else if (result.status === 'no_posts_found_for_topic') {
          res.status(404).json({
              message: 'No posts found for the specified topic',
          });
      }
  } catch (error) {
      console.error('Error in API:', error);
      res.status(500).json({ message: 'An error occurred', error: error.message });
  }
});

app.post('/api/reset-likes-dislikes-by-user/:username', async (req, res) => {
  const { username } = req.params;

  if (!username) {
      return res.status(400).json({ message: 'Missing parameter: username is required' });
  }

  try {
      const result = await resetLikesAndDislikesByUser(username);

      if (result.status === 'success') {
          res.status(200).json({
              message: 'Likes and dislikes reset successfully',
              updatedPosts: result.updatedPosts,
          });
      } else if (result.status === 'no_posts_found_for_user') {
          res.status(404).json({
              message: 'No posts found for the specified user',
          });
      }
  } catch (error) {
      console.error('Error in API:', error);
      res.status(500).json({ message: 'An error occurred', error: error.message });
  }
});

app.post('/api/update-follow-type', async (req, res) => {
  const { followerUsername, followedUsername, newFollowType } = req.body;

  console.log(followerUsername, followedUsername, newFollowType)
  
  if (!followerUsername || !followedUsername || !newFollowType) {
      return res.status(400).json({ message: 'Missing parameters: followerUsername, followedUsername, and newFollowType are required' });
  }

  try {
      const result = await updateFollowType(followerUsername, followedUsername, newFollowType);

      if (result.status === 'success') {
          res.status(200).json({
              message: 'Follow type updated successfully',
              updatedFollow: result.updatedFollow,
          });
      } else if (result.status === 'follow_relationship_not_found') {
          res.status(404).json({
              message: 'Follow relationship not found between the specified users',
          });
      }
  } catch (error) {
      console.error('Error in API:', error);
      res.status(500).json({ message: 'An error occurred', error: error.message });
  }
});

app.post('/api/update-blocked-reason-if-permanent/:new_reason', async (req, res) => {
  try {
    const { new_reason } = req.params;
      const result = await updateBlockedReasonIfPermanent(new_reason);

      if (result.status === 'success') {
          res.status(200).json({
              message: 'Blocked relationships updated successfully',
              updatedRelationships: result.updatedRelationships,
          });
      } else if (result.status === 'no_blocked_relationships_found') {
          res.status(404).json({
              message: 'No blocked relationships with is_permanent = true found',
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


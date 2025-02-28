import neo4j from 'neo4j-driver';
import getDriver from '../neoDriver.js';

export async function getUserByUsername(username) {
    const driver = getDriver();
    const session = driver.session();

    try {
        // Define the query to find a user by username
        const query = `
        MATCH (u:User {user_name: $username})
        RETURN u;
      `;

        // Execute the query
        const result = await session.run(query, { username });

        // Check if the user was found
        if (result.records.length > 0) {
            const user = result.records[0].get('u').properties;
            console.log('User found:', user);
            return { status: 'found', user };
        } else {
            console.log('User not found.');
            return { status: 'not_found', user: null };
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    } finally {
        await session.close();
    }
}

// Función para convertir números de Neo4j a números normales
function convertNeo4jNumber(value) {
    return neo4j.isInt(value) ? value.toNumber() : value;
}

// Función para convertir todas las propiedades de un nodo
function convertProperties(properties) {
    return Object.fromEntries(
        Object.entries(properties).map(([key, value]) => [key, convertNeo4jNumber(value)])
    );
}

export async function getPostsWithLimit(post_limit) {
    const driver = getDriver();
    const session = driver.session();

    try {
        const query = `
        MATCH (post:Post)
        WITH post, COUNT{(post)<-[:CREATED]-()} AS creator_count
        WHERE creator_count = 1
        MATCH (user:User)-[created:CREATED]->(post)
        RETURN user, created, post
        LIMIT $post_limit;
        `;

        const result = await session.run(query, { post_limit: neo4j.int(post_limit) });

        if (result.records.length > 0) {
            const posts = result.records.map(record => ({
                post: convertProperties(record.get('post').properties),
                author: convertProperties(record.get('user').properties)
            }));

            return { status: 'success', posts };
        } else {
            return { status: 'no_posts_found', posts: null };
        }
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    } finally {
        await session.close();
    }
}

export async function getPostCommentsByID(postId) {
    const driver = getDriver();
    const session = driver.session();

    try {
        const query = `
            MATCH (post:Post {id: $postId})
            OPTIONAL MATCH (post)<-[:BELONGS_TO]-(comment:Comment)<-[:WROTE]-(user:User)
            WHERE COUNT{(comment)<-[:WROTE]-()} < 2 AND COUNT{(comment)-[:BELONGS_TO]->()} < 2
            RETURN comment, user;
        `;

        const result = await session.run(query, { postId });

        // Filtrar registros válidos (donde `comment` no sea null)
        const comments = result.records
            .map(record => ({
                comment: record.get('comment') ? convertProperties(record.get('comment').properties) : null,
                user: record.get('user') ? convertProperties(record.get('user').properties) : null,
            }))
            .filter(entry => entry.comment !== null); // Filtrar los que no tienen comentario

        if (comments.length > 0) {

            return { status: 'found', comments };
        } else {

            return { status: 'not_found', comments: [] };
        }
    } catch (error) {
        console.error('Error fetching comments:', error);
        throw error;
    } finally {
        await session.close();
    }
}

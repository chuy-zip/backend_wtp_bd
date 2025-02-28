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

export async function getPostsWithLimit(post_limit) {
    const driver = getDriver();
    const session = driver.session();

    function convertNeo4jNumber(value) {
        return neo4j.isInt(value) ? value.toNumber() : value;
    }

    function convertProperties(properties) {
        return Object.fromEntries(
            Object.entries(properties).map(([key, value]) => [key, convertNeo4jNumber(value)])
        );
    }

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

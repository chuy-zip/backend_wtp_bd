import neo4j from 'neo4j-driver';
import getDriver from '../neoDriver.js';

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

export async function getUserByUsername(username) {
    const driver = getDriver();
    const session = driver.session();

    try {
        const query = `
        MATCH (u:User {user_name: $username})
        OPTIONAL MATCH (u)-[:FROM]->(country:Country)
        RETURN u, country;
        `;

        const result = await session.run(query, { username });

        if (result.records.length > 0) {
            const user = convertProperties(result.records[0].get('u').properties);
            const countryRecord = result.records[0].get('country');

            const country = countryRecord ? convertProperties(countryRecord.properties) : null;

            console.log('User found:', user, 'Country:', country);
            return { status: 'found', user, country };
        } else {
            console.log('User not found.');
            return { status: 'not_found', user: null, country: null };
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    } finally {
        await session.close();
    }
}


export async function getPostsByUser(username) {
    const driver = getDriver();
    const session = driver.session();

    try {
        const query = `
        MATCH (user:User {user_name: $username})-[created:CREATED]->(post:Post)
        RETURN user, post
        `;

        const result = await session.run(query, { username });

        if (result.records.length > 0) {
            const posts = result.records.map(record => ({
                post: convertProperties(record.get('post').properties),
                author: convertProperties(record.get('user').properties) // Ahora sí existe en el query
            }));

            return { status: 'success', posts };
        } else {
            return { status: 'no_posts_found', posts: [] };
        }
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    } finally {
        await session.close();
    }
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
                author: record.get('user') ? convertProperties(record.get('user').properties) : null,
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

export async function getUniqueCountries() {
    const driver = getDriver();
    const session = driver.session();

    try {
        const query = `
        MATCH (country:Country)
        WITH country.name AS countryName, COLLECT(country)[0] AS uniqueCountry
        RETURN uniqueCountry;
        `;

        const result = await session.run(query);

        if (result.records.length > 0) {
            const countries = result.records.map(record => 
                convertProperties(record.get('uniqueCountry').properties)
            );
            return { status: 'found', countries };
        } else {
            return { status: 'not_found', countries: [] };
        }
    } catch (error) {
        console.error('Error fetching unique countries:', error);
        throw error;
    } finally {
        await session.close();
    }
}


export async function addUserInterest(username, topicName) {
    const driver = getDriver();
    const session = driver.session();

    try {
        const query = `
        MATCH (user:User {user_name: $username}), (topic:Topic {name: $topicName})
        MERGE (user)-[:INTERESTED]->(topic)
        RETURN user, topic;
        `;

        const result = await session.run(query, { username, topicName });

        if (result.records.length > 0) {
            return { status: 'success', message: 'Interest added', user: username, topic: topicName };
        } else {
            return { status: 'error', message: 'User or Topic not found' };
        }
    } catch (error) {
        console.error('Error adding interest:', error);
        return { status: 'error', message: 'An error occurred', error: error.message };
    } finally {
        await session.close();
    }
}

export async function changeUserCountry(username, newCountry) {
    const driver = getDriver();
    const session = driver.session();

    try {
        const query = `
            MATCH (user:User {user_name: $username})
            OPTIONAL MATCH (user)-[old_FROM:FROM]->(oldCountry:Country)
            DELETE old_FROM
            WITH user
            MERGE (newCountry:Country {name: $newCountry})
            MERGE (user)-[:FROM]->(newCountry)
            RETURN user, newCountry;
        `;

        const result = await session.run(query, { username, newCountry });

        if (result.records.length > 0) {
            const user = result.records[0].get('user').properties;
            const country = result.records[0].get('newCountry').properties;
            console.log('User country updated:', user, country);
            return { status: 'success', user, country };
        } else {
            console.log('No user found or country not updated');
            return { status: 'failure', message: 'No user found or country not updated' };
        }
    } catch (error) {
        console.error('Error changing user country:', error);
        throw error;
    } finally {
        await session.close();
    }
}


  export async function searchPostsBySimilarUser(username) {
    const driver = getDriver();
    const session = driver.session();

    try {
        const query = `
        MATCH (user:User)-[:CREATED]->(post:Post)
        WITH user, post, apoc.text.levenshteinSimilarity(user.user_name, $username) AS similarity
        WHERE similarity > 0.5
        RETURN user, post, similarity
        ORDER BY similarity DESC, post.created_at DESC
        LIMIT 20;
        `;

        const result = await session.run(query, { username });

        if (result.records.length > 0) {
            const posts = result.records.map(record => ({
                post: convertProperties(record.get('post').properties),
                author: convertProperties(record.get('user').properties),
                similarity: record.get('similarity') // Para depuración o análisis
            }));

            return { status: 'success', posts };
        } else {
            return { status: 'no_posts_found', posts: [] };
        }
    } catch (error) {
        console.error('Error searching posts:', error);
        throw error;
    } finally {
        await session.close();
    }
}

export async function markPostAsBanned(postId) {
    const driver = getDriver();
    const session = driver.session();
    console.log("again:", postId)
    try {
        const query = `
        MATCH (post:Post {id: $postId})
        SET post.banned = true
        RETURN post
        `;

        const result = await session.run(query, { postId: parseInt(postId) });

        if (result.records.length > 0) {
            const updatedPost = convertProperties(result.records[0].get('post').properties);
            return { status: 'success', post: updatedPost };
        } else {
            return { status: 'post_not_found' };
        }
    } catch (error) {
        console.error('Error marking post as banned:', error);
        throw error;
    } finally {
        await session.close();
    }
}

export async function banPostsByTopicName(topicName) {
    const driver = getDriver();
    const session = driver.session();

    try {
        const query = `
        MATCH (topic:Topic {name: $topicName})<-[:RELATED]-(post:Post)
        SET post.banned = true
        RETURN post
        `;

        const result = await session.run(query, { topicName });

        if (result.records.length > 0) {
            const bannedPosts = result.records.map(record => ({
                post: convertProperties(record.get('post').properties),
            }));

            return { status: 'success', bannedPosts };
        } else {
            return { status: 'no_posts_found_for_topic' };
        }
    } catch (error) {
        console.error('Error banning posts by topic name:', error);
        throw error;
    } finally {
        await session.close();
    }
}

export async function resetLikesAndDislikesByUser(username) {
    const driver = getDriver();
    const session = driver.session();

    try {
        const query = `
        MATCH (user:User {user_name: $username})-[:CREATED]->(post:Post)
        SET post.likes = 0, post.dislikes = 0
        RETURN post
        `;

        const result = await session.run(query, { username });

        if (result.records.length > 0) {
            const updatedPosts = result.records.map(record => ({
                post: convertProperties(record.get('post').properties),
            }));

            return { status: 'success', updatedPosts };
        } else {
            return { status: 'no_posts_found_for_user' };
        }
    } catch (error) {
        console.error('Error resetting likes and dislikes:', error);
        throw error;
    } finally {
        await session.close();
    }
}

export async function updateFollowType(followerUsername, followedUsername, newFollowType) {
    const driver = getDriver();
    const session = driver.session();

    try {
        const query = `
        MATCH (follower:User {user_name: $followerUsername})-[follows:FOLLOWS]->(followed:User {user_name: $followedUsername})
        SET follows.follow_type = $newFollowType
        RETURN follows
        `;

        const result = await session.run(query, { followerUsername, followedUsername, newFollowType });

        if (result.records.length > 0) {
            const updatedFollow = convertProperties(result.records[0].get('follows').properties);
            return { status: 'success', updatedFollow };
        } else {
            return { status: 'follow_relationship_not_found' };
        }
    } catch (error) {
        console.error('Error updating follow type:', error);
        throw error;
    } finally {
        await session.close();
    }
}

export async function updateBlockedReasonIfPermanent(new_reason) {
    const driver = getDriver();
    const session = driver.session();

    try {
        const query = `
        MATCH (user:User)-[blocked:BLOCKED]->(blockedUser:User)
        WHERE blocked.is_permanent = true
        SET blocked.reason = $new_reason
        RETURN blocked
        `;

        const result = await session.run(query, { new_reason });

        if (result.records.length > 0) {
            const updatedRelationships = result.records.map(record => ({
                blocked: convertProperties(record.get('blocked').properties),
            }));

            return { status: 'success', updatedRelationships };
        } else {
            return { status: 'no_blocked_relationships_found' };
        }
    } catch (error) {
        console.error('Error updating blocked relationships:', error);
        throw error;
    } finally {
        await session.close();
    }
}
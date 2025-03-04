import getDriver from '../neoDriver.js';
const driver = getDriver();

export async function createPost(username, text, imagen, hashtags, reposted = false, source = "Web", visibility = "public") {
    const session = driver.session();

    try {
        const idResult = await session.run(
            'MATCH (p:Post) RETURN p.id ORDER BY p.id DESC LIMIT 1'
        );
        
        const highestId = idResult.records.length > 0 ? idResult.records[0].get('p.id').toNumber() : 0;
        const newId = highestId + 1;


        const query = `
            CREATE (p:Post {
                id: $newId, 
                text: $text, 
                imagen: $imagen, 
                likes: 0, 
                dislikes: 0, 
                retweet: $reposted, 
                hashtags: $hashtags
            })
            WITH p
            MATCH (u:User {user_name: $username})
            CREATE (u)-[:CREATED {
                time_stamp: datetime(),
                visibility: $visibility,
                source: $source
            }]->(p)
            RETURN p`;
        
        await session.run(query, { newId, text, imagen, reposted, hashtags, username, visibility, source });
        console.log("Post created successfully with ID:", newId);

    } catch (error) {
        console.error("Error executing query:", error);
    } finally {
        await session.close();
    }
}

export async function createUser(username, password, email, born, first_name, last_name, gender) {
    const query = `
        CREATE (u:User {
            user_name: $username,
            password: $password,
            email: $email,
            born: $born,
            first_name: $first_name,
            last_name: $last_name,
            gender: $gender,
            followers: 0,
            following: 0,
            verified: false
        })
    `;

    const session = driver.session();

    try {
        await session.run(query, { username, password, email, born, first_name, last_name, gender });
        console.log("User created successfully.");
    } catch (error) {
        console.error("Error executing query:", error);
    } finally {
        await session.close();
    }
}


export async function createAdmin(username, password, email, born, first_name, last_name, gender) {
    const query = `
        CREATE (u:User:Admin {
            user_name: $username,
            password: $password,
            email: $email,
            born: $born,
            first_name: $first_name,
            last_name: $last_name,
            gender: $gender,
            followers: 0,
            following: 0,
            verified: false
        })
    `;

    const session = driver.session();

    try {
        await session.run(query, { username, password, email, born, first_name, last_name, gender });
        console.log("User created successfully.");
    } catch (error) {
        console.error("Error executing query:", error);
    } finally {
        await session.close();
    }
}

export async function createComment(text, reposted = false, postId, username, writterIsActive, isPinned = false, language = "english") {
    const session = driver.session();

    try {
        const timeStamp = new Date().toISOString();
        postId = Number(postId);

        writterIsActive = Boolean(writterIsActive); 
        isPinned = Boolean(isPinned);
        language = language ?? "english";

        const idResult = await session.run(
            'MATCH (c:Comment) RETURN c.id ORDER BY c.id DESC LIMIT 1'
        );

        const highestId = idResult.records.length > 0 ? idResult.records[0].get('c.id').toNumber() : 0;
        const newId = highestId + 1;

        const query = `
            MATCH (p:Post {id: $postId}), (u:User {user_name: $username})
            CREATE (c:Comment {
                id: $newId,
                text: $text,
                time_stamp: datetime($timeStamp), 
                likes: 0,
                dislikes: 0,
                retweet: $reposted
            })
            CREATE (c)-[:BELONGS_TO {
                time_stamp: datetime($timeStamp), 
                writter_is_active: $writterIsActive, 
                is_pinned: $isPinned
            }]->(p)
            CREATE (u)-[:WROTE {
                time_stamp: datetime($timeStamp), 
                language: $language, 
                edited: false
            }]->(c)
        `;

        await session.run(query, { text, reposted, postId, username, writterIsActive, isPinned, language, newId, timeStamp });
        console.log("Comment created successfully with relationships.");
    } catch (error) {
        console.error("Error executing query:", error);
    } finally {
        await session.close();
    }
}

export async function createTopic( name, description, user_name, source, visibility) {
    const session = driver.session();

    try {
        const time = new Date()
       
        const idResult = await session.run(
            'MATCH (t:Topic) RETURN t.id ORDER BY t.id DESC LIMIT 1'
        );
        
        const highestId = idResult.records.length > 0 ? idResult.records[0].get('t.id').toNumber() : 0;
        const newId = highestId + 1;

        const query = `
            CREATE (t:Topic {
                id: $newId,
                name: $name,
                description: $description,
                time_creation: datetime(),
                followers: 0,
                ranking: 0
            })
            WITH t
            MATCH (u:User {user_name: $user_name})
            CREATE (u)-[:CREATED {
                time_stamp: datetime(),
                visibility: $visibility,
                source: $source
            }]->(t)
            RETURN t
        `;
        await session.run(query, {newId, name, description, time, user_name, visibility, source });
        console.log("Topic created successfully.");
    } catch (error) {
        console.error("Error executing query:", error);
    } finally {
        await session.close();
    }
}

export async function createCountry(name, description, continent, language, country_code) {

    const label = "Country"

    const session = driver.session();

    try {

        const idResult = await session.run(
            'MATCH (ct:Country) RETURN ct.id ORDER BY ct.id DESC LIMIT 1'
        );
        
        const highestId = idResult.records.length > 0 ? idResult.records[0].get('ct.id').toNumber() : 0;
        const newId = highestId + 1;

        const query = `
        CREATE (ct:${label} {
            name: $name,
            description: $description,
            continent: $continent,
            language: $language,
            country_code: $country_code,
            id: $newId
        })
        `;

        await session.run(query, { name, description, continent, language, country_code, newId });
        console.log("Topic created successfully.");
    } catch (error) {
        console.error("Error executing query:", error);
    } finally {
        await session.close();
    }
}

// TODO: checkear si funciona
export async function connectPostToTopic(postId, topicId) {
    const session = driver.session();

    try {
        postId = Number(postId);
        topicId = Number(topicId);

        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const day = currentDate.getDate();
        const relevance = 0;

        const query = `
            MATCH (p:Post {id: $postId}), (t:Topic {id: $topicId})
            MERGE (p)-[:RELATED {
                year: $year,
                day: $day,
                relevance: $relevance
            }]->(t)
        `;

        await session.run(query, { postId, topicId, year, day, relevance });
        console.log(`Post ${postId} successfully connected to Topic ${topicId}.`);
    } catch (error) {
        console.error("Error creating RELATED relationship:", error);
    } finally {
        await session.close();
    }
}

// TODO: checkear si funciona
export async function likeNode(user_name, nodeId, nodeType, browser, source) {
    const session = driver.session();

    try {
        const timeStamp = new Date();

        if (nodeType !== "Post" && nodeType !== "Comment") {
            throw new Error("Invalid nodeType. Must be 'Post' or 'Comment'.");
        }

        const query = `
            MATCH (u:User {user_name: $user_name}), (n:${nodeType} {id: $nodeId})
            CREATE (u)-[:LIKE {
                time: $timeStamp,
                browser: $browser,
                source: $source
            }]->(n)
            SET n.likes = coalesce(n.likes, 0) + 1
        `;

        await session.run(query, { user_name, nodeId, timeStamp, browser, source });

        console.log(`User ${user_name} liked ${nodeType} ${nodeId} successfully.`);
    } catch (error) {
        console.error("Error creating LIKE relationship:", error);
    } finally {
        await session.close();
    }
}

export async function dislikeNode(user_name, nodeId, nodeType, browser, source) {
    const session = driver.session();

    try {
        const timeStamp = new Date();

        if (nodeType !== "Post" && nodeType !== "Comment") {
            throw new Error("Invalid nodeType. Must be 'Post' or 'Comment'.");
        }

        const query = `
            MATCH (u:User {user_name: $user_name}), (n:${nodeType} {id: $nodeId})
            CREATE (u)-[:DISLIKE {
                time: $timeStamp,
                browser: $browser,
                source: $source
            }]->(n)
            SET n.likes = coalesce(n.likes, 0) + 1
        `;

        await session.run(query, { user_name, nodeId, timeStamp, browser, source });

        console.log(`User ${user_name} disliked ${nodeType} ${nodeId} successfully.`);
    } catch (error) {
        console.error("Error creating LIKE relationship:", error);
    } finally {
        await session.close();
    }
}

// TODO: checkear si funciona
export async function followUser(followerUsername, followedUsername, followType, notifications = true) {
    const session = driver.session();

    try {
        const currentDate = new Date();
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Enero es 0
        const year = currentDate.getFullYear();
        const since = `${day}-${month}-${year}`;

        // Verificar si ya existe la relación FOLLOWS
        const checkQuery = `
            MATCH (follower:User {user_name: $followerUsername})-[r:FOLLOWS]->(followed:User {user_name: $followedUsername})
            RETURN r
        `;

        const checkResult = await session.run(checkQuery, {
            followerUsername,
            followedUsername
        });

        if (checkResult.records.length > 0) {
            console.log(`${followerUsername} ya sigue a ${followedUsername}. No se creó la relación nuevamente.`);
            return;
        }

        const createQuery = `
            MATCH (follower:User {user_name: $followerUsername})
            MATCH (followed:User {user_name: $followedUsername})
            CREATE (follower)-[:FOLLOWS {
                since: $since,
                follow_type: $followType,
                notifications: $notifications
            }]->(followed)
            SET follower.following = coalesce(follower.following, 0) + 1,
                followed.followers = coalesce(followed.followers, 0) + 1
        `;

        await session.run(createQuery, {
            followerUsername,
            followedUsername,
            since,
            followType,
            notifications
        });

        console.log(`${followerUsername} ahora sigue a ${followedUsername}.`);
    } catch (error) {
        console.error("Error creating FOLLOWS relationship:", error);
    } finally {
        await session.close();
    }
}


// TODO: probar si funciona
export async function blockUser(blockerUsername, blockedUsername, reason, isPermanent) {
    const session = driver.session();

    try {
        const timeStamp = new Date();

        const checkQuery = `
            MATCH (blocker:User {user_name: $blockerUsername})-[r:BLOCKED]->(blocked:User {user_name: $blockedUsername})
            RETURN r
        `;

        const checkResult = await session.run(checkQuery, {
            blockerUsername,
            blockedUsername
        });

        if (checkResult.records.length > 0) {
            console.log(`${blockerUsername} ya bloqueó a ${blockedUsername}. No se creó la relación nuevamente.`);
            return; // Salimos si ya existe la relación
        }

        // Crear la relación BLOCKED
        const createQuery = `
            MATCH (blocker:User {user_name: $blockerUsername})
            MATCH (blocked:User {user_name: $blockedUsername})
            CREATE (blocker)-[:BLOCKED {
                time_stamp: $timeStamp,
                reason: $reason,
                is_permanent: $isPermanent
            }]->(blocked)
        `;

        await session.run(createQuery, {
            blockerUsername,
            blockedUsername,
            timeStamp,
            reason,
            isPermanent
        });

        console.log(`${blockerUsername} bloqueó a ${blockedUsername}.`);
    } catch (error) {
        console.error("Error creating BLOCKED relationship:", error);
    } finally {
        await session.close();
    }
}

// TODO: verificar si funciona
export async function createFromRelation(leftNodeType, leftNodeIdentifier, countryName) {
    const session = driver.session();

    try {
        const now = new Date();
        const year = now.getFullYear();
        const day = now.getDate();

        let matchLeftNodeQuery = "";
        let params = { countryName, year, day };

        if (leftNodeType === "User") {
            matchLeftNodeQuery = "MATCH (leftNode:User {user_name: $identifier})";
            params.identifier = leftNodeIdentifier;
        } else if (leftNodeType === "Topic") {
            matchLeftNodeQuery = "MATCH (leftNode:Topic {id: $identifier})";
            params.identifier = Number(leftNodeIdentifier);
        } else {
            console.error("Tipo de nodo no válido. Debe ser 'User' o 'Topic'.");
            return;
        }

        // Verificar si ya existe la relación FROM
        const checkQuery = `
            ${matchLeftNodeQuery}
            MATCH (country:Country {name: $countryName})
            MATCH (leftNode)-[r:FROM]->(country)
            RETURN r
        `;

        const checkResult = await session.run(checkQuery, params);

        if (checkResult.records.length > 0) {
            console.log(`Ya existe una relación FROM entre ${leftNodeType} y el país ${countryName}.`);
            return; // Evita crear duplicados
        }

        // Crear la relación FROM
        const createQuery = `
            ${matchLeftNodeQuery}
            MATCH (country:Country {name: $countryName})
            CREATE (leftNode)-[:FROM {
                leftNodeActive: true,
                year: $year,
                day: $day
            }]->(country)
        `;

        await session.run(createQuery, params);

        console.log(`Relación FROM creada entre ${leftNodeType} y ${countryName}.`);
    } catch (error) {
        console.error("Error creating FROM relationship:", error);
    } finally {
        await session.close();
    }
}

// TODO: función para editar usuario
export async function updateUser(user_name, born, first_name, last_name, gender) {
    const session = driver.session();

    try {
        const query = `
            MATCH (u:User {user_name: $user_name})
            SET u.born = $born,
                u.first_name = $first_name,
                u.last_name = $last_name,
                u.gender = $gender
        `;

        await session.run(query, { user_name, born, first_name, last_name, gender });
        console.log(`Usuario '${user_name}' actualizado correctamente.`);
    } catch (error) {
        console.error("Error updating User:", error);
    } finally {
        await session.close();
    }
}

// TODO: función para eliminar post
export async function deletePostById(postId) {
    const session = driver.session();

    try {
        postId = Number(postId); // Aseguramos que sea número

        const query = `
            MATCH (p:Post {id: $postId})
            DETACH DELETE p
        `;

        await session.run(query, { postId });
        console.log(`Post con id '${postId}' y todas sus relaciones eliminadas.`);
    } catch (error) {
        console.error("Error deleting Post:", error);
    } finally {
        await session.close();
    }
}

export async function deletePropertiesFromNode(nodeLabel, nodeKey, keyValue, properties) {
    const session = driver.session();

    try {
        const removeQuery = properties.map(prop => `REMOVE n.${prop}`).join('\n');

        const query = `
            MATCH (n:${nodeLabel} {${nodeKey}: $keyValue})
            ${removeQuery}
        `;

        await session.run(query, { keyValue });
        console.log(`Propiedades eliminadas del nodo ${nodeLabel} con ${nodeKey} = '${keyValue}'.`);
    } catch (error) {
        console.error("Error al eliminar propiedades del nodo:", error);
    } finally {
        await session.close();
    }
}

export async function deletePropertiesFromMultipleNodes(nodeLabel, properties) {
    const session = driver.session();

    try {
        const removeQuery = properties.map(prop => `REMOVE n.${prop}`).join('\n');

        const query = `
            MATCH (n:${nodeLabel})
            ${removeQuery}
        `;

        await session.run(query);
        console.log(`Propiedades eliminadas de todos los nodos ${nodeLabel}.`);
    } catch (error) {
        console.error("Error al eliminar propiedades de múltiples nodos:", error);
    } finally {
        await session.close();
    }
}

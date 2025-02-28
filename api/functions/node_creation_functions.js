import getDriver from '../neoDriver.js';
/* eslint-disable no-unused-vars */
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

// TODO: modificarlo para crear de una la relacion con el usuario que lo creó
/* export async function createTopic( name, description) {

    const time = new Date()

    const label = "Topic"
    const query = `
        CREATE (t:${label} {
            name: $name,
            description: $description,
            time_creation: $time,
            followers: 0,
            ranking: 0
        })
    `;

    const session = driver.session();

    try {
        await session.run(query, { name, description, time });
        console.log("Topic created successfully.");
    } catch (error) {
        console.error("Error executing query:", error);
    } finally {
        await session.close();
    }
}

export async function createCountry(name, description, continent, language, country_code) {

    const label = "Country"
    const query = `
        CREATE (ct:${label} {
            name: $name,
            description: $description,
            continent: $continent,
            language: $language,
            country_code: $country_code
        })
    `;

    const session = driver.session();

    try {
        await session.run(query, { name, description, continent, language, country_code });
        console.log("Topic created successfully.");
    } catch (error) {
        console.error("Error executing query:", error);
    } finally {
        await session.close();
    }
}*/

// TODO: funcion para relacionar un topic con un post
// TODO: funcion de like y dislikes (tienen que traer el autoincremento de los valores en post/comentario)
// TODO: funcion de followers and following (tienen que traer el autoincremento de los valores en user)

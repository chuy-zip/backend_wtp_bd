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
    const label = "User";
    const query = `
        CREATE (u:${label} {
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


export async function createComment(text, reposted = false, postId) {
    const time = new Date()

    const query = `
        CREATE (c:Comment {
            text: $text,
            time_stamp: $time,
            likes: 0,
            dislikes: 0,
            retweet: $reposted
        })
    `;

    const session = driver.session();

    try {
        await session.run(query, { text, time, reposted });
        console.log("Comment created successfully.");
    } catch (error) {
        console.error("Error executing query:", error);
    } finally {
        await session.close();
    }
}

export async function createTopic( name, description) {
    /**
     * Create a Topic node with specified attributes.
     * 
     * @param {string} name - name of the topic
     * @param {string} description - a text describing what the topic is about
     */

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
    /**
     * Creates a Country node with specified attributes
     * 
     * @param {string} name - name of the topic
     * @param {string} description - a text describing what the topic is about
     * @param {string} continent - the name of the continent where the country is located at.
     * @param {Array<string>} language - A list of languages that are spoke in the country.
     * @param {string} country_code - the country code assigned to the country (ej. Guatemala: 502)
     */

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
}
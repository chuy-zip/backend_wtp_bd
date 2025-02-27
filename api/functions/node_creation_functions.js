import getDriver from '../neoDriver.js';

const driver = getDriver();

export async function createPost(text, imagen, hashtags, reposted = false) {
    /**
     * Creates a Post node with specified attributes.
     *
     * @param {string} text - The content of the post.
     * @param {string} imagen - The image URL associated with the post.
     * @param {Array<string>} hashtags - A list of hashtags associated with the post.
     * @param {boolean} [reposted=false] - Whether the post has been reposted.
     */

    const label = "Post";
    const query = `
        CREATE (p:${label} {
            text: $text,
            imagen: $imagen,
            likes: 0,
            dislikes: 0,
            retweet: $reposted,
            hashtags: $hashtags
        })
    `;

    const session = driver.session();

    try {
        await session.run(query, { text, imagen, reposted, hashtags });
        console.log("Post created successfully.");
    } catch (error) {
        console.error("Error executing query:", error);
    } finally {
        await session.close();
    }
}

export async function createUser(username, password, email, born, first_name, last_name, gender) {
    /**
     * Creates a User node with specified attributes.
     *
     * @param {string} username - The username of the user.
     * @param {string} password - The password of the user.
     * @param {string} email - The email of the user.
     * @param {Date} born - The birthdate of the user. Format: YYYY-MM-DD
     * @param {string} first_name - The first name of the user.
     * @param {string} last_name - The last name of the user.
     * @param {string} gender - The gender of the user (Female, Male, NonBinary, NotSpecified).
     */

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


export async function createComment(text, reposted = false) {
    /**
     * Creates a Comment node with attributes
     * 
     * @param {string} text - The content of the post.
     * @param {boolean} reposted - If the comment is a repost of other comment 
     */

    const time = new Date()

    const label = "Comment"
    const query = `
        CREATE (c:${label} {
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
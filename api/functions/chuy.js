import getDriver from '../neoDriver.js';

const driver = getDriver();

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
  
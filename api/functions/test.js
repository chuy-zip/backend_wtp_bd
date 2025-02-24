import getDriver from '../neoDriver.js';

const driver = getDriver();

export async function testConnection() {
    const session = driver.session();
    try {
        const result = await session.run('MATCH (n) RETURN count(n) AS number');
        return {
            success: true,
            nodeCount: result.records[0].get('number').toNumber() // Convert to JS number
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    } finally {
        await session.close();
    }
}

export async function getNodes() {
    const session = driver.session();
    try {
      const result = await session.run('MATCH (n) RETURN n LIMIT 10');
  
      return result.records.map(record => record.get('n').properties);
    } catch (error) {
      return {
        error: error.message
      };
    } finally {
      await session.close();
    }
  }
  
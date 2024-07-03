import { promisify } from 'util';
import { createClient } from 'redis';

/**
 * Represents a Redis client.
 */
class RedisClient {
  /**
   * Creates a new RedisClient instance.
   */
  constructor() {
    this.client = createClient();
    this.isClientConnected = true;

    // Handle errors
    this.client.on('error', (err) => {
      console.error('Redis client failed to connect:', err.message || err.toString());
      this.isClientConnected = false;
    });

    // Handle successful connection
    this.client.on('connect', () => {
      console.log('Redis client connected successfully');
      this.isClientConnected = true;
    });
  }

  /**
   * Checks if the Redis client is connected.
   * @returns {boolean} True if connected, otherwise false.
   */
  isAlive() {
    return this.isClientConnected;
  }

  /**
   * Retrieves the value associated with the given key from Redis.
   * @param {string} key The key to retrieve.
   * @returns {Promise<string>} The value associated with the key.
   */
  async get(key) {
    // Promisify the get method for asynchronous usage
    const getAsync = promisify(this.client.get).bind(this.client);
    try {
      return await getAsync(key);
    } catch (err) {
      console.error('Error getting key from Redis:', err.message || err.toString());
      return null;
    }
  }

  /**
   * Stores a key-value pair in Redis with an expiration time.
   * @param {string} key The key to store.
   * @param {string|number|boolean} value The value to store.
   * @param {number} duration The expiration time in seconds.
   * @returns {Promise<void>}
   */
  async set(key, value, duration) {
    // Promisify the setex method for asynchronous usage
    const setAsync = promisify(this.client.setex).bind(this.client);
    try {
      await setAsync(key, duration, value);
    } catch (err) {
      console.error('Error setting key in Redis:', err.message || err.toString());
    }
  }

  /**
   * Removes the value associated with the given key from Redis.
   * @param {string} key The key to remove.
   * @returns {Promise<void>}
   */
  async del(key) {
    // Promisify the del method for asynchronous usage
    const delAsync = promisify(this.client.del).bind(this.client);
    try {
      await delAsync(key);
    } catch (err) {
      console.error('Error deleting key from Redis:', err.message || err.toString());
    }
  }
}

// Create and export an instance of RedisClient
export const redisClient = new RedisClient();
export default redisClient;

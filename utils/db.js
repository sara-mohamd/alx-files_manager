// utils/db.js

import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables from a .env file, if present
dotenv.config();

/**
 * Represents a MongoDB client.
 */
class DBClient {
  /**
   * Creates a new DBClient instance.
   */
  constructor() {
    // Set default values if environment variables are not set
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const url = `mongodb://${host}:${port}`;

    // Create a new MongoClient instance
    this.client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Connect to the MongoDB server
    this.client.connect()
      .then(() => {
        console.log('Connected successfully to MongoDB');
        this.db = this.client.db(database);
        this.isClientConnected = true;
      })
      .catch((err) => {
        console.error('Failed to connect to MongoDB:', err.message || err.toString());
        this.isClientConnected = false;
      });
  }

  /**
   * Checks if the MongoDB client is connected.
   * @returns {boolean} True if connected, otherwise false.
   */
  isAlive() {
    return this.isClientConnected;
  }

  /**
   * Retrieves the number of documents in the `users` collection.
   * @returns {Promise<number>} The number of users.
   */
  async nbUsers() {
    if (!this.isAlive()) return 0; // Return 0 if the client is not connected
    try {
      return await this.db.collection('users').countDocuments();
    } catch (err) {
      console.error('Error counting users:', err.message || err.toString());
      return 0;
    }
  }

  /**
   * Retrieves the number of documents in the `files` collection.
   * @returns {Promise<number>} The number of files.
   */
  async nbFiles() {
    if (!this.isAlive()) return 0; // Return 0 if the client is not connected
    try {
      return await this.db.collection('files').countDocuments();
    } catch (err) {
      console.error('Error counting files:', err.message || err.toString());
      return 0;
    }
  }
}

// Create and export an instance of DBClient
export const dbClient = new DBClient();
export default dbClient;

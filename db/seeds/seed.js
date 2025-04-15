import db from '../connection.js';

const seed = async ({ topicData, userData, articleData, commentData }) => {
  // topics table
  await db.query(`DROP TABLE IF EXISTS topics;`);
  await db.query(`
    CREATE TABLE topics (
      slug VARCHAR(255) PRIMARY KEY,
      description VARCHAR(255) NOT NULL,
      img_url VARCHAR(1000) NOT NULL
    );
  `);
  // users table
  await db.query(`DROP TABLE IF EXISTS users;`);
  await db.query(`
    CREATE TABLE users (
      username VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      avatar_url VARCHAR(1000) NOT NULL
    );
  `);
};

export default seed;

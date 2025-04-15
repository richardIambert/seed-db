import db from '../connection.js';

const seed = async ({ topicData, userData, articleData, commentData }) => {
  // drop tables
  await db.query(`DROP TABLE IF EXISTS articles;`);
  await db.query(`DROP TABLE IF EXISTS users;`);
  await db.query(`DROP TABLE IF EXISTS topics;`);
  // topics table
  await db.query(`
    CREATE TABLE topics (
      slug VARCHAR(255) PRIMARY KEY,
      description VARCHAR(255) NOT NULL,
      img_url VARCHAR(1000) NOT NULL
    );
  `);
  // users table
  await db.query(`
    CREATE TABLE users (
      username VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      avatar_url VARCHAR(1000) NOT NULL
    );
  `);
  // articles table
  await db.query(`
    CREATE TABLE articles (
      article_id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      topic VARCHAR(255),
      FOREIGN KEY (topic) REFERENCES topics(slug),
      author VARCHAR(255),
      FOREIGN KEY (author) REFERENCES users(username),
      body TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      votes INT DEFAULT 0,
      article_img_url VARCHAR(1000) NOT NULL
    );
  `);
};

export default seed;

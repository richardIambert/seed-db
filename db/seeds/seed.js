import format from 'pg-format';
import db from '../connection.js';
import { convertTimestampToDate, createTable } from './utils.js';

const seed = async ({ topicData, userData, articleData, commentData }) => {
  // drop tables
  await db.query(`DROP TABLE IF EXISTS comments;`);
  await db.query(`DROP TABLE IF EXISTS articles;`);
  await db.query(`DROP TABLE IF EXISTS users;`);
  await db.query(`DROP TABLE IF EXISTS topics;`);

  // =======================
  // topics
  // =======================

  await createTable(
    `
      CREATE TABLE topics (
        slug VARCHAR(255) PRIMARY KEY,
        description VARCHAR(255) NOT NULL,
        img_url VARCHAR(1000) NOT NULL
      );
    `,
    `
      INSERT INTO topics (slug, description, img_url) 
      VALUES %L;
    `,
    topicData.map(({ slug, description, img_url }) => [slug, description, img_url])
  );

  // =======================
  // users
  // =======================

  await createTable(
    `
      CREATE TABLE users (
        username VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        avatar_url VARCHAR(1000) NOT NULL
      );
    `,
    `
      INSERT INTO users (username, name, avatar_url)
      VALUES %L;
    `,
    userData.map(({ username, name, avatar_url }) => [username, name, avatar_url])
  );

  // =======================
  // articles
  // =======================

  await createTable(
    `
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
    `,
    `
      INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url)
      VALUES %L;
    `,
    articleData.map((article) => {
      const { title, topic, author, body, created_at, votes, article_img_url } =
        convertTimestampToDate(article);
      return [title, topic, author, body, created_at, votes, article_img_url];
    })
  );

  // =======================
  // comments
  // =======================

  await createTable(
    `
      CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        article_id INT,
        FOREIGN KEY (article_id) REFERENCES articles(article_id),
        body TEXT NOT NULL,
        votes INT DEFAULT 0,
        author VARCHAR(255),
        FOREIGN KEY (author) REFERENCES users(username),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
    `
      INSERT INTO comments (article_id, body, votes, author, created_at)
      VALUES %L;
    `,
    await Promise.all(
      commentData.map(async (comment) => {
        const { article_title, body, votes, author, created_at } = convertTimestampToDate(comment);
        const result = await db.query(
          format(`SELECT article_id FROM articles WHERE title = %L`, article_title)
        );
        const article_id = result.rows[0].article_id;
        return [article_id, body, votes, author, created_at];
      })
    )
  );
};

export default seed;

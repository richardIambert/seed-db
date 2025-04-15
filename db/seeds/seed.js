import format from 'pg-format';
import db from '../connection.js';
import { convertTimestampToDate } from './utils.js';

const seed = async ({ topicData, userData, articleData, commentData }) => {
  // drop tables
  await db.query(`DROP TABLE IF EXISTS comments;`);
  await db.query(`DROP TABLE IF EXISTS articles;`);
  await db.query(`DROP TABLE IF EXISTS users;`);
  await db.query(`DROP TABLE IF EXISTS topics;`);

  // =======================
  // topics
  // =======================

  // create table
  await db.query(`
    CREATE TABLE topics (
      slug VARCHAR(255) PRIMARY KEY,
      description VARCHAR(255) NOT NULL,
      img_url VARCHAR(1000) NOT NULL
    );
  `);

  // reshape data
  const topicsRows = topicData.map(({ slug, description, img_url }) => [
    slug,
    description,
    img_url,
  ]);

  // insert data into table
  await db.query(format(`INSERT INTO topics (slug, description, img_url) VALUES %L`, topicsRows));

  // =======================
  // users
  // =======================

  // create table
  await db.query(`
    CREATE TABLE users (
      username VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      avatar_url VARCHAR(1000) NOT NULL
    );
  `);

  // reshape data
  const usersRows = userData.map(({ username, name, avatar_url }) => [username, name, avatar_url]);

  // insert data into table
  await db.query(format(`INSERT INTO users (username, name, avatar_url) VALUES %L`, usersRows));

  // =======================
  // articles
  // =======================

  // create table
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

  // reshape data
  const articlesRows = articleData.map((article) => {
    const { title, topic, author, body, created_at, votes, article_img_url } =
      convertTimestampToDate(article);
    return [title, topic, author, body, created_at, votes, article_img_url];
  });

  // insert data into table
  await db.query(
    format(
      `INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L`,
      articlesRows
    )
  );

  // =======================
  // comments
  // =======================

  // create table
  await db.query(`
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
  `);

  // reshape data
  const commentsRows = await Promise.all(
    commentData.map(async (comment) => {
      const { article_title, body, votes, author, created_at } = convertTimestampToDate(comment);
      const result = await db.query(
        format(`SELECT article_id FROM articles WHERE title = %L`, article_title)
      );
      const article_id = result.rows[0].article_id;
      return [article_id, body, votes, author, created_at];
    })
  );

  // insert data into table
  await db.query(
    format(
      `INSERT INTO comments (article_id, body, votes, author, created_at) VALUES %L`,
      commentsRows
    )
  );
};

export default seed;

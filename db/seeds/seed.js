import db from '../connection.js';

const seed = async ({ topicData, userData, articleData, commentData }) => {
  await db.query(``); //<< write your first query in here.
};

export default seed;

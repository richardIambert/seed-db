import { config } from 'dotenv';
import format from 'pg-format';
import db from '../connection.js';

export const setEnvironment = () => {
  const path = `${process.cwd()}/.env.${process.env.NODE_ENV || 'development'}`;
  config({ path });
};

export const convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

export const createTable = async (createQuery, insertQuery, data) => {
  try {
    await db.query(createQuery);
    await db.query(format(insertQuery, data));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

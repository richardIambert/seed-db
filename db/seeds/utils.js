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

export const createTable = async (tableName, createFields, insertFields, data) => {
  try {
    await db.query(`CREATE TABLE ${tableName} (${createFields.join(',\n')});`);
    await db.query(
      format(`INSERT INTO ${tableName} (${insertFields.join(', ')}) VALUES %L;`, data)
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

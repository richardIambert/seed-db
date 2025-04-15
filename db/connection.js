import pg from 'pg';
import { setEnvironment } from './seeds/utils.js';

setEnvironment();

const db = new pg.Pool();

if (!process.env.PGDATABASE) {
  throw new Error('No PGDATABASE configured');
} else {
  console.log(`Connected to ${process.env.PGDATABASE}`);
}

export default db;

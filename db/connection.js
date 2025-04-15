import { Pool } from 'pg';
import { setEnvironment } from './seeds/utils';

setEnvironment();

const db = new Pool();

if (!process.env.PGDATABASE) {
  throw new Error('No PGDATABASE configured');
} else {
  console.log(`Connected to ${process.env.PGDATABASE}`);
}

export default db;

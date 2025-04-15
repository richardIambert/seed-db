import pg from 'pg';
import { setEnvironment } from './seeds/utils.js';

setEnvironment();

const db = new pg.Pool();

if (!process.env.PGDATABASE) {
  console.error(`No PGDATABASE configured
HINT: Have you setup the required environment variables?
https://github.com/richardIambert/seed-db/tree/main?tab=readme-ov-file#3-setup-environment-variables
  `);
  process.exit(1);
} else {
  console.log(`Connected to ${process.env.PGDATABASE}`);
}

export default db;

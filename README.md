# seed-db 🌱

A database seeding utility for postgres.

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/richardIambert/seed-db.git
cd seed-db
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create `.env.development` and `.env.test` files in the project root directory.

```.env
# .env.development
PGDATABASE=<name_of_your_development_database>
```

```.env
# .env.test
PGDATABASE=<name_of_your_test_database>
```

### 4. Run the utility

Ensure postgres is running and run the following npm scripts:

```bash
npm run setup-dbs
npm run seed-dev
```

### 5. Check tables have been created

You can check that the seed was successful by running `npm run query-test-db` or `npm run query-dev-db` and then viewing `test-db.results.txt` and `dev-db.results.txt` respectively.

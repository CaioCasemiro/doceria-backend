require('dotenv').config({ path: './src/.env' });
const { execSync } = require('child_process');

// garante que DATABASE_URL tá limpo
process.env.DATABASE_URL = process.env.DATABASE_URL?.replace(/\r?\n|\r/g, '');

// executa o Prisma
execSync('npx prisma migrate dev --name init --schema=src/prisma/schema.prisma', { stdio: 'inherit' });

const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

dotenv.config();

if (!process.env.DATABASE_URL) {
    console.error('CRITICAL: DATABASE_URL not found in environment.');
}

const prisma = new PrismaClient();

module.exports = prisma;


const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.$connect()
  .then(() => console.log('CONNECTED!'))
  .catch(e => console.log('Error:', e.message))
  .finally(() => p.$disconnect());

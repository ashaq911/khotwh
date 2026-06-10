const bcrypt = require('bcryptjs');
const fs = require('fs');
const hash = fs.readFileSync('hash.txt', 'utf8').trim();
console.log('Testing hash:', hash);
console.log('Match:', bcrypt.compareSync('password123', hash));

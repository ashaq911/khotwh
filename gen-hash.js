const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('password123', 12);
console.log(hash);
console.log(bcrypt.compareSync('password123', hash));

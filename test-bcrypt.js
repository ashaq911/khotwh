const fs = require('fs');
const bcrypt = require('bcryptjs');

// Test: generate and verify in same process
const hash1 = bcrypt.hashSync('password123', 12);
console.log('Same-process hash:', hash1);
console.log('Same-process verify:', bcrypt.compareSync('password123', hash1));

// Test: read hash from file
const hash2 = fs.readFileSync('hash.txt', 'utf8').trim();
console.log('File hash:', hash2);
console.log('File hash verify:', bcrypt.compareSync('password123', hash2));

// Test: read hash from SQL output (via stdin style)
const TEST_PASS = 'password123';
const testHashes = [
  '$2b$12$9XWMvbHSXDDi.7UrFTTymOiqA8s17P9xx8ivKO/PpzAoJK99EowJG',
  hash1,
  hash2
];
for (const h of testHashes) {
  console.log(`Testing ${h.substring(0, 20)}... => ${bcrypt.compareSync(TEST_PASS, h)}`);
}

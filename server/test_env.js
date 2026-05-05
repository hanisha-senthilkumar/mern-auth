import 'dotenv/config';
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('Length:', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0);

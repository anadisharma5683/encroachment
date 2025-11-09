require('dotenv').config();
const { MongoClient } = require('mongodb');

async function checkUsers() {
  try {
    const uri = process.env.MONGODB_URI || "mongodb+srv://osirisuzu2_db_user:T7QMnuOtXx6wVSTJ@cluster0.wvephzd.mongodb.net/?appName=Cluster0";
    const client = new MongoClient(uri);
    
    await client.connect();
    console.log("Connected to MongoDB");
    
    const db = client.db('encroachment_db');
    const users = await db.collection('users').find({}).toArray();
    
    console.log('Users in database:');
    users.forEach(user => {
      console.log(`- ${user.username}: keyFragment=${user.keyFragment}, password length=${user.password.length}`);
      // Show first 10 characters of encrypted password to confirm it's not plain text
      console.log(`  Encrypted password (first 10 chars): ${user.password.substring(0, 10)}...`);
    });
    
    await client.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkUsers();
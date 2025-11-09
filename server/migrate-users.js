const { MongoClient } = require('mongodb');
const crypto = require('crypto');
require('dotenv').config();

// MongoDB connection
const uri = process.env.MONGODB_URI || "mongodb+srv://osirisuzu2_db_user:T7QMnuOtXx6wVSTJ@cluster0.wvephzd.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri);

// Generate a 4-digit key for password encryption
function generateEncryptionKey() {
  return Math.floor(1000 + Math.random() * 9000).toString(); // Generates a number between 1000-9999
}

// Simple encryption function using the 4-digit key
function encryptPassword(password, key) {
  const algorithm = 'aes-256-cbc';
  const keyBuffer = crypto.scryptSync(key, 'salt', 32);
  const iv = Buffer.alloc(16, 0); // Fixed IV for simplicity
  const cipher = crypto.createCipheriv(algorithm, keyBuffer, iv);
  let encrypted = cipher.update(password, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

async function migrateUsers() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    
    const db = client.db("encroachment_db");
    const usersCollection = db.collection("users");
    
    // Find all users with plain text passwords (those without keyFragment)
    const users = await usersCollection.find({ keyFragment: { $exists: false } }).toArray();
    
    console.log(`Found ${users.length} users to migrate`);
    
    for (const user of users) {
      // Generate a 4-digit encryption key
      const encryptionKey = generateEncryptionKey();
      
      // Encrypt the password using the key
      const encryptedPassword = encryptPassword(user.password, encryptionKey);
      
      // Update the user document
      await usersCollection.updateOne(
        { _id: user._id },
        { 
          $set: { 
            password: encryptedPassword,
            keyFragment: parseInt(encryptionKey)
          }
        }
      );
      
      console.log(`Migrated user: ${user.username}`);
    }
    
    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Migration error:", error);
  } finally {
    await client.close();
  }
}

migrateUsers();
const { MongoClient } = require('mongodb');

// MongoDB connection
const uri = "mongodb+srv://osirisuzu2_db_user:T7QMnuOtXx6wVSTJ@cluster0.wvephzd.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri);

async function seedDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    
    const db = client.db("encroachment_db");
    const usersCollection = db.collection("users");
    
    // Clear existing users
    await usersCollection.deleteMany({});
    console.log("Cleared existing users");
    
    // Create sample users
    const users = [
      {
        username: "admin",
        password: "1", // Using the same password as in the original code for testing
        role: "admin",
        createdAt: new Date()
      },
      {
        username: "employee",
        password: "1", // Using the same password as in the original code for testing
        role: "employee",
        createdAt: new Date()
      },
      {
        username: "citizen",
        password: "1", // Using the same password as in the original code for testing
        role: "citizen",
        createdAt: new Date()
      }
    ];
    
    // Insert users
    const result = await usersCollection.insertMany(users);
    console.log(`${result.insertedCount} users inserted`);
    
    // List all users
    const allUsers = await usersCollection.find({}).toArray();
    console.log("All users in database:");
    console.log(allUsers);
    
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await client.close();
    console.log("Disconnected from MongoDB");
  }
}

seedDatabase();
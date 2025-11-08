import { MongoClient } from 'mongodb';

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    const uri = process.env.MONGODB_URI || "mongodb+srv://osirisuzu2_db_user:T7QMnuOtXx6wVSTJ@cluster0.wvephzd.mongodb.net/?appName=Cluster0";
    const client = new MongoClient(uri);
    await client.connect();
    console.log("Connected to MongoDB");
    cachedDb = client.db("encroachment_db");
    return cachedDb;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const { username, password } = req.body;

    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    // Find user in database
    const user = await usersCollection.findOne({ username: username });

    if (user && user.password === password) {
      // Login successful
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        role: user.role || 'unknown',
        user: { id: user._id, username: user.username, role: user.role }
      });
    } else {
      // Login failed
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
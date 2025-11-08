const http = require('http');
const { MongoClient } = require('mongodb');
const url = require('url');
require('dotenv').config();

// MongoDB connection
const uri = process.env.MONGODB_URI || "mongodb+srv://osirisuzu2_db_user:T7QMnuOtXx6wVSTJ@cluster0.wvephzd.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri);

let db;
let usersCollection;

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    db = client.db("encroachment_db"); // Database name
    usersCollection = db.collection("users"); // Collection name
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// Connect to database when server starts
connectToDatabase();

// Helper function to parse JSON body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
  });
}

// Helper function to send JSON response
function sendJsonResponse(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*', // CORS
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

// Handle login
async function handleLogin(req, res) {
  try {
    const { username, password } = await parseBody(req);
    
    // Find user in database
    const user = await usersCollection.findOne({ username: username });
    
    if (user && user.password === password) {
      // Login successful
      sendJsonResponse(res, 200, { 
        success: true, 
        message: 'Login successful',
        role: user.role || 'unknown',
        user: { id: user._id, username: user.username, role: user.role }
      });
    } else {
      // Login failed
      sendJsonResponse(res, 401, { 
        success: false, 
        message: 'Invalid username or password' 
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    sendJsonResponse(res, 500, { 
      success: false, 
      message: 'Internal server error' 
    });
  }
}

// Handle registration
async function handleRegister(req, res) {
  try {
    const { username, password, role } = await parseBody(req);
    
    // Check if user already exists
    const existingUser = await usersCollection.findOne({ username: username });
    
    if (existingUser) {
      return sendJsonResponse(res, 400, { 
        success: false, 
        message: 'Username already exists' 
      });
    }
    
    // Create new user
    const newUser = {
      username: username,
      password: password, // In production, this should be hashed
      role: role || 'citizen', // Default role
      createdAt: new Date()
    };
    
    const result = await usersCollection.insertOne(newUser);
    
    sendJsonResponse(res, 201, { 
      success: true, 
      message: 'User registered successfully',
      userId: result.insertedId
    });
  } catch (error) {
    console.error("Registration error:", error);
    sendJsonResponse(res, 500, { 
      success: false, 
      message: 'Internal server error' 
    });
  }
}

// Handle health check
function handleHealthCheck(req, res) {
  sendJsonResponse(res, 200, { status: 'OK', message: 'Server is running' });
}

// Main request handler
async function requestHandler(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  // Handle preflight requests
  if (method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  // Route handling
  if (path === '/api/login' && method === 'POST') {
    await handleLogin(req, res);
  } else if (path === '/api/register' && method === 'POST') {
    await handleRegister(req, res);
  } else if (path === '/api/health' && method === 'GET') {
    handleHealthCheck(req, res);
  } else {
    // 404 Not Found
    sendJsonResponse(res, 404, { 
      success: false, 
      message: 'Route not found' 
    });
  }
}

// Create and start server
const PORT = process.env.PORT || 5001;
const server = http.createServer(requestHandler);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await client.close();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
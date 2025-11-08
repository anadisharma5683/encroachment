const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testLoginNewUser() {
  try {
    const response = await fetch('http://localhost:5003/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testuser2',
        password: 'testpass2',
      }),
    });

    const data = await response.json();
    console.log('Login Response:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

testLoginNewUser();
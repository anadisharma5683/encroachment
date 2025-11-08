const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testRegister() {
  try {
    const response = await fetch('http://localhost:5003/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testuser2',
        password: 'testpass2',
        role: 'citizen',
      }),
    });

    const data = await response.json();
    console.log('Registration Response:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

testRegister();
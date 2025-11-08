const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testNewRegistration() {
  try {
    const response = await fetch('http://localhost:5005/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'newuser',
        password: 'newpass123',
        role: 'citizen',
      }),
    });

    const data = await response.json();
    console.log('Registration Response:', data);
    
    if (data.success) {
      console.log('Now testing login with new user...');
      
      const loginResponse = await fetch('http://localhost:5005/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'newuser',
          password: 'newpass123',
        }),
      });
      
      const loginData = await loginResponse.json();
      console.log('Login Response:', loginData);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testNewRegistration();
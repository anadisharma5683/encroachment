const fetch = require('node-fetch');

async function testNewUserRegistration() {
  try {
    console.log('Testing new user registration with encryption...');
    
    const response = await fetch('http://localhost:5005/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testuser_encryption',
        password: 'securepassword123',
        role: 'citizen'
      }),
    });

    const data = await response.json();
    console.log('Registration response:', data);
    
    if (data.success) {
      console.log('✅ New user registration successful with encryption!');
      console.log('User ID:', data.userId);
    } else {
      console.log('❌ Registration failed:', data.message);
    }
  } catch (error) {
    console.error('Error during registration test:', error);
  }
}

testNewUserRegistration();
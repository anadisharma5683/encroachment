// Test function to verify login API integration
export async function testLoginAPI() {
  try {
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin',
        password: '1',
      }),
    });

    const data = await response.json();
    console.log('Login API Response:', data);
    return data;
  } catch (error) {
    console.error('Login API Error:', error);
    return { success: false, message: 'API connection failed' };
  }
}
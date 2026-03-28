const axios = require('axios');

async function testApiLockout() {
  const email = 'verify-api-lockout@test.com';
  const password = 'wrongpassword';
  const baseUrl = 'http://localhost:3000/api/auth';

  try {
    // 1. Register a test user if doesn't exist (ignoring 400 if exists)
    try {
      await axios.post(`${baseUrl}/register`, {
        email,
        password: 'correctpassword',
        name: 'API Lockout Test'
      });
      console.log('Test user registered');
    } catch (e) {
      if (e.response?.status === 400) {
        console.log('Test user already exists');
      } else {
        throw e;
      }
    }

    // 2. Try to login 6 times with wrong password
    for (let i = 1; i <= 6; i++) {
        console.log(`\nAttempt ${i}:`);
        try {
            const res = await axios.post(`${baseUrl}/login`, { email, password });
            console.log('Login success (Unexpected!)');
        } catch (e) {
            console.log(`Status: ${e.response?.status}`);
            console.log(`Message: ${e.response?.data?.message}`);
        }
    }
  } catch (err) {
    console.error('Test error:', err.message);
  }
}

testApiLockout();

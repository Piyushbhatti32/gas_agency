import fetch from 'node-fetch';

async function testLogin(email, password) {
  try {
    console.log(`Testing login for ${email}...`);
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log('Response:', data);
    return { success: response.ok, data };
  } catch (error) {
    console.error('Error:', error);
    return { success: false, error };
  }
}

async function runTests() {
  const testCases = [
    { email: 'admin@test.com', password: 'admin123' },
    { email: 'agency@test.com', password: 'agency123' },
    { email: 'user1@test.com', password: 'user123' },
    { email: 'user2@test.com', password: 'user123' },
  ];

  for (const testCase of testCases) {
    console.log('\n-----------------------------------');
    const result = await testLogin(testCase.email, testCase.password);
    if (!result.success) {
      console.log(`❌ Login failed for ${testCase.email}`);
    } else {
      console.log(`✅ Login successful for ${testCase.email}`);
    }
  }
}

runTests();

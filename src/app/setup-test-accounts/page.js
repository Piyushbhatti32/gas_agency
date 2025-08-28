'use client';
import { useState } from 'react';

export default function TestAccounts() {
  const [result, setResult] = useState(null);
  const [loginTest, setLoginTest] = useState(null);

  async function createAccounts() {
    try {
      const response = await fetch('/api/init-accounts', { method: 'POST' });
      const data = await response.json();
      setResult(data);
      
      // Test each account login
      const accounts = [
        { email: 'admin@test.com', password: 'admin123', type: 'Admin' },
        { email: 'agency@test.com', password: 'agency123', type: 'Agency' },
        { email: 'user@test.com', password: 'user123', type: 'User' }
      ];

      const loginResults = await Promise.all(
        accounts.map(async (account) => {
          const loginResponse = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: account.email,
              password: account.password
            })
          });
          const loginData = await loginResponse.json();
          return {
            type: account.type,
            success: !loginData.error,
            response: loginData
          };
        })
      );

      setLoginTest(loginResults);
    } catch (error) {
      setResult({ error: error.message });
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Accounts Setup</h1>
      
      <button
        onClick={createAccounts}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Create Test Accounts
      </button>

      {result && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Creation Result:</h2>
          <pre className="bg-gray-100 p-4 rounded mt-2 whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      {loginTest && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Login Tests:</h2>
          {loginTest.map((test, index) => (
            <div key={index} className="mt-2">
              <h3 className="font-bold">{test.type} Login:</h3>
              <pre className="bg-gray-100 p-4 rounded mt-1 whitespace-pre-wrap">
                {JSON.stringify(test.response, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

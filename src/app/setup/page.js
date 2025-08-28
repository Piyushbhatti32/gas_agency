'use client';
import { useState } from 'react';

export default function SetupAccounts() {
    const [result, setResult] = useState(null);
    const [verificationResult, setVerificationResult] = useState(null);

    async function setupAccounts() {
        try {
            // Create accounts
            const createResponse = await fetch('/api/setup-accounts', {
                method: 'POST'
            });
            const createData = await createResponse.json();
            setResult(createData);

            // Verify agency data
            const verifyResponse = await fetch('/api/debug/check-agency-data');
            const verifyData = await verifyResponse.json();
            setVerificationResult(verifyData);

        } catch (error) {
            setResult({
                success: false,
                error: error.message
            });
        }
    }

    async function testLogin(email, password) {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            return await response.json();
        } catch (error) {
            return { error: error.message };
        }
    }

    async function verifyLogins() {
        const logins = [
            { email: 'admin@test.com', password: 'admin123', type: 'Admin' },
            { email: 'agency@test.com', password: 'agency123', type: 'Agency' },
            { email: 'user@test.com', password: 'user123', type: 'User' }
        ];

        const results = await Promise.all(
            logins.map(async (login) => {
                const result = await testLogin(login.email, login.password);
                return {
                    type: login.type,
                    ...result
                };
            })
        );

        setVerificationResult((prev) => ({
            ...prev,
            loginTests: results
        }));
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Test Account Setup</h1>
            
            <div className="space-x-4">
                <button
                    onClick={setupAccounts}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Setup Test Accounts
                </button>
                
                <button
                    onClick={verifyLogins}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    Test Logins
                </button>
            </div>

            {result && (
                <div className="mt-6">
                    <h2 className="text-xl font-bold">Setup Result:</h2>
                    <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                </div>
            )}

            {verificationResult && (
                <div className="mt-6">
                    <h2 className="text-xl font-bold">Verification Result:</h2>
                    <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto">
                        {JSON.stringify(verificationResult, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}

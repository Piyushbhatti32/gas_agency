'use client';
import { useEffect, useState } from 'react';

export default function TestLogin() {
    const [result, setResult] = useState('');

    useEffect(() => {
        async function testLogin() {
            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: 'agency@test.com',
                        password: 'agency123'
                    })
                });
                const data = await response.json();
                setResult(JSON.stringify(data, null, 2));
            } catch (error) {
                setResult('Error: ' + error.message);
            }
        }
        testLogin();
    }, []);

    return (
        <div>
            <h2>Test Login</h2>
            <div>{result}</div>
        </div>
    );
}

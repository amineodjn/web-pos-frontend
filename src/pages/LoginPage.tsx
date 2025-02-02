import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../hooks/useApi';

const LoginPage = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-800 via-gray-700 to-gray-900">
            <div className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-500 p-8 rounded-3xl shadow-xl w-96">
                <h1 className="text-3xl font-semibold text-center text-gray-900 mb-8">Welcome Back</h1>
                <form className="space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label className="block text-sm font-medium text-gray-900">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-2 p-3 w-full border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-900">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-2 p-3 w-full border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    <button type="submit" className="w-full mt-6 py-3 bg-gray-800 text-white rounded-lg text-lg font-medium hover:bg-gray-700 focus:outline-none">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;

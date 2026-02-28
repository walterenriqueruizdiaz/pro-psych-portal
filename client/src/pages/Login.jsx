import React from 'react';

const Login = () => {
    const handleGoogleLogin = () => {
        // Redirect to backend Google Auth endpoint using relative path
        window.location.href = '/api/auth/google';
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">Pro Therapists Portal</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Gestión profesional para terapeutas
                    </p>
                </div>
                <div className="mt-8 space-y-6">
                    <button
                        onClick={handleGoogleLogin}
                        className="group relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <span className="absolute left-0 facebook flex items-center pl-3">
                            {/* Icon placeholder */}
                        </span>
                        Ingresar con Google
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;

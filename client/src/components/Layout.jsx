import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-1 pt-16 px-4 lg:px-8 max-w-7xl mx-auto w-full py-8">
                {children}
            </main>
            <footer className="py-6 text-center text-sm text-gray-500 border-t border-gray-200">
                &copy; {new Date().getFullYear()} Pro Therapists Portal. All rights reserved.
            </footer>
        </div>
    );
};

export default Layout;

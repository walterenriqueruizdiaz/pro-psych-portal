import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Menu, X, LayoutDashboard, Users, Calendar, ClipboardList,
    LogOut, User as UserIcon, Shield
} from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => setIsOpen(!isOpen);

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Pacientes', path: '/patients', icon: Users },
        { name: 'Agenda', path: '/appointments', icon: Calendar },
        { name: 'Sesiones', path: '/sessions', icon: ClipboardList },
    ];

    if (user?.role === 'ADMIN') {
        navItems.push({ name: 'Administración', path: '/admin', icon: Shield });
    }

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <>
            {/* Top Navbar */}
            <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center justify-between px-4 lg:px-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleMenu}
                        className="p-2 rounded-lg hover:bg-gray-100 lg:hidden transition-colors"
                    >
                        <Menu className="w-6 h-6 text-gray-600" />
                    </button>
                    <span className="text-xl font-bold text-indigo-600 tracking-tight">Pro Therapists Portal</span>
                </div>

                <div className="hidden lg:flex items-center gap-6">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-2 text-sm font-medium transition-colors ${isActive ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'
                                }`
                            }
                        >
                            <item.icon className="w-4 h-4" />
                            {item.name}
                        </NavLink>
                    ))}
                    <div className="h-6 w-px bg-gray-200 mx-2" />
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Salir
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <span className="hidden sm:inline text-sm font-medium text-gray-700">
                        {user?.firstName} {user?.lastName}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-indigo-600" />
                    </div>
                </div>
            </nav>

            {/* Mobile Drawer Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[60] lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={toggleMenu}
                />
            )}

            {/* Mobile Drawer */}
            <aside className={`
        fixed top-0 left-0 bottom-0 w-72 bg-white z-[70] transform transition-transform duration-300 ease-in-out lg:hidden
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <div className="p-6 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-8">
                        <span className="text-xl font-bold text-indigo-600">Pro Psych Portal</span>
                        <button onClick={toggleMenu} className="p-2 rounded-lg hover:bg-gray-100">
                            <X className="w-6 h-6 text-gray-600" />
                        </button>
                    </div>

                    <div className="flex-1 space-y-2">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={toggleMenu}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-all ${isActive
                                        ? 'bg-indigo-50 text-indigo-600'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
                                    }`
                                }
                            >
                                <item.icon className="w-5 h-5" />
                                {item.name}
                            </NavLink>
                        ))}
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 p-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all mt-auto"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Navbar;

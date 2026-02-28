import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Shield, UserCheck, UserX, Search } from 'lucide-react';

const AdminDashboard = () => {
    const [professionals, setProfessionals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProfessionals();
    }, []);

    const fetchProfessionals = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/professionals');
            setProfessionals(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching professionals:', err);
            setError('No se pudieron cargar los profesionales. Verifica tus permisos.');
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (id) => {
        try {
            await api.patch(`/admin/professionals/${id}/toggle-status`);
            // Update local state
            setProfessionals(prev => prev.map(p =>
                p.id === id ? { ...p, isActive: !p.isActive } : p
            ));
        } catch (err) {
            alert(err.response?.data?.message || 'Error al cambiar el estado');
        }
    };

    const filteredProfessionals = professionals.filter(p =>
        `${p.firstName} ${p.lastName} ${p.email}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && professionals.length === 0) return <div className="p-8 text-center">Cargando profesionales...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Shield className="text-indigo-600" />
                    Administración de Usuarios
                </h1>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 text-red-700">
                    {error}
                </div>
            )}

            {/* Search Bar */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                    type="text"
                    placeholder="Buscar por nombre o email..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profesional</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredProfessionals.map((prof) => (
                            <tr key={prof.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-medium text-gray-900">{prof.firstName} {prof.lastName}</div>
                                    <div className="text-sm text-gray-500">M.P. {prof.professionalLicenseNumber || 'N/A'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {prof.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${prof.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                        }`}>
                                        {prof.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${prof.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {prof.isActive ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => toggleStatus(prof.id)}
                                        className={`flex items-center gap-1 ml-auto ${prof.isActive
                                                ? 'text-red-600 hover:text-red-900'
                                                : 'text-green-600 hover:text-green-900'
                                            }`}
                                    >
                                        {prof.isActive ? (
                                            <><UserX size={16} /> Desactivar</>
                                        ) : (
                                            <><UserCheck size={16} /> Activar</>
                                        )}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredProfessionals.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        No se encontraron profesionales.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;

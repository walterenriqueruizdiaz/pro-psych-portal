import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Search, Edit2, Trash2, ClipboardList, User } from 'lucide-react';

const SessionList = () => {
    const [sessions, setSessions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            setLoading(true);
            const res = await api.get('/sessions');
            setSessions(res.data);
        } catch (err) {
            console.error("Error fetching sessions", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar esta sesión?")) return;
        try {
            await api.delete(`/sessions/${id}`);
            setSessions(sessions.filter(s => s.id !== id));
        } catch (err) {
            console.error("Error deleting session", err);
            alert("Error al eliminar la sesión");
        }
    };

    const filteredSessions = sessions.filter(session =>
        session.patient?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.patient?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.notes?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sessionTypeLabels = {
        'EVALUATION': 'Evaluación',
        'INTERVENTION': 'Intervención',
        'PARENTS_MEETING': 'Reunión con Padres'
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Sesiones guardadas</h1>
                <Link to="/appointments" className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-indigo-700 text-sm font-medium transition-colors">
                    <ClipboardList className="w-4 h-4 mr-2" />
                    Ver agenda
                </Link>
            </div>

            <div className="mb-6 relative">
                <input
                    type="text"
                    placeholder="Buscar por nombre del paciente o notas..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>

            {loading ? (
                <div className="text-center py-10 text-gray-500">Cargando sesiones...</div>
            ) : (
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Paciente</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipo</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Notas</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {filteredSessions.map(session => (
                                    <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                                                    <User className="w-4 h-4 text-indigo-600" />
                                                </div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {session.patient?.firstName} {session.patient?.lastName}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {format(new Date(session.date), 'PP', { locale: es })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${session.sessionType === 'EVALUATION' ? 'bg-purple-100 text-purple-700' :
                                                session.sessionType === 'PARENTS_MEETING' ? 'bg-orange-100 text-orange-700' :
                                                    'bg-green-100 text-green-700'
                                                }`}>
                                                {sessionTypeLabels[session.sessionType] || session.sessionType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                            {session.notes}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => navigate(`/sessions/${session.id}/edit`)}
                                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(session.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredSessions.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                                            No se encontraron sesiones.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SessionList;

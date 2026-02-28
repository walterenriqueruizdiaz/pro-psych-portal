import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Plus, User, Trash2, Users } from 'lucide-react';

const PatientList = () => {
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchPatients();
    }, [searchTerm]);

    const fetchPatients = async () => {
        try {
            const res = await api.get(`/patients?search=${searchTerm}`);
            setPatients(res.data);
        } catch (err) {
            console.error("Error fetching patients", err);
        }
    };

    const handleDelete = async (e, id) => {
        e.preventDefault(); // Prevent navigating to detail
        e.stopPropagation();

        if (!window.confirm("¿Está seguro de que desea eliminar este paciente?")) return;

        try {
            await api.delete(`/patients/${id}`);
            setPatients(patients.filter(p => p.id !== id));
        } catch (err) {
            console.error("Error deleting patient", err);
            const msg = err.response?.data?.message || "Error al eliminar el paciente";
            alert(msg);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Pacientes</h1>
                <Link to="/patients/new" className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-indigo-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Paciente
                </Link>
            </div>

            <div className="mb-6 relative">
                <input
                    type="text"
                    placeholder="Buscar por nombre o DNI..."
                    className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>

            <div className="bg-white shadow overflow-hidden rounded-md">
                <ul className="divide-y divide-gray-200">
                    {patients.map(patient => (
                        <li key={patient.id} className="hover:bg-gray-50">
                            <div
                                onClick={() => navigate(`/patients/${patient.id}`)}
                                className="block p-4 sm:px-6 cursor-pointer"
                            >
                                {/* Fila principal: avatar + info del paciente */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center min-w-0">
                                        <div className="flex-shrink-0 bg-indigo-100 rounded-full p-2">
                                            <User className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <div className="ml-3 min-w-0">
                                            <div className="text-sm font-medium text-indigo-600 truncate">
                                                {patient.firstName} {patient.lastName}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                DNI: {patient.dni}
                                            </div>
                                        </div>
                                    </div>
                                    {/* Botones visibles en pantallas medianas y grandes */}
                                    <div className="hidden sm:flex items-center gap-4 flex-shrink-0 ml-4">
                                        <div className="text-sm text-gray-500">
                                            {patient.mobilePhone}
                                        </div>
                                        <Link
                                            to={`/patients/${patient.id}/contacts`}
                                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                            title="Ver Contactos"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Users className="w-5 h-5" />
                                        </Link>
                                        <button
                                            onClick={(e) => handleDelete(e, patient.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Eliminar Paciente"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                                {/* Segunda fila: teléfono y botones solo en móvil */}
                                <div className="flex sm:hidden items-center justify-between mt-2 pl-11">
                                    <span className="text-sm text-gray-500">{patient.mobilePhone}</span>
                                    <div className="flex items-center gap-2">
                                        <Link
                                            to={`/patients/${patient.id}/contacts`}
                                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                            title="Ver Contactos"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Users className="w-5 h-5" />
                                        </Link>
                                        <button
                                            onClick={(e) => handleDelete(e, patient.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Eliminar Paciente"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                    {patients.length === 0 && (
                        <li className="p-4 text-center text-gray-500">No se encontraron pacientes.</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default PatientList;

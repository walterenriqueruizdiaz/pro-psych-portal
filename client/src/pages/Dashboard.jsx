import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const Dashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [summary, setSummary] = useState({ total: 0, completed: 0, cancelled: 0 });

    useEffect(() => {
        // Fetch dashboard data
        const fetchData = async () => {
            try {
                const apptsRes = await api.get('/appointments?today=true');
                // console.log(apptsRes.data);
                const statsRes = await api.get('/appointments/stats');
                setAppointments(apptsRes.data);
                setSummary(statsRes.data);
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <header className="mb-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <div className="flex space-x-4">
                    <Link to="/patients/new" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Crear Paciente</Link>
                    <Link to="/appointments" className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50">Ver Agenda</Link>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Today's Appointments */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Turnos de hoy</h2>
                    {appointments.length === 0 ? (
                        <p className="text-gray-500">No hay turnos para hoy.</p>
                    ) : (
                        <ul className="space-y-3">
                            {appointments.map(appt => (
                                <li key={appt.id} className="border-b pb-2">
                                    <div className="font-medium">
                                        {format(new Date(appt.dateTime), 'HH:mm', { locale: es })} - {appt.patient?.firstName} {appt.patient?.lastName}
                                    </div>
                                    <div className="text-sm text-gray-500">{appt.status}</div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Weekly Summary */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Esta semana</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded">
                            <div className="text-2xl font-bold text-blue-700">{appointments.length}</div>
                            <div className="text-sm text-blue-600">Total turnos</div>
                        </div>
                        <div className="bg-green-50 p-4 rounded">
                            <div className="text-2xl font-bold text-green-700">{summary.completed}</div>
                            <div className="text-sm text-green-600">Sesiones realizadas</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

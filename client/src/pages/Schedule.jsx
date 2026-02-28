import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { format, startOfWeek, addDays, addWeeks, subWeeks, isSameDay, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus, Edit2, Trash2, MessageCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useIsMobile from '../hooks/useIsMobile';

const Schedule = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [appointments, setAppointments] = useState([]);
    const navigate = useNavigate();
    const { user } = useAuth();
    const isMobile = useIsMobile();

    const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i));

    // If mobile, show only current date. If desktop, show full week.
    const daysToShow = isMobile ? [currentDate] : weekDays;

    const fetchAppointments = async () => {
        try {
            const dateStr = currentDate.toISOString();
            const res = await api.get(`/appointments/week?date=${dateStr}`);
            setAppointments(res.data);
        } catch (err) {
            console.error("Error fetching schedule", err);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [currentDate]);

    const prevPeriod = () => {
        if (isMobile) {
            setCurrentDate(subDays(currentDate, 1));
        } else {
            setCurrentDate(subWeeks(currentDate, 1));
        }
    };

    const nextPeriod = () => {
        if (isMobile) {
            setCurrentDate(addDays(currentDate, 1));
        } else {
            setCurrentDate(addWeeks(currentDate, 1));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar este turno?")) return;
        try {
            await api.delete(`/appointments/${id}`);
            fetchAppointments(); // Refresh
        } catch (err) {
            console.error("Error deleting appointment", err);
            alert("Error al eliminar el turno");
        }
    };

    const createWhatsAppLink = (appt) => {
        if (!appt.patient?.mobilePhone) return null;

        const phone = appt.patient.mobilePhone.replace(/\D/g, ''); // Sanitize
        const date = format(new Date(appt.dateTime), 'dd/MM', { locale: es });
        const time = format(new Date(appt.dateTime), 'HH:mm');
        const professionalName = user ? `${user.firstName} ${user.lastName}` : 'tu profesional';

        const message = `Hola ${appt.patient.firstName}, te recuerdo tu turno el ${date} a las ${time} hs con ${professionalName}.`;
        const encodedMessage = encodeURIComponent(message);

        return `https://wa.me/${phone}?text=${encodedMessage}`;
    };

    return (
        <div className="p-6 h-screen flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-4">
                    <button onClick={prevPeriod} className="p-1 rounded hover:bg-gray-200"><ChevronLeft /></button>
                    <h2 className="text-xl font-bold">
                        {isMobile
                            ? format(currentDate, 'd MMM, yyyy', { locale: es })
                            : `${format(startOfCurrentWeek, 'd MMM', { locale: es })} - ${format(weekDays[6], 'd MMM, yyyy', { locale: es })}`
                        }
                    </h2>
                    <button onClick={nextPeriod} className="p-1 rounded hover:bg-gray-200"><ChevronRight /></button>
                </div>
                <Link to="/appointments/new" className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-indigo-700">
                    <Plus className="w-4 h-4 mr-2" /> Nuevo Turno
                </Link>
            </div>

            <div className={`flex-1 grid ${isMobile ? 'grid-cols-1' : 'grid-cols-7'} border border-gray-200 rounded-lg overflow-hidden`}>
                {daysToShow.map(day => (
                    <div key={day.toString()} className="border-r last:border-r-0 border-gray-200 flex flex-col">
                        <div className="bg-gray-50 p-2 text-center border-b font-medium">
                            {format(day, 'd EEE', { locale: es })}
                        </div>
                        <div className="flex-1 p-2 space-y-2 bg-white min-h-[400px]">
                            {appointments
                                .filter(appt => isSameDay(new Date(appt.dateTime), day))
                                .map(appt => (
                                    <div key={appt.id} className="group bg-indigo-50 border border-indigo-100 p-2 rounded text-sm hover:shadow-md transition-all">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="font-semibold text-indigo-700">
                                                {format(new Date(appt.dateTime), 'HH:mm')}
                                            </div>
                                            <div className={`flex gap-1 ${isMobile ? '' : 'opacity-0 group-hover:opacity-100 transition-opacity'}`}>
                                                {appt.patient?.mobilePhone && (
                                                    <a
                                                        href={createWhatsAppLink(appt)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-1 text-green-600 hover:text-green-700 rounded bg-white border border-gray-100 shadow-sm"
                                                        title="Enviar recordatorio por WhatsApp"
                                                    >
                                                        <MessageCircle className="w-3 h-3" />
                                                    </a>
                                                )}
                                                <button
                                                    onClick={() => navigate(`/appointments/${appt.id}/edit`)}
                                                    className="p-1 text-gray-500 hover:text-indigo-600 rounded bg-white border border-gray-100 shadow-sm"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-3 h-3" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(appt.id)}
                                                    className="p-1 text-gray-500 hover:text-red-600 rounded bg-white border border-gray-100 shadow-sm"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="truncate">{appt.patient?.firstName} {appt.patient?.lastName}</div>
                                        <div className="text-xs text-gray-500 mt-1 uppercase font-bold text-[10px]">{appt.status}</div>

                                        {!appt.session && appt.status !== 'CANCELLED' && (
                                            <Link to={`/appointments/${appt.id}/session`} className="block mt-2 text-xs text-blue-600 hover:underline font-medium">
                                                + Crear Sesión
                                            </Link>
                                        )}
                                        {appt.session && (
                                            <Link to={`/sessions/${appt.session.id}/edit`} className="block mt-2 text-xs text-indigo-600 hover:underline font-medium">
                                                Editar Sesión
                                            </Link>
                                        )}
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Schedule;

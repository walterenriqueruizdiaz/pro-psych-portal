import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api/axios';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';

const SessionForm = () => {
    const { id: appointmentId, sessionId } = useParams();
    const isEditMode = !!sessionId;
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [contextData, setContextData] = useState(null); // Either appointment or session info

    useEffect(() => {
        if (isEditMode) {
            fetchSession();
        } else {
            fetchAppt();
        }
    }, [appointmentId, sessionId]);

    const fetchAppt = async () => {
        try {
            const res = await api.get(`/appointments/${appointmentId}`);
            setContextData({
                patient: res.data.patient,
                dateTime: res.data.dateTime,
                appointmentId: res.data.id
            });
        } catch (err) {
            console.error("Error fetching appointment", err);
        }
    };

    const fetchSession = async () => {
        try {
            const res = await api.get(`/sessions/${sessionId}`);
            setContextData({
                patient: res.data.patient,
                dateTime: res.data.date, // sessions use 'date' field
                appointmentId: res.data.appointmentId
            });
            reset({
                sessionType: res.data.sessionType,
                notes: res.data.notes
            });
        } catch (err) {
            console.error("Error fetching session", err);
            alert("Error al cargar los datos de la sesión");
        }
    };

    const onSubmit = async (data) => {
        try {
            if (isEditMode) {
                await api.put(`/sessions/${sessionId}`, data);
            } else {
                await api.post(`/appointments/${appointmentId}/session`, data);
            }
            navigate('/appointments'); // Redirect to schedule
        } catch (err) {
            console.error("Error saving session", err);
            const serverMessage = err.response?.data?.message || err.response?.data?.error || err.message;
            alert(`Error al guardar la sesión: ${serverMessage}`);
        }
    };

    if (!contextData) return <div className="p-10 text-center">Cargando información de la sesión...</div>;

    return (
        <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-6">{isEditMode ? 'Editar Sesión' : 'Registrar Sesión'}</h2>

            <div className="mb-6 bg-gray-50 p-4 rounded text-sm">
                <p><strong>Paciente:</strong> {contextData.patient?.firstName} {contextData.patient?.lastName}</p>
                <p><strong>Fecha/Hora:</strong> {format(new Date(contextData.dateTime), 'PPpp')}</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo de Sesión</label>
                    <select {...register('sessionType', { required: true })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="INTERVENTION">Intervención</option>
                        <option value="EVALUATION">Evaluación</option>
                        <option value="PARENTS_MEETING">Reunión con Padres</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Notas</label>
                    <textarea
                        rows={10}
                        {...register('notes', { required: 'Por favor, proporcione notas de la sesión' })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Notas detalladas de la sesión..."
                    />
                    {errors.notes && <span className="text-red-500 text-xs">{errors.notes.message}</span>}
                </div>

                <div className="pt-4 flex gap-4">
                    <button type="button" onClick={() => navigate('/appointments')} className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Cancel
                    </button>
                    <button type="submit" className="flex-2 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        {isEditMode ? 'Actualizar Sesión' : 'Guardar Sesión'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SessionForm;

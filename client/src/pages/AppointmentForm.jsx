import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api/axios';
import { useNavigate, useParams } from 'react-router-dom';

const AppointmentForm = () => {
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(isEditMode);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // Load patients
                const patientsRes = await api.get('/patients');
                setPatients(patientsRes.data);

                // If editing, load appointment data
                if (isEditMode) {
                    const apptRes = await api.get(`/appointments/${id}`);
                    const appt = apptRes.data;

                    setValue('patientId', appt.patientId);
                    // Format dateTime for datetime-local input (YYYY-MM-DDTHH:mm)
                    const date = new Date(appt.dateTime);
                    const formattedDate = date.toISOString().slice(0, 16);
                    setValue('dateTime', formattedDate);
                    setValue('status', appt.status);
                    setLoading(false);
                }
            } catch (err) {
                console.error("Error loading form data", err);
                alert("Error al cargar datos");
            }
        };
        loadInitialData();
    }, [id, isEditMode, setValue]);

    const onSubmit = async (data) => {
        try {
            if (isEditMode) {
                await api.put(`/appointments/${id}`, data);
            } else {
                await api.post('/appointments', data);
            }
            navigate('/appointments');
        } catch (err) {
            console.error(`Error ${isEditMode ? 'updating' : 'creating'} appointment`, err);
            alert(`Error ${isEditMode ? 'updating' : 'creating'} appointment`);
        }
    };

    if (loading) return <div className="p-6 text-center">Cargando...</div>;

    return (
        <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-6">{isEditMode ? 'Editar' : 'Nuevo'} turno</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Paciente</label>
                    <select {...register('patientId', { required: true })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="">Seleccionar paciente</option>
                        {patients.map(p => (
                            <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                        ))}
                    </select>
                    {errors.patientId && <span className="text-red-500 text-xs">Required</span>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha y Hora</label>
                    <input type="datetime-local" {...register('dateTime', { required: true })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" />
                    {errors.dateTime && <span className="text-red-500 text-xs">Required</span>}
                </div>


                <div>
                    <label className="block text-sm font-medium text-gray-700">Estado</label>
                    <select {...register('status')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="RESERVADO">Reservado</option>
                        <option value="CONFIRMADO">Confirmado</option>
                        <option value="CANCELADO">Cancelado</option>
                    </select>
                </div>


                {!isEditMode && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Recurrencia</label>
                        <select {...register('recurrence')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500">
                            <option value="NONE">Antes de fin de año (Ninguno)</option>
                            <option value="WEEKLY">Semanalmente (Hasta fin de año)</option>
                            <option value="MONTHLY">Mensualmente (Hasta fin de año)</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Opciones semanales/mensuales generan citas automáticamente hasta el final del año actual.</p>
                    </div>
                )}

                <div className="pt-4 flex gap-4">
                    <button type="button" onClick={() => navigate('/appointments')} className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        Cancelar
                    </button>
                    <button type="submit" className="flex-1 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        {isEditMode ? 'Actualizar' : 'Programar'} Turno
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AppointmentForm;

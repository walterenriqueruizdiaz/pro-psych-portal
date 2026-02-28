import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api/axios';
import { useNavigate, useParams } from 'react-router-dom';

const PatientForm = () => {
    const { id } = useParams();
    const isEditMode = !!id;
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const navigate = useNavigate();

    useEffect(() => {
        if (isEditMode) {
            fetchPatient();
        }
    }, [id]);

    const fetchPatient = async () => {
        try {
            const res = await api.get(`/patients/${id}`);
            const patientData = res.data;
            // Format date for the input
            if (patientData.birthDate) {
                patientData.birthDate = new Date(patientData.birthDate).toISOString().split('T')[0];
            }
            reset(patientData);
        } catch (err) {
            console.error("Error fetching patient", err);
            alert("Error al cargar los datos del paciente");
        }
    };

    const onSubmit = async (data) => {
        try {
            if (isEditMode) {
                await api.put(`/patients/${id}`, data);
            } else {
                await api.post('/patients', data);
            }
            navigate('/patients');
        } catch (err) {
            console.error("Error saving patient", err);
            const serverMessage = err.response?.data?.message || err.response?.data?.error || err.message;
            alert(`Error al guardar el paciente: ${serverMessage}`);
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-6">{isEditMode ? 'Editar Paciente' : 'Nuevo Paciente'}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input {...register('firstName', { required: true })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" />
                        {errors.firstName && <span className="text-red-500 text-xs">Required</span>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Apellido</label>
                        <input {...register('lastName', { required: true })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" />
                        {errors.lastName && <span className="text-red-500 text-xs">Required</span>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">DNI</label>
                        <input
                            {...register('dni', {
                                required: 'Se requiere DNI',
                                pattern: {
                                    value: /^\d+$/,
                                    message: 'DNI debe contener solo números'
                                }
                            })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.dni && <span className="text-red-500 text-xs">{errors.dni.message}</span>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
                        <input type="date" {...register('birthDate', { required: true })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" />
                        {errors.birthDate && <span className="text-red-500 text-xs">Required</span>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Celular</label>
                        <input {...register('mobilePhone', { required: true })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" />
                        {errors.mobilePhone && <span className="text-red-500 text-xs">Required</span>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email (Opcional)</label>
                        <input type="email" {...register('email')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                </div>

                <div className="pt-4 flex gap-4">
                    <button type="button" onClick={() => navigate('/patients')} className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Cancelar
                    </button>
                    <button type="submit" className="flex-2 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        {isEditMode ? 'Actualizar Paciente' : 'Crear Paciente'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PatientForm;

import React from 'react';
import { useForm } from 'react-hook-form';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const CompleteProfile = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            await api.put('/professionals/me', data);
            navigate('/dashboard');
        } catch (error) {
            console.error("Failed to update profile", error);
            alert("Error al actualizar el perfil");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">Completa tu perfil</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input
                            {...register("firstName", { required: true })}
                            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.firstName && <span className="text-red-500 text-xs">Requerido</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Apellido</label>
                        <input
                            {...register("lastName", { required: true })}
                            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.lastName && <span className="text-red-500 text-xs">Requerido</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">DNI</label>
                        <input
                            {...register("dni", { required: true })}
                            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.dni && <span className="text-red-500 text-xs">Requerido</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Número de licencia</label>
                        <input
                            {...register("professionalLicenseNumber", { required: true })}
                            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.professionalLicenseNumber && <span className="text-red-500 text-xs">Requerido</span>}
                    </div>

                    <button type="submit" className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                        Guardar & Continuar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CompleteProfile;

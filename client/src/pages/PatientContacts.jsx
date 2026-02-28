import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useForm } from 'react-hook-form';
import { UserPlus, Trash2, Edit2, ArrowLeft, Phone, Mail, Users } from 'lucide-react';

const PatientContacts = () => {
    const { id: patientId } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [contacts, setContacts] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        fetchPatientData();
        fetchContacts();
    }, [patientId]);

    const fetchPatientData = async () => {
        try {
            const res = await api.get(`/patients/${patientId}`);
            setPatient(res.data);
        } catch (err) {
            console.error("Error fetching patient", err);
        }
    };

    const fetchContacts = async () => {
        try {
            const res = await api.get(`/patients/${patientId}/contacts`);
            setContacts(res.data);
        } catch (err) {
            console.error("Error fetching contacts", err);
        }
    };

    const onSubmit = async (data) => {
        try {
            if (editMode && selectedContact) {
                await api.put(`/patients/contacts/${selectedContact.id}`, data);
                setEditMode(false);
                setSelectedContact(null);
            } else {
                await api.post(`/patients/${patientId}/contacts`, data);
            }
            reset();
            fetchContacts();
        } catch (err) {
            console.error("Error saving contact", err);
            alert("Error al guardar el contacto");
        }
    };

    const handleEdit = (contact) => {
        setEditMode(true);
        setSelectedContact(contact);
        reset(contact);
    };

    const handleDelete = async (contactId) => {
        if (!window.confirm("¿Está seguro de que desea eliminar este contacto?")) return;
        try {
            await api.delete(`/patients/contacts/${contactId}`);
            fetchContacts();
        } catch (err) {
            console.error("Error deleting contact", err);
            alert("Error al eliminar el contacto");
        }
    };

    const cancelEdit = () => {
        setEditMode(false);
        setSelectedContact(null);
        reset({
            firstName: '',
            lastName: '',
            relationshipToPatient: '',
            mobilePhone: '',
            email: ''
        });
    };

    if (!patient) return <div className="p-6 text-center">Cargando datos del paciente...</div>;

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex items-center mb-6">
                <button
                    onClick={() => navigate('/patients')}
                    className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-gray-600" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">
                    Contactos de {patient.firstName} {patient.lastName}
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                        <h2 className="text-lg font-semibold mb-4 flex items-center">
                            {editMode ? <Edit2 className="w-5 h-5 mr-2 text-indigo-600" /> : <UserPlus className="w-5 h-5 mr-2 text-indigo-600" />}
                            {editMode ? 'Editar Contacto' : 'Nuevo Contacto'}
                        </h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                <input
                                    {...register('firstName', { required: 'Campo requerido' })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                />
                                {errors.firstName && <span className="text-red-500 text-xs">{errors.firstName.message}</span>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Apellido</label>
                                <input
                                    {...register('lastName', { required: 'Campo requerido' })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                />
                                {errors.lastName && <span className="text-red-500 text-xs">{errors.lastName.message}</span>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Vínculo / Relación</label>
                                <input
                                    {...register('relationshipToPatient', { required: 'Campo requerido' })}
                                    placeholder="Ej: Madre, Padre, Tutor"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                />
                                {errors.relationshipToPatient && <span className="text-red-500 text-xs">{errors.relationshipToPatient.message}</span>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Celular</label>
                                <input
                                    {...register('mobilePhone')}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    {...register('email')}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                />
                            </div>
                            <div className="pt-2 flex gap-3">
                                <button
                                    type="submit"
                                    className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors font-medium"
                                >
                                    {editMode ? 'Guardar Cambios' : 'Añadir Contacto'}
                                </button>
                                {editMode && (
                                    <button
                                        type="button"
                                        onClick={cancelEdit}
                                        className="bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors font-medium"
                                    >
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center">
                            <Users className="w-5 h-5 text-gray-500 mr-2" />
                            <h2 className="font-semibold text-gray-900">Lista de Contactos</h2>
                        </div>
                        <ul className="divide-y divide-gray-100">
                            {contacts.length > 0 ? (
                                contacts.map(contact => (
                                    <li key={contact.id} className="p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <div className="flex items-center">
                                                    <span className="font-bold text-gray-900 mr-2">{contact.firstName} {contact.lastName}</span>
                                                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full border border-indigo-100">
                                                        {contact.relationshipToPatient}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col sm:flex-row sm:gap-4 text-sm text-gray-600">
                                                    {contact.mobilePhone && (
                                                        <div className="flex items-center">
                                                            <Phone className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                                                            {contact.mobilePhone}
                                                        </div>
                                                    )}
                                                    {contact.email && (
                                                        <div className="flex items-center">
                                                            <Mail className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                                                            {contact.email}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(contact)}
                                                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(contact.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <li className="p-8 text-center text-gray-500 italic">
                                    No hay contactos registrados para este paciente.
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientContacts;

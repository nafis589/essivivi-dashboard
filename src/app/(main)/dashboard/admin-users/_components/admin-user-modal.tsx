import React, { useState } from 'react';
import {
    X,
    Plus
} from 'lucide-react';
import type { AdminUser } from './schema';

interface AdminUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode?: 'create' | 'edit';
    initialData?: AdminUser;
}

const AdminUserModal: React.FC<AdminUserModalProps> = ({
    isOpen,
    onClose,
    mode = 'create',
    initialData
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div
                className="w-full max-w-lg bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border-[#f4f4f5]"
                style={{ backgroundColor: '#f4f4f5' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: '#f4f4f5' }}>
                    <h2 className="text-xl font-bold text-gray-900">
                        {mode === 'create' ? 'Ajouter un administrateur' : 'Modifier l\'administrateur'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    <FormField label="Nom et Prénom" placeholder="Jean Dupont" value={initialData?.name} />
                    <FormField label="Email" placeholder="nom@essivivi.com" type="email" value={initialData?.email} />

                    <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-gray-700">Rôle</label>
                        <select
                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            style={{ backgroundColor: '#f4f4f4', borderColor: '#a0a8b4' }}
                            defaultValue={initialData?.role || "Superviseur"}
                        >
                            <option>Super Admin</option>
                            <option>Gestionnaire</option>
                            <option>Superviseur</option>
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-gray-700">Statut</label>
                        <select
                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            style={{ backgroundColor: '#f4f4f4', borderColor: '#a0a8b4' }}
                            defaultValue={initialData?.status || "Actif"}
                        >
                            <option>Actif</option>
                            <option>Inactif</option>
                        </select>
                    </div>

                    {mode === 'create' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField label="Mot de passe" type="password" placeholder="••••••••" />
                            <FormField label="Confirmer" type="password" placeholder="••••••••" />
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 flex gap-3 border-t" style={{ borderColor: '#e5e7eb' }}>
                    <button
                        onClick={onClose}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        <Plus size={18} />
                        {mode === 'create' ? 'Ajouter' : 'Enregistrer'}
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors border"
                        style={{ backgroundColor: '#1e293b', borderColor: '#1e293b' }}
                    >
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    );
};

interface FormFieldProps {
    label: string;
    placeholder?: string;
    type?: string;
    value?: string;
    disabled?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({ label, placeholder, type = "text", value, disabled }) => (
    <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-gray-700">{label}</label>
        <input
            type={type}
            placeholder={placeholder}
            defaultValue={value}
            disabled={disabled}
            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 placeholder:text-gray-400 disabled:bg-gray-200 disabled:text-gray-500"
            style={{ backgroundColor: disabled ? '#e5e7eb' : '#f4f4f4', borderColor: '#a0a8b4' }}
        />
    </div>
);

export default AdminUserModal;

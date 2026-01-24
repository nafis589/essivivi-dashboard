import React, { useState } from 'react';
import {
    X,
    ChevronUp,
    ChevronDown,
    Plus
} from 'lucide-react';
import type { Delivery } from './schema';

interface DeliveryModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode?: 'create' | 'edit';
    initialData?: Delivery;
}

const DeliveryModal: React.FC<DeliveryModalProps> = ({
    isOpen,
    onClose,
    mode = 'create',
    initialData
}) => {
    const [generalInfoOpen, setGeneralInfoOpen] = useState(true);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div
                className="w-full max-w-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border-[#f4f4f5]"
                style={{ backgroundColor: '#f4f4f5' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: '#f4f4f5' }}>
                    <h2 className="text-xl font-bold text-gray-900">
                        {mode === 'create' ? 'Ajouter une livraison' : 'Modifier la livraison'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="max-h-[80vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

                    {/* General Information Section */}
                    <div className="border-b" style={{ borderColor: '#fbfbfb' }}>
                        <button
                            onClick={() => setGeneralInfoOpen(!generalInfoOpen)}
                            className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                        >
                            <span className="font-semibold text-gray-700">Détails de la Livraison</span>
                            {generalInfoOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>

                        {generalInfoOpen && (
                            <div className="px-6 pb-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField label="ID Livraison" placeholder="LIV-001" value={initialData?.id} disabled />
                                    <FormField label="Statut" value={initialData?.statut} disabled />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField label="ID Agent" placeholder="AGT-001" value={initialData?.agent} disabled />
                                    <FormField label="Nom Agent" placeholder="Nom de l'agent" value={initialData?.agentName} disabled />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField label="Nom Client / Point de Vente" placeholder="Client" value={initialData?.clientName} />
                                    <FormField label="Téléphone Client" placeholder="+228..." value={initialData?.clientPhone} />
                                </div>

                                <FormField label="Adresse Client" placeholder="Adresse" value={initialData?.clientAddress} />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField label="Latitude" placeholder="6.1234" value={initialData?.latitude?.toString()} />
                                    <FormField label="Longitude" placeholder="1.2345" value={initialData?.longitude?.toString()} />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField label="Quantité" placeholder="0" type="number" value={initialData?.quantity?.toString()} />
                                    <FormField label="Montant (FCFA)" placeholder="0" type="number" value={initialData?.amount?.toString()} />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormField label="Date" type="date" value={initialData?.date} />
                                    <FormField label="Heure" type="time" value={initialData?.time} />
                                    <FormField label="Durée" placeholder="15 min" value={initialData?.duration} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 flex gap-3">
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

export default DeliveryModal;

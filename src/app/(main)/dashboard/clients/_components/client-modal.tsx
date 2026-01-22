import React, { useState, useRef, useEffect } from 'react';
import {
    X,
    ChevronUp,
    ChevronDown,
    Plus,
} from 'lucide-react';
import { clientService } from '@/services/client.service';

interface ClientModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode?: 'create' | 'edit';
    type?: 'client';
    initialData?: any;
    onSaved?: () => void;
}

const ClientModal: React.FC<ClientModalProps> = ({
    isOpen,
    onClose,
    mode = 'create',
    type = 'client',
    initialData,
    onSaved,
}) => {
    const [generalInfoOpen, setGeneralInfoOpen] = useState(true);
    const [additionalInfoOpen, setAdditionalInfoOpen] = useState(false);
    const [fileName, setFileName] = useState("Aucun fichier n'a été sélectionné");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFileName(e.target.files[0].name);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    // Champs contrôlés pour client
    const [nomPointVente, setNomPointVente] = useState('');
    const [responsable, setResponsable] = useState('');
    const [telephone, setTelephone] = useState('');
    const [adresse, setAdresse] = useState('');

    useEffect(() => {
        if (isOpen && initialData && type === 'client') {
            setNomPointVente(initialData.nom_point_vente ?? '');
            setResponsable(initialData.responsable ?? '');
            setTelephone(initialData.telephone ?? '');
            setAdresse(initialData.adresse ?? '');
        } else if (isOpen && mode === 'create') {
            setNomPointVente('');
            setResponsable('');
            setTelephone('');
            setAdresse('');
        }
    }, [isOpen, initialData, type, mode]);

    const handleSubmit = async () => {
        try {
            if (mode === 'create') {
                await clientService.createClient({
                    nom_point_vente: nomPointVente,
                    responsable,
                    telephone,
                    adresse,
                });
            } else if (mode === 'edit' && initialData?.id) {
                await clientService.updateClient(initialData.id, {
                    nom_point_vente: nomPointVente,
                    responsable,
                    telephone,
                    adresse,
                });
            }
            onClose();
            onSaved?.();
        } catch (e) {
            console.error(e);
        }
    };

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
                        {mode === 'create' ? 'Ajouter' : 'Modifier'} un client
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
                            <span className="font-semibold text-gray-700">Informations Générales</span>
                            {generalInfoOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>

                        {generalInfoOpen && (
                            <div className="px-6 pb-6 space-y-6">
                                {/* POS Photo */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold text-gray-700">Photo du point de vente</label>
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-20 h-20 bg-gray-100 flex items-center justify-center overflow-hidden border rounded-lg" style={{ borderColor: '#fbfbfb' }}>
                                            <img
                                                src={initialData?.avatar || "https://picsum.photos/seed/pos/200"}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div
                                                className="flex items-center rounded-lg border overflow-hidden"
                                                style={{ borderColor: '#fbfbfb' }}
                                            >
                                                <button
                                                    onClick={triggerFileInput}
                                                    className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium border-r hover:bg-gray-200 transition-colors"
                                                    style={{ borderColor: '#fbfbfb', backgroundColor: '#f4f4f4' }}
                                                >
                                                    Choisir un fichier
                                                </button>
                                                <div className="px-4 py-2 text-sm text-gray-500 truncate bg-white flex-1">
                                                    {fileName}
                                                </div>
                                            </div>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileChange}
                                                className="hidden"
                                                accept="image/*"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField label="ID (Auto)" placeholder="CLT-001" value={initialData?.id || "Auto-généré"} disabled />
                                    <FormField label="Nom du point de vente" placeholder="Boutique Essivivi" value={nomPointVente} onChange={(e) => setNomPointVente((e.target as HTMLInputElement).value)} />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField label="Nom du responsable" placeholder="Jean Responsable" value={responsable} onChange={(e) => setResponsable((e.target as HTMLInputElement).value)} />
                                    <FormField label="Numéro de téléphone" placeholder="+228 90 00 00 00" value={telephone} onChange={(e) => setTelephone((e.target as HTMLInputElement).value)} />
                                </div>

                                <FormField label="Adresse complète" placeholder="Quartier, Rue, Ville" value={adresse} onChange={(e) => setAdresse((e.target as HTMLInputElement).value)} />
                            </div>
                        )}
                    </div>

                    {/* Additional Information Section */}
                    <div className="border-b" style={{ borderColor: '#fbfbfb' }}>
                        <button
                            onClick={() => setAdditionalInfoOpen(!additionalInfoOpen)}
                            className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                        >
                            <span className="font-semibold text-gray-700">Informations Supplémentaires</span>
                            {additionalInfoOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                        {additionalInfoOpen && (
                            <div className="px-6 pb-6">
                                <p className="text-sm text-gray-500">Plus de détails ici...</p>
                            </div>
                        )}
                    </div>

                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 flex gap-3">
                    <button
                        onClick={handleSubmit}
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

/* Helper Components */

interface FormFieldProps {
    label: string;
    placeholder?: string;
    type?: string;
    value?: string;
    disabled?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormField: React.FC<FormFieldProps> = ({ label, placeholder, type = "text", value, disabled, onChange }) => (
    <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-gray-700">{label}</label>
        <input
            type={type}
            placeholder={placeholder}
            {...(onChange ? { value: value ?? "", onChange } : { defaultValue: value })}
            disabled={disabled}
            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 placeholder:text-gray-400 disabled:bg-gray-200 disabled:text-gray-500"
            style={{ backgroundColor: disabled ? '#e5e7eb' : '#f4f4f4', borderColor: '#a0a8b4' }}
        />
    </div>
);

export default ClientModal;

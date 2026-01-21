import React, { useState, useRef } from 'react';
import {
    X,
    ChevronUp,
    ChevronDown,
    Info,
    Plus,
    Camera
} from 'lucide-react';

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose }) => {
    const [generalInfoOpen, setGeneralInfoOpen] = useState(true);
    const [additionalInfoOpen, setAdditionalInfoOpen] = useState(false);
    const [statusActive, setStatusActive] = useState(false);
    const [fileName, setFileName] = useState('Aucun fichier n\'a été sélectionné');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFileName(e.target.files[0].name);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
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
                    <h2 className="text-xl font-bold text-gray-900">Add new user</h2>
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
                            <span className="font-semibold text-gray-700">General Information</span>
                            {generalInfoOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>

                        {generalInfoOpen && (
                            <div className="px-6 pb-6 space-y-6">

                                {/* Avatar Upload */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold text-gray-700">Upload avatar</label>
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border" style={{ borderColor: '#fbfbfb' }}>
                                            <img
                                                src="https://picsum.photos/seed/avatar/200"
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
                                            <p className="mt-1 text-xs text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px).</p>
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

                                {/* Name Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField label="First Name" placeholder="John" />
                                    <FormField label="Last Name" placeholder="Doe" />
                                </div>

                                {/* Email & Permissions */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField label="Email" placeholder="name@company.com" type="email" />
                                    <div className="space-y-1.5">
                                        <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                                            User Permissions <Info size={14} className="text-gray-400" />
                                        </label>
                                        <select
                                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            style={{ backgroundColor: '#f4f4f4', borderColor: '#a0a8b4' }}
                                        >
                                            <option>Super admin</option>
                                            <option>Gestionnaire</option>
                                            <option>Superviseur</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Job Title & Languages */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField label="Job Title" placeholder="e.g React Native Developer" />
                                    <FormField label="Languages" placeholder="e.g English" />
                                </div>

                                {/* Account & Role */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                                            Account <Info size={14} className="text-gray-400" />
                                        </label>
                                        <select
                                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            style={{ backgroundColor: '#f4f4f4', borderColor: '#a0a8b4' }}
                                        >
                                            <option>Choose account type</option>
                                            <option>Personal</option>
                                            <option>Business</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                                            User Role <Info size={14} className="text-gray-400" />
                                        </label>
                                        <select
                                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            style={{ backgroundColor: '#f4f4f4', borderColor: '#a0a8b4' }}
                                        >
                                            <option>Owner</option>
                                            <option>Editor</option>
                                            <option>Viewer</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Email Status */}
                                <div className="space-y-1.5">
                                    <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                                        Email Status <Info size={14} className="text-gray-400" />
                                    </label>
                                    <select
                                        className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        style={{ backgroundColor: '#f4f4f4', borderColor: '#a0a8b4' }}
                                    >
                                        <option>Not verified</option>
                                        <option>Verified</option>
                                        <option>Pending</option>
                                    </select>
                                </div>

                                {/* Password Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField label="Password" placeholder="••••••••" type="password" />
                                    <FormField label="Confirm password" placeholder="••••••••" type="password" />
                                </div>

                                {/* Assign Role */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold text-gray-700">Assign Role</label>
                                    <div className="flex flex-wrap gap-6">
                                        <Checkbox label="Administrator" id="admin" />
                                        <Checkbox label="Member" id="member" />
                                        <Checkbox label="Viewer" id="viewer" checked />
                                    </div>
                                </div>

                                {/* Status Toggle */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold text-gray-700">Status</label>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setStatusActive(!statusActive)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${statusActive ? 'bg-blue-600' : 'bg-gray-300'}`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${statusActive ? 'translate-x-6' : 'translate-x-1'}`}
                                            />
                                        </button>
                                        <span className="text-sm font-medium text-gray-700">{statusActive ? 'Active' : 'Inactive'}</span>
                                    </div>
                                </div>

                            </div>
                        )}
                    </div>

                    {/* Additional Information Section */}
                    <div className="border-b" style={{ borderColor: '#fbfbfb' }}>
                        <button
                            onClick={() => setAdditionalInfoOpen(!additionalInfoOpen)}
                            className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                        >
                            <span className="font-semibold text-gray-700">Additional Information</span>
                            {additionalInfoOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                        {additionalInfoOpen && (
                            <div className="px-6 pb-6">
                                <p className="text-sm text-gray-500">More details can be added here...</p>
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
                        Add new user
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors border"
                        style={{ backgroundColor: '#1e293b', borderColor: '#1e293b' }}
                    >
                        Discard
                    </button>
                </div>
            </div>
        </div>
    );
};

/* Helper Components */

interface FormFieldProps {
    label: string;
    placeholder: string;
    type?: string;
}

const FormField: React.FC<FormFieldProps> = ({ label, placeholder, type = "text" }) => (
    <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-gray-700">{label}</label>
        <input
            type={type}
            placeholder={placeholder}
            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 placeholder:text-gray-400"
            style={{ backgroundColor: '#f4f4f4', borderColor: '#a0a8b4' }}
        />
    </div>
);

interface CheckboxProps {
    label: string;
    id: string;
    checked?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, id, checked = false }) => {
    const [isChecked, setIsChecked] = useState(checked);
    return (
        <div className="flex items-center gap-2">
            <input
                type="checkbox"
                id={id}
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor={id} className="text-sm font-medium text-gray-700 cursor-pointer">{label}</label>
        </div>
    );
};

export default UserModal;

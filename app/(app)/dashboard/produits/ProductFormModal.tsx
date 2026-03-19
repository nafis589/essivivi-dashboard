'use client'

import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { X, UploadCloud, Calendar } from 'lucide-react'

interface ProductFormModalProps {
    isOpen: boolean
    onClose: () => void
    product?: any | null
}

export function ProductFormModal({
    isOpen,
    onClose,
    product,
}: ProductFormModalProps) {
    const isEditing = !!product

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogPortal>
                <DialogOverlay className="bg-slate-900/40 backdrop-blur-sm" />

                <DialogContent
                    showCloseButton={false}
                    className="w-[850px] max-w-[95vw] p-0 gap-0 overflow-hidden bg-white rounded-xl border border-slate-200 shadow-xl"
                    aria-describedby="product-form-description"
                >
                    <DialogDescription id="product-form-description" className="sr-only">
                        Fill out the form below to add or edit a product.
                    </DialogDescription>

                    {/* HEADER */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                        <DialogTitle className="text-lg font-semibold text-slate-900">
                            {isEditing ? 'Edit Product' : 'Add Product'}
                        </DialogTitle>

                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* FORM */}
                    <div className="px-6 py-6 space-y-6 max-h-[75vh] overflow-y-auto">

                        {/* ROW 1 */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-900">
                                    Product Name
                                </label>
                                <Input
                                    placeholder="Type product name"
                                    defaultValue={product?.name}
                                    className="h-10 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-900">
                                    Category
                                </label>

                                <Select defaultValue={product?.category || 'PC'}>
                                    <SelectTrigger className="h-10 bg-slate-50 border-slate-200 text-slate-900">
                                        <SelectValue />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="PC">PC</SelectItem>
                                        <SelectItem value="Phone">Phone</SelectItem>
                                        <SelectItem value="Tablet">Tablet</SelectItem>
                                        <SelectItem value="Gaming/Console">
                                            Gaming/Console
                                        </SelectItem>
                                        <SelectItem value="Watch">Watch</SelectItem>
                                        <SelectItem value="Photo">Photo</SelectItem>
                                        <SelectItem value="TV/Monitor">TV/Monitor</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* ROW 2 */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-900">
                                    Brand
                                </label>

                                <Input
                                    placeholder="Product brand"
                                    defaultValue={product?.brand}
                                    className="h-10 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-900">
                                    Price
                                </label>

                                <Input
                                    type="number"
                                    placeholder="$2999"
                                    defaultValue={product?.price ? product.price.replace('$', '') : ''}
                                    className="h-10 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-500"
                                />
                            </div>
                        </div>

                        {/* ROW 3 DIMENSIONS */}
                        <div className="grid grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-900">
                                    Item weight
                                </label>

                                <Input
                                    placeholder="12"
                                    defaultValue={isEditing ? '12' : ''}
                                    className="h-10 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-900">
                                    Lenght (cm)
                                </label>

                                <Input
                                    placeholder="105"
                                    defaultValue={isEditing ? '105' : ''}
                                    className="h-10 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-900">
                                    Breadth (cm)
                                </label>

                                <Input
                                    placeholder="2"
                                    defaultValue={isEditing ? '2' : ''}
                                    className="h-10 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-900">
                                    Width (cm)
                                </label>

                                <Input
                                    placeholder="23"
                                    defaultValue={isEditing ? '23' : ''}
                                    className="h-10 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-500"
                                />
                            </div>
                        </div>

                        {/* DESCRIPTION */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-900">
                                Description
                            </label>

                            <Textarea
                                placeholder="Write product description here"
                                className="min-h-[130px] bg-slate-50 border-slate-200 resize-none text-slate-900 placeholder:text-slate-500"
                            />
                        </div>

                        {/* CHECKBOXES */}
                        <div className="flex items-center gap-6 flex-wrap">
                            <label className="flex items-center gap-2 text-sm text-slate-900 font-medium cursor-pointer">
                                <Checkbox defaultChecked className="border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-white shadow-none rounded-[4px]" />
                                In-store only
                            </label>

                            <label className="flex items-center gap-2 text-sm text-slate-900 font-medium cursor-pointer">
                                <Checkbox defaultChecked className="border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-white shadow-none rounded-[4px]" />
                                Online selling only
                            </label>

                            <label className="flex items-center gap-2 text-sm text-slate-900 font-medium cursor-pointer">
                                <Checkbox defaultChecked className="border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-white shadow-none rounded-[4px]" />
                                Both in-store and online
                            </label>
                        </div>

                        {/* DROPZONE */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-900">
                                Product Images
                            </label>

                            <div className="border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 transition flex flex-col items-center justify-center text-center py-16 cursor-pointer">
                                <UploadCloud className="h-10 w-10 text-slate-400 mb-3" />

                                <p className="text-sm text-slate-500">
                                    <span className="font-semibold text-slate-900">
                                        Click to upload
                                    </span>{' '}
                                    or drag and drop
                                </p>

                                <p className="text-xs text-slate-400 mt-1">
                                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="flex items-center gap-3 px-6 py-4 border-t border-slate-200 bg-white">
                        <Button className="bg-[#1C4ED8] hover:bg-blue-800 text-white px-5 rounded-lg shadow-sm font-medium">
                            {isEditing ? 'Save changes' : 'Add product'}
                        </Button>

                        <Button className="bg-[#1C4ED8] hover:bg-blue-800 text-white flex gap-2 px-5 rounded-lg shadow-sm font-medium">
                            <Calendar className="h-4 w-4" />
                            Schedule
                        </Button>

                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="border-slate-300 text-slate-900 hover:bg-slate-50 px-5 rounded-lg shadow-sm font-medium"
                        >
                            Discard
                        </Button>
                    </div>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    )
}
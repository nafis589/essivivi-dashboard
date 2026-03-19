'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ClientFormData, Client } from '@/lib/modules/clients/types'

const clientSchema = z.object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    phone: z.string().optional(),
    email: z.string().email("Email invalide").or(z.literal('')),
    address: z.string().optional(),
    notes: z.string().optional()
})

interface ClientFormProps {
    initialData?: Client
    onSubmit: (data: ClientFormData) => void
    onCancel: () => void
}

export function ClientForm({ initialData, onSubmit, onCancel }: ClientFormProps) {
    const form = useForm<ClientFormData>({
        resolver: zodResolver(clientSchema),
        defaultValues: {
            name: initialData?.name || '',
            phone: initialData?.phone || '',
            email: initialData?.email || '',
            address: initialData?.address || '',
            notes: initialData?.notes || ''
        }
    })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex flex-col h-full">
                <ScrollArea className="flex-1 pr-4">
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nom complet *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Jean Dupont" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Téléphone</FormLabel>
                                        <FormControl>
                                            <Input placeholder="07 12 34 56 78" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="jean@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Adresse</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="123 rue de la République..." className="resize-none" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notes internes</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Préférences, remarques..."
                                            className="resize-none h-24"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </ScrollArea>

                <div className="flex gap-3 justify-end pt-4 border-t mt-auto">
                    <Button variant="outline" type="button" onClick={onCancel}>
                        Annuler
                    </Button>
                    <Button type="submit">
                        {initialData ? 'Enregistrer les modifications' : 'Créer le client'}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

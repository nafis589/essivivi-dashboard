/* eslint-disable @next/next/no-img-element */
'use client'

import { useState, useEffect } from 'react'
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

import { Checkbox } from '@/components/ui/checkbox'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ProductFormData, Product } from '@/lib/types/product.types'


// Helper: converts empty string or NaN to undefined for optional numeric fields
const optionalNumber = z.preprocess(
  (val) => {
    if (val === '' || val === null || val === undefined) return undefined;
    const num = Number(val);
    return isNaN(num) ? undefined : num;
  },
  z.number().min(0).optional()
);

// Adapting the Zod Schema based on the exact API docs
const productSchema = z.object({
  name: z.string().min(2, "Le nom est requis"),
  price: z.coerce.number().min(0, "Le prix est requis"),
  description: z.string().optional(),
  costPrice: optionalNumber,
  stock: z.coerce.number().min(0).default(0),
  stockAlert: z.coerce.number().min(0).default(5),
  barcode: z.string().optional(),
  sku: z.string().optional(),
  active: z.boolean().default(true),
  metadata: z.object({
    brand: z.string().optional(),
    color: z.string().optional(),
    material: z.string().optional(),
  }).default({}),
  images: z.array(z.object({ url: z.string() })).default([])
})

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSubmit: (data: ProductFormData) => void;
}

export function ProductFormModal({
  isOpen,
  onClose,
  product,
  onSubmit
}: ProductFormModalProps) {
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: '',
      price: 0,
      description: '',
      costPrice: 0,
      stock: 0,
      stockAlert: 5,
      barcode: '',
      sku: '',
      active: true,
      metadata: { brand: '', color: '', material: '' },
      images: []
    }
  })

  // Reset form when product changes
  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        price: product.price,
        description: product.description || '',
        costPrice: product.costPrice || 0,
        stock: product.stock !== undefined ? product.stock : 0,
        stockAlert: product.stockAlert !== undefined ? product.stockAlert : 5,
        barcode: product.barcode || '',
        sku: product.sku || '',
        active: product.active !== undefined ? product.active : true,
        metadata: {
          brand: product.metadata?.brand || '',
          color: product.metadata?.color || '',
          material: product.metadata?.material || ''
        },
        images: product.images || []
      })
    } else {
      form.reset({
        name: '',
        price: 0,
        description: '',
        costPrice: 0,
        stock: 0,
        stockAlert: 5,
        barcode: '',
        sku: '',
        active: true,
        metadata: { brand: '', color: '', material: '' },
        images: []
      })
    }
  }, [product, form, isOpen])

  const [imageUrlInput, setImageUrlInput] = useState('')

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md p-6 overflow-hidden sm:rounded-l-2xl border-l flex flex-col h-full bg-white z-[100]">
        <SheetHeader className="mb-6">
          <SheetTitle>
            {product ? 'Modifier le produit' : 'Nouveau produit'}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-hidden text-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(
              (data) => {
                console.log('[ProductForm] ✅ Submit OK, data:', data);
                onSubmit(data as unknown as ProductFormData);
              },
              (errors) => {
                console.error('[ProductForm] ❌ Validation errors:', errors);
              }
            )} className="space-y-6 flex flex-col h-full">
              <div className="flex-1 overflow-y-auto pr-4 min-h-0">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom du produit *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: iPhone 14" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prix de vente *</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="999" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="costPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prix d'achat</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="700" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="stock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stock actuel</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="stockAlert"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Alerte stock bas</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="5" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="sku"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SKU</FormLabel>
                          <FormControl>
                            <Input placeholder="PROD-001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="barcode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Code-barres</FormLabel>
                          <FormControl>
                            <Input placeholder="123456789" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="metadata.brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Marque</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Apple" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="metadata.color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Couleur</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Noir" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="metadata.material"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Matériau</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Aluminium" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Description du produit..."
                            className="resize-none h-24"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4 border rounded-md">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Produit actif</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2 pt-2 pb-4">
                    <FormLabel>Images (URL)</FormLabel>
                    <div className="flex gap-2">
                      <Input
                        placeholder="https://example.com/image.jpg"
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (imageUrlInput.trim()) {
                              const currentImages = form.getValues('images') || [];
                              form.setValue('images', [...currentImages, { url: imageUrlInput.trim() }]);
                              setImageUrlInput('');
                            }
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          if (imageUrlInput.trim()) {
                            const currentImages = form.getValues('images') || [];
                            form.setValue('images', [...currentImages, { url: imageUrlInput.trim() }]);
                            setImageUrlInput('');
                          }
                        }}
                      >
                        Ajouter
                      </Button>
                    </div>
                    {form.watch('images')?.length > 0 && (
                      <div className="mt-2 grid grid-cols-4 gap-2">
                        {form.watch('images').map((img: any, idx: number) => {
                          const url = typeof img === 'string' ? img : img?.url;
                          if (!url) return null;
                          return (
                            <div key={idx} className="relative group rounded overflow-hidden aspect-square border cursor-pointer" onClick={() => {
                              const newImages = form.getValues('images').filter((_: any, i: number) => i !== idx);
                              form.setValue('images', newImages);
                            }}>
                              <img src={url} alt="Product" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-xs font-bold">X</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t mt-auto">
                <Button variant="outline" type="button" onClick={onClose}>
                  Annuler
                </Button>
                <Button type="submit">
                  {product ? 'Enregistrer les modifications' : 'Créer le produit'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  )
}
/**
 * Validation utilities
 * 
 * Shared validators used across the application.
 */

import * as z from 'zod'

// ─── Email ──────────────────────────────────────────────────────────────────────

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// ─── Phone ──────────────────────────────────────────────────────────────────────

export function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.length === 10
}

// ─── Zod Schemas ────────────────────────────────────────────────────────────────

export const emailSchema = z.string().email('Email invalide').or(z.literal(''))
export const phoneSchema = z.string().min(10, 'Numéro invalide').optional().or(z.literal(''))
export const requiredString = (label: string, min = 2) =>
  z.string().min(min, `${label} doit contenir au moins ${min} caractères`)

// ─── Client Form Schema ─────────────────────────────────────────────────────────

export const clientFormSchema = z.object({
  name: requiredString('Le nom'),
  phone: phoneSchema,
  email: emailSchema,
  address: z.string().optional(),
  notes: z.string().optional(),
})

// ─── Product Form Schema ────────────────────────────────────────────────────────

export const productFormSchema = z.object({
  name: requiredString('Le nom du produit'),
  price: z.number().min(0, 'Le prix doit être positif'),
  stock: z.number().int().min(0, 'Le stock doit être positif'),
  lowStockThreshold: z.number().int().min(0),
  category: requiredString('La catégorie'),
  barcode: z.string().optional(),
  imageUrl: z.string().url('URL invalide').optional().or(z.literal('')),
  popular: z.boolean().optional(),
  unit: z.string().optional(),
  brand: z.string().optional(),
  description: z.string().optional(),
})

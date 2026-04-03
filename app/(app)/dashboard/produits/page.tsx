'use client'

import React, { useState, useEffect } from 'react'
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Pencil,
  Eye,
  Trash,
  Plus,
  Package,
  Image as ImageIcon,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ProductFormModal } from './ProductFormModal'
import { apiClient } from '@/lib/api/client'
import { Product, ProductFormData } from '@/lib/types/product.types'
import { toast } from 'sonner'
import { getStockStatus } from '@/lib/types/product.types'

const allColumns = [
  "Produit",
  "SKU",
  "Marque",
  "Prix",
  "Stock",
  "Statut",
] as const;

export default function ProduitsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [expandedRows, setExpandedRows] = useState<Record<number | string, boolean>>({})
  const [visibleColumns, setVisibleColumns] = useState<string[]>([...allColumns]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      // @ts-ignore
      const res = await apiClient.get<any>('/products', {
        params: {
          search: searchQuery || undefined,
          filter: statusFilter === 'all' ? undefined : statusFilter
        }
      });
      console.log('API Response products:', res);
      // Prise en charge du format { success: true, data: { products: [...], pagination: {...} } }
      let productsList: Product[] = [];
      
      if (res && (res as any).data && Array.isArray((res as any).data.products)) {
        productsList = (res as any).data.products;
      } else if (res && Array.isArray((res as any).data)) {
        productsList = (res as any).data;
      } else if (Array.isArray(res)) {
        productsList = res;
      }
      
      setProducts(productsList);
    } catch (error) {
      console.error('Failed to fetch products', error);
      toast.error('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, statusFilter]);

  const toggleColumn = (col: string) => {
    setVisibleColumns((prev) =>
      prev.includes(col)
        ? prev.filter((c) => c !== col)
        : [...prev, col]
    );
  };

  const toggleRow = (id: string | number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleAddProduct = () => {
    setSelectedProduct(null)
    setIsModalOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleDeleteProduct = async (id: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Voulez-vous vraiment supprimer ce produit ?')) {
      try {
        await apiClient.delete(`/products/${id}`);
        toast.success('Produit supprimé avec succès');
        fetchProducts();
      } catch (error) {
        toast.error('Erreur lors de la suppression du produit');
      }
    }
  }

  const handleFormSubmit = async (data: ProductFormData) => {
    console.log('[Page] handleFormSubmit called, data:', data);
    try {
      if (selectedProduct) {
        await apiClient.put(`/products/${selectedProduct.id}`, data);
        toast.success('Produit modifié avec succès');
      } else {
        console.log('[Page] Creating product at POST /products', data);
        await apiClient.post('/products', data);
        toast.success('Produit créé avec succès');
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (error: any) {
      console.error('[Page] Error saving product:', error);
      toast.error(error?.message || 'Erreur lors de la sauvegarde du produit');
    }
  }

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* ── Page Header ───────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            Produits
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Gérez votre catalogue de produits et de services.
          </p>
        </div>

        <Button
          onClick={handleAddProduct}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium gap-1.5 shadow-sm shadow-indigo-200 shrink-0 h-9"
        >
          <Plus className="h-4 w-4" />
          Ajouter un produit
        </Button>
      </div>

      <div className="container-none space-y-4 p-4 border border-border rounded-lg bg-white shadow-sm overflow-x-auto">
        <div className="flex flex-wrap gap-4 items-center justify-between p-3 mb-4 bg-slate-50 rounded-lg border border-slate-200/60">
          <Input
            placeholder="Rechercher un produit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-80 bg-white"
          />

          <div className="flex gap-2 items-center">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-36 bg-white border-slate-200 shadow-sm font-medium">
                <SelectValue placeholder="Tous" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="active">Actifs</SelectItem>
                <SelectItem value="inactive">Inactifs</SelectItem>
                <SelectItem value="low-stock">Stock bas</SelectItem>
                <SelectItem value="out-of-stock">Rupture</SelectItem>
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="bg-white">
                  Colonnes
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48" align="end">
                {allColumns.map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col}
                    checked={visibleColumns.includes(col)}
                    onCheckedChange={() => toggleColumn(col)}
                  >
                    {col}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" size="icon" onClick={fetchProducts} className="bg-white h-9 w-9">
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
          </div>
        </div>

        <Table className="w-full">
          <TableHeader className="bg-slate-50">
            <TableRow className="hover:bg-transparent border-0">
              <TableHead className="w-20 pl-4 py-3.5">
                <div className="flex items-center gap-2">
                  <Checkbox className="border-slate-400 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 shadow-sm" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tous</span>
                </div>
              </TableHead>
              <TableHead className="w-12"></TableHead>
              {visibleColumns.includes("Produit") && (
                <TableHead className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider py-4">Produit</TableHead>
              )}
              {visibleColumns.includes("SKU") && (
                <TableHead className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">SKU</TableHead>
              )}
              {visibleColumns.includes("Marque") && (
                <TableHead className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-slate-800">
                    Marque <ChevronsUpDown className="h-3.5 w-3.5 text-slate-400" />
                  </div>
                </TableHead>
              )}
              {visibleColumns.includes("Prix") && (
                <TableHead className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-slate-800">
                    Prix <ChevronsUpDown className="h-3.5 w-3.5 text-slate-400" />
                  </div>
                </TableHead>
              )}
              {visibleColumns.includes("Stock") && (
                <TableHead className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-slate-800">
                    Stock <ChevronsUpDown className="h-3.5 w-3.5 text-slate-400" />
                  </div>
                </TableHead>
              )}
              {visibleColumns.includes("Statut") && (
                <TableHead className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-right pr-6">Statut</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-slate-500">
                  Chargement des produits...
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-slate-500">
                  Aucun produit trouvé.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => {
                const isExpanded = !!expandedRows[product.id]
                const images = Array.isArray(product.images) ? product.images : [];
                const productImageUrl = images.length > 0 
                  ? (typeof images[0] === 'string' ? images[0] : (images[0] as any).url)
                  : null;

                return (
                  <React.Fragment key={product.id}>
                    <TableRow
                      className={cn(
                        "group border-b border-slate-100 transition-colors bg-white hover:bg-slate-50",
                        isExpanded && "bg-slate-50/50"
                      )}
                    >
                      <TableCell className="pl-4">
                        <Checkbox className="border-slate-300" />
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => toggleRow(product.id)}
                          className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
                        >
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>
                      </TableCell>
                      {visibleColumns.includes("Produit") && (
                        <TableCell className="py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-slate-100/80 border border-slate-200/60 shrink-0 overflow-hidden">
                              {productImageUrl ? (
                                <img src={productImageUrl} alt={product.name} className="h-full w-full object-cover" />
                              ) : (
                                <Package className="h-4 w-4 text-slate-400" />
                              )}
                            </div>
                            <span className="font-semibold tracking-tight text-slate-800">{product.name}</span>
                          </div>
                        </TableCell>
                      )}
                      {visibleColumns.includes("SKU") && (
                        <TableCell className="text-sm font-medium text-slate-500 whitespace-nowrap">{product.sku || "-"}</TableCell>
                      )}
                      {visibleColumns.includes("Marque") && (
                        <TableCell className="text-sm font-semibold text-slate-700 whitespace-nowrap">{product.metadata?.brand || "-"}</TableCell>
                      )}
                      {visibleColumns.includes("Prix") && (
                        <TableCell className="text-sm font-bold text-slate-700 whitespace-nowrap">{product.price.toLocaleString()} FCFA</TableCell>
                      )}
                      {visibleColumns.includes("Stock") && (
                        <TableCell className="text-sm font-medium text-slate-600 whitespace-nowrap">
                          {product.stock}
                          {product.stock <= product.stockAlert && (
                            <span className="ml-2 text-xs text-red-500 font-semibold">(Alerte)</span>
                          )}
                        </TableCell>
                      )}
                      {visibleColumns.includes("Statut") && (
                        <TableCell className="text-right pr-6 whitespace-nowrap">
                          <Badge
                            variant="secondary"
                            className={cn(
                              "px-2 py-0.5 rounded-md font-medium text-[11px] border-0 capitalize whitespace-nowrap",
                              product.active ? "bg-green-500 text-white" : "bg-slate-500 text-white"
                            )}
                          >
                            {product.active ? "Actif" : "Inactif"}
                          </Badge>
                        </TableCell>
                      )}
                    </TableRow>

                    {/* Expanded Details Row */}
                    {isExpanded && (
                      <TableRow className="bg-white hover:bg-white border-b border-slate-200 p-0">
                        <TableCell colSpan={visibleColumns.length + 2} className="p-0 border-0">
                          <div className="px-6 md:px-14 py-6">
                            
                            {/* Detailed Images */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                              {(product.images?.length ? product.images : [{ url: '' }]).map((img, i) => (
                                <div
                                  key={i}
                                  className="aspect-[4/3] bg-slate-50 rounded-xl flex items-center justify-center relative overflow-hidden group border border-slate-100"
                                >
                                  {(() => {
                                    const url = typeof img === 'string' ? img : (img as any)?.url;
                                    return url ? (
                                      <img src={url} alt={`Image ${i}`} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                    ) : (
                                      <ImageIcon className="h-10 w-10 text-slate-300" />
                                    );
                                  })()}
                                </div>
                              ))}
                            </div>

                            {/* Details Text */}
                            <div className="mb-6">
                              <h4 className="text-sm font-bold text-slate-900 mb-2">Description</h4>
                              <p className="text-sm text-slate-500 leading-relaxed max-w-4xl break-words whitespace-normal">
                                {product.description || "Aucune description fournie pour ce produit."}
                              </p>
                            </div>

                            {/* Attributes Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                              <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100/60">
                                <p className="text-[13px] font-semibold text-slate-900 mb-2">Stock Alert</p>
                                <div className="text-sm text-slate-500 font-medium">
                                  {product.stockAlert} unités
                                </div>
                              </div>
                              <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100/60">
                                <p className="text-[13px] font-semibold text-slate-900 mb-2">Code Barres</p>
                                <div className="text-sm text-slate-500 font-medium">
                                  {product.barcode || "-"}
                                </div>
                              </div>
                              <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100/60">
                                <p className="text-[13px] font-semibold text-slate-900 mb-2">Couleur / Matériau</p>
                                <div className="text-sm text-slate-500 font-medium">
                                  {product.metadata?.color || "-"} / {product.metadata?.material || "-"}
                                </div>
                              </div>
                              <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100/60">
                                <p className="text-[13px] font-semibold text-slate-900 mb-1">Cout d'achat</p>
                                <p className="text-sm text-slate-500 font-medium">{product.costPrice ? `${product.costPrice} FCFA` : "-"}</p>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3">
                              <Button
                                onClick={(e) => { e.stopPropagation(); handleEditProduct(product); }}
                                className="bg-[#1C4ED8] hover:bg-blue-800 text-white gap-1.5 font-medium rounded-lg h-9 w-[88px]"
                              >
                                <Pencil className="h-3.5 w-3.5 -ml-1" />
                                Edit
                              </Button>
                              <Button 
                                variant="destructive" 
                                onClick={(e) => handleDeleteProduct(product.id, e)}
                                className="bg-[#E02424] hover:bg-red-800 gap-1.5 font-medium rounded-lg h-9 w-[104px] text-white"
                              >
                                <Trash className="h-3.5 w-3.5 -ml-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        onSubmit={handleFormSubmit}
      />
    </div>
  )
}

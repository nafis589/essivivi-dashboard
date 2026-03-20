'use client'

import React, { useState } from 'react'
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Pencil,
  Eye,
  Trash,
  Star,
  MapPin,
  Laptop,
  Smartphone,
  Tablet,
  Gamepad2,
  Watch,
  Camera,
  Tv,
  Plus,
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
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ProductFormModal } from './ProductFormModal'

const allColumns = [
  "Product",
  "Category",
  "Brand",
  "Price",
  "Stock",
  "Total Sales",
  "Status",
] as const;

// ─── Mock Data ──────────────────────────────────────────────────────────────

const products = [
  { id: 1, name: 'Apple iMac 27"', category: 'PC', brand: 'Apple', price: '$2999', stock: 200, sales: 245, status: 'Active', icon: Tv },
  { id: 2, name: 'Apple MacBook PRO', category: 'PC', brand: 'Apple', price: '$1499', stock: 1237, sales: 2000, status: 'Active', icon: Laptop },
  { id: 3, name: 'Apple iPhone 14', category: 'Phone', brand: 'Apple', price: '$999', stock: 300, sales: 466, status: 'Inactive', icon: Smartphone },
  { id: 4, name: 'Apple iPad Air', category: 'Tablet', brand: 'Apple', price: '$1199', stock: 4576, sales: 90, status: 'Active', icon: Tablet },
  { id: 5, name: 'Xbox Series S', category: 'Gaming/Console', brand: 'Microsoft', price: '$299', stock: 56, sales: 3087, status: 'Active', icon: Gamepad2 },
  { id: 6, name: 'PlayStation 5', category: 'Gaming/Console', brand: 'Sony', price: '$799', stock: 78, sales: 2999, status: 'Inactive', icon: Gamepad2 },
  { id: 7, name: 'Xbox Series X', category: 'Gaming/Console', brand: 'Microsoft', price: '$699', stock: 200, sales: 1870, status: 'Active', icon: Gamepad2 },
  { id: 8, name: 'Apple Watch SE', category: 'Watch', brand: 'Apple', price: '$399', stock: 657, sales: 5067, status: 'Active', icon: Watch },
  { id: 9, name: 'iPad Pro 13-Inch (M4)', category: 'Photo', brand: 'Nikon', price: '$599', stock: 465, sales: 1870, status: 'Inactive', icon: Camera },
  { id: 10, name: 'Apple iMac 20"', category: 'TV/Monitor', brand: 'BenQ', price: '$499', stock: 354, sales: 76, status: 'Active', icon: Tv },
]

export default function ProduitsPage() {
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({
    1: true,
  })

  const [visibleColumns, setVisibleColumns] = useState<string[]>([...allColumns]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const filteredProducts = products.filter((p) => {
    return (
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (!categoryFilter || p.category.toLowerCase().includes(categoryFilter.toLowerCase()))
    );
  });

  const toggleColumn = (col: string) => {
    setVisibleColumns((prev) =>
      prev.includes(col)
        ? prev.filter((c) => c !== col)
        : [...prev, col]
    );
  };

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null)

  const toggleRow = (id: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleAddProduct = () => {
    setSelectedProduct(null)
    setIsModalOpen(true)
  }

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
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

      <div className="container-none space-y-4 p-4 border border-border rounded-lg bg-background shadow-sm overflow-x-auto">
        <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
          <div className="flex gap-2 flex-wrap">
            <Input
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48"
            />
            <Input
              placeholder="Catégorie..."
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-48"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
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
        </div>

        <Table className="w-full">
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-0">
              <TableHead className="w-12 pl-4 py-3.5">
                <Checkbox className="border-slate-300" />
              </TableHead>
              <TableHead className="w-12"></TableHead>
              {visibleColumns.includes("Product") && (
                <TableHead className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider py-4">Product</TableHead>
              )}
              {visibleColumns.includes("Category") && (
                <TableHead className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-slate-800">
                    Category <ChevronsUpDown className="h-3.5 w-3.5 text-slate-400" />
                  </div>
                </TableHead>
              )}
              {visibleColumns.includes("Brand") && (
                <TableHead className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-slate-800">
                    Brand <ChevronsUpDown className="h-3.5 w-3.5 text-slate-400" />
                  </div>
                </TableHead>
              )}
              {visibleColumns.includes("Price") && (
                <TableHead className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-slate-800">
                    Price <ChevronsUpDown className="h-3.5 w-3.5 text-slate-400" />
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
              {visibleColumns.includes("Total Sales") && (
                <TableHead className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-slate-800">
                    Total Sales <ChevronsUpDown className="h-3.5 w-3.5 text-slate-400" />
                  </div>
                </TableHead>
              )}
              {visibleColumns.includes("Status") && (
                <TableHead className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-right pr-6">Status</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => {
              const isExpanded = !!expandedRows[product.id]
              const Icon = product.icon
              return (
                <React.Fragment key={product.id}>
                  <TableRow
                    className={`group border-b border-slate-100 transition-colors ${isExpanded ? 'bg-slate-50/50 hover:bg-slate-50/50' : 'hover:bg-slate-50/50'
                      }`}
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
                    {visibleColumns.includes("Product") && (
                      <TableCell className="py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-slate-100/80 border border-slate-200/60 shrink-0">
                            <Icon className="h-4 w-4 text-slate-400" />
                          </div>
                          <span className="font-semibold tracking-tight text-slate-800">{product.name}</span>
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.includes("Category") && (
                      <TableCell className="text-sm font-medium text-slate-500 whitespace-nowrap">{product.category}</TableCell>
                    )}
                    {visibleColumns.includes("Brand") && (
                      <TableCell className="text-sm font-semibold text-slate-700 whitespace-nowrap">{product.brand}</TableCell>
                    )}
                    {visibleColumns.includes("Price") && (
                      <TableCell className="text-sm font-bold text-slate-700 whitespace-nowrap">{product.price}</TableCell>
                    )}
                    {visibleColumns.includes("Stock") && (
                      <TableCell className="text-sm font-medium text-slate-600 whitespace-nowrap">{product.stock}</TableCell>
                    )}
                    {visibleColumns.includes("Total Sales") && (
                      <TableCell className="text-sm font-medium text-slate-600 whitespace-nowrap">{product.sales}</TableCell>
                    )}
                    {visibleColumns.includes("Status") && (
                      <TableCell className="text-right pr-6 whitespace-nowrap">
                        <Badge
                          variant="secondary"
                          className={cn(
                            "px-2 py-0.5 rounded-md font-medium text-[11px] border-0 capitalize whitespace-nowrap",
                            product.status === "Active" ? "bg-green-500 text-white" : "bg-red-500 text-white"
                          )}
                        >
                          {product.status}
                        </Badge>
                      </TableCell>
                    )}
                  </TableRow>

                  {/* Expanded Details Row */}
                  {isExpanded && (
                    <TableRow className="bg-white hover:bg-white border-b border-slate-200 p-0">
                      <TableCell colSpan={visibleColumns.length + 2} className="p-0 border-0">
                        <div className="px-6 md:px-14 py-6">
                          {/* Top Images */}
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            {[1, 2, 3, 4].map((i) => (
                              <div
                                key={i}
                                className="aspect-[4/3] bg-slate-50 rounded-xl flex items-center justify-center relative overflow-hidden group border border-slate-100"
                              >
                                <Icon className="h-10 w-10 text-slate-300 transition-transform group-hover:scale-110" />
                              </div>
                            ))}
                          </div>

                          {/* Details Text */}
                          <div className="mb-6">
                            <h4 className="text-sm font-bold text-slate-900 mb-2">Details</h4>
                            <p className="text-sm text-slate-500 leading-relaxed max-w-4xl break-words whitespace-normal">
                              Standard glass, 3.8GHz 8-core 10th-generation Intel Core i7 processor, Turbo Boost up to 5.0GHz,
                              16GB 2666MHz DDR4 memory, Radeon Pro 5500 XT with 8GB of GDDR6 memory, 256GB SSD storage,
                              Gigabit Ethernet, Magic Mouse 2, Magic Keyboard - US.
                            </p>
                          </div>

                          {/* Attributes Grid */}
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100/60">
                              <p className="text-[13px] font-semibold text-slate-900 mb-2">Product State</p>
                              <div className="inline-flex items-center gap-1 bg-[#E1EFFE] text-[#1E429F] text-xs font-semibold px-2 py-1 rounded-md">
                                <Star className="h-3 w-3 fill-current" />
                                New
                              </div>
                            </div>
                            <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100/60">
                              <p className="text-[13px] font-semibold text-slate-900 mb-2">Shipping</p>
                              <div className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
                                <MapPin className="h-4 w-4" /> Worldwide
                              </div>
                            </div>
                            <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100/60">
                              <p className="text-[13px] font-semibold text-slate-900 mb-2">Colors</p>
                              <div className="flex gap-1.5">
                                {['bg-[#8B5CF6]', 'bg-[#93C5FD]', 'bg-[#2563EB]', 'bg-[#F472B6]', 'bg-[#67E8F9]', 'bg-[#6EE7B7]'].map(
                                  (colorClass, idx) => (
                                    <div key={idx} className={`h-4 w-4 rounded-full ${colorClass}`} />
                                  )
                                )}
                              </div>
                            </div>
                            <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100/60">
                              <p className="text-[13px] font-semibold text-slate-900 mb-1">Brand</p>
                              <p className="text-sm text-slate-500 font-medium">{product.brand}</p>
                            </div>
                            <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100/60">
                              <p className="text-[13px] font-semibold text-slate-900 mb-1">Sold by</p>
                              <p className="text-sm text-slate-500 font-medium">Flowbite</p>
                            </div>
                            <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100/60">
                              <p className="text-[13px] font-semibold text-slate-900 mb-1">Ships from</p>
                              <p className="text-sm text-slate-500 font-medium">Flowbite</p>
                            </div>
                            <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100/60">
                              <p className="text-[13px] font-semibold text-slate-900 mb-1">Dimensions (cm)</p>
                              <p className="text-sm text-slate-500 font-medium">105 × 15 × 23</p>
                            </div>
                            <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100/60">
                              <p className="text-[13px] font-semibold text-slate-900 mb-1">Item weight</p>
                              <p className="text-sm text-slate-500 font-medium">12kg</p>
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
                            <Button variant="outline" className="gap-1.5 font-medium text-slate-900 border-slate-200 hover:bg-slate-50 rounded-lg h-9 w-[100px]">
                              <Eye className="h-3.5 w-3.5 -ml-1" />
                              Preview
                            </Button>
                            <Button variant="destructive" className="bg-[#E02424] hover:bg-red-800 gap-1.5 font-medium rounded-lg h-9 w-[104px] text-white">
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
            })}
          </TableBody>
        </Table>
      </div>

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
      />
    </div>
  )
}

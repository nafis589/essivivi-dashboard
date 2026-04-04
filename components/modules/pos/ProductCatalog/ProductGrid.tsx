"use client";

import { useState, useMemo, useCallback, RefObject, useEffect } from "react";
import type { POSProduct } from "@/lib/types/pos.types";
import { useCartStore } from "@/lib/store/useCartStore";
import { fetchPOSProducts } from "@/lib/modules/pos/api";
import { ProductCard } from "./ProductCard";
import { ProductSearch } from "./ProductSearch";
import { ProductFilters } from "./ProductFilters";
import { QuantityModal } from "./QuantityModal";
import { toast } from "sonner";
import { PackageSearch, Package, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductGridProps {
    searchRef?: RefObject<HTMLInputElement | null>;
}

// Skeleton card for loading state
function ProductCardSkeleton() {
    return (
        <div className="rounded-xl border bg-card overflow-hidden animate-pulse">
            <div className="aspect-square bg-muted/60" />
            <div className="p-2.5 space-y-2">
                <div className="h-2.5 bg-muted rounded w-1/2" />
                <div className="h-3.5 bg-muted rounded w-3/4" />
                <div className="h-3.5 bg-muted rounded w-1/3" />
            </div>
        </div>
    );
}

export function ProductGrid({ searchRef }: ProductGridProps) {
    const [products, setProducts] = useState<POSProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedProduct, setSelectedProduct] = useState<POSProduct | null>(null);
    const [isQuantityModalOpen, setIsQuantityModalOpen] = useState(false);

    const addItem = useCartStore((state) => state.addItem);

    // Charger les produits depuis l'API
    const loadProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetchPOSProducts({ limit: 100 });
            
            let rawData: any[] = [];
            if (response && (response as any).data && Array.isArray((response as any).data.products)) {
                rawData = (response as any).data.products;
            } else if (response && Array.isArray((response as any).data)) {
                rawData = (response as any).data;
            } else if (Array.isArray(response)) {
                rawData = response;
            }

            // On normalise id en number pour compatibilité avec POSProduct
            const items: import('@/lib/types/pos.types').POSProduct[] = rawData.map((p) => ({
                ...p,
                id: Number(p.id),
                stockAlert: p.stockAlert ?? p.lowStockThreshold ?? 5,
                images: p.images ?? [],
            }));
            setProducts(items);
        } catch (err: unknown) {
            const msg = err && typeof err === "object" && "message" in err
                ? String((err as { message: string }).message)
                : "Impossible de charger les produits";
            setError(msg);
            toast.error("Erreur de chargement", { description: msg });
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    const categories = useMemo(() => {
        const set = new Set(
            products
                .filter((p) => p.category)
                .map((p) => p.category as string)
        );
        return Array.from(set).sort();
    }, [products]);

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            // Filtre stock bas
            if (selectedCategory === "low_stock") {
                if (product.stock === 0 || product.stock > product.stockAlert) return false;
            } else if (selectedCategory !== "all") {
                if (product.category !== selectedCategory) return false;
            }

            // Filtre recherche (uniquement en local car les produits sont déjà chargés)
            if (searchTerm) {
                const lower = searchTerm.toLowerCase();
                return (
                    product.name.toLowerCase().includes(lower) ||
                    (product.barcode?.includes(searchTerm) ?? false) ||
                    (product.category?.toLowerCase().includes(lower) ?? false)
                );
            }

            return true;
        });
    }, [products, searchTerm, selectedCategory]);

    // Précomputer les compteurs par filtre
    const counts = useMemo(() => {
        const result: { all: number; popular: number; low_stock: number; [key: string]: number } = {
            all: products.length,
            popular: 0, // Non géré côté backend pour le moment
            low_stock: products.filter(
                (p) => p.stock > 0 && p.stock <= p.stockAlert
            ).length,
        };
        categories.forEach((cat) => {
            result[cat] = products.filter((p) => p.category === cat).length;
        });
        return result;
    }, [products, categories]);

    const handleProductClick = useCallback(
        (product: POSProduct) => {
            const result = addItem(product, 1);
            if (!result.success && result.message) {
                toast.error(result.message, { duration: 2500 });
            } else if (result.success) {
                toast.success(`${product.name} ajouté`, {
                    duration: 1500,
                    position: "bottom-center",
                });
            }
        },
        [addItem]
    );

    const handleProductLongPress = useCallback((product: POSProduct) => {
        if (product.stock > 0) {
            setSelectedProduct(product);
            setIsQuantityModalOpen(true);
        }
    }, []);

    const handleQuantityConfirm = useCallback(
        (quantity: number) => {
            if (selectedProduct) {
                const result = addItem(selectedProduct, quantity);
                if (!result.success && result.message) {
                    toast.error(result.message, { duration: 2500 });
                } else {
                    toast.success(`${selectedProduct.name} × ${quantity} ajouté`, {
                        duration: 1500,
                        position: "bottom-center",
                    });
                }
            }
        },
        [selectedProduct, addItem]
    );

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Search + Filters bar */}
            <div className="shrink-0 bg-card/80 backdrop-blur-sm px-4 py-3 space-y-2 sticky top-0 z-30">
                <ProductSearch
                    value={searchValue}
                    onChange={setSearchValue}
                    onSearch={setSearchTerm}
                    searchRef={searchRef}
                />
                <ProductFilters
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                    counts={counts}
                />
            </div>

            {/* Product Grid */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
                {isLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <ProductCardSkeleton key={i} />
                        ))}
                    </div>
                ) : error ? (
                    <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-muted-foreground gap-4">
                        <div className="h-16 w-16 bg-destructive/10 rounded-full flex items-center justify-center">
                            <Package className="h-8 w-8 text-destructive/50" />
                        </div>
                        <div className="text-center">
                            <p className="font-semibold text-foreground">Erreur de chargement</p>
                            <p className="text-sm mt-1 max-w-xs">{error}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={loadProducts}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Réessayer
                        </Button>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-muted-foreground gap-3">
                        <div className="h-16 w-16 bg-muted/50 rounded-full flex items-center justify-center">
                            {searchTerm ? (
                                <PackageSearch className="h-8 w-8 text-muted-foreground/50" />
                            ) : (
                                <Package className="h-8 w-8 text-muted-foreground/50" />
                            )}
                        </div>
                        <div className="text-center">
                            <p className="font-semibold text-foreground">
                                {searchTerm ? "Aucun produit trouvé" : "Aucun produit dans cette catégorie"}
                            </p>
                            <p className="text-sm mt-1">
                                {searchTerm
                                    ? `Aucun résultat pour "${searchTerm}"`
                                    : "Essayez un autre filtre"}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {filteredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onClick={() => handleProductClick(product)}
                                onLongPress={() => handleProductLongPress(product)}
                            />
                        ))}
                    </div>
                )}
            </div>

            <QuantityModal
                product={selectedProduct}
                isOpen={isQuantityModalOpen}
                onClose={() => setIsQuantityModalOpen(false)}
                onConfirm={handleQuantityConfirm}
            />
        </div>
    );
}

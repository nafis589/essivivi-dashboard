"use client";

import { useState, useMemo, useCallback, RefObject } from "react";
import { Product } from "@/lib/types/pos";
import { useCartStore } from "@/lib/store/useCartStore";
import { ProductCard } from "./ProductCard";
import { ProductSearch } from "./ProductSearch";
import { ProductFilters } from "./ProductFilters";
import { QuantityModal } from "./QuantityModal";
import { toast } from "sonner";
import { PackageSearch, Package } from "lucide-react";

interface ProductGridProps {
    products: Product[];
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

export function ProductGrid({ products, searchRef }: ProductGridProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isQuantityModalOpen, setIsQuantityModalOpen] = useState(false);
    const [isLoading] = useState(false); // Would be true when fetching from API

    const addItem = useCartStore((state) => state.addItem);

    const categories = useMemo(() => {
        const set = new Set(products.map((p) => p.category));
        return Array.from(set).sort();
    }, [products]);

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            // Quick filter
            if (selectedCategory === "low_stock") {
                if (product.stock === 0 || product.stock > product.lowStockThreshold) return false;
            } else if (selectedCategory === "popular") {
                if (!product.popular) return false;
            } else if (selectedCategory !== "all") {
                if (product.category !== selectedCategory) return false;
            }

            // Search filter
            if (searchTerm) {
                const lower = searchTerm.toLowerCase();
                return (
                    product.name.toLowerCase().includes(lower) ||
                    product.barcode.includes(searchTerm) ||
                    product.category.toLowerCase().includes(lower)
                );
            }

            return true;
        });
    }, [products, searchTerm, selectedCategory]);

    // Precompute counts for each filter
    const counts = useMemo(() => {
        const result: Record<string, number> = {
            all: products.length,
            popular: products.filter((p) => p.popular).length,
            low_stock: products.filter(
                (p) => p.stock > 0 && p.stock <= p.lowStockThreshold
            ).length,
        };
        categories.forEach((cat) => {
            result[cat] = products.filter((p) => p.category === cat).length;
        });
        return result;
    }, [products, categories]);

    const handleProductClick = useCallback(
        (product: Product) => {
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

    const handleProductLongPress = useCallback((product: Product) => {
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
            <div className="shrink-0 bg-card/80 backdrop-blur-sm border-b px-4 py-3 space-y-2 sticky top-0 z-30">
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

            {/* Results info bar */}
            <div className="shrink-0 flex items-center justify-between px-4 py-2 text-xs text-muted-foreground border-b bg-muted/20">
                <span>
                    {filteredProducts.length === products.length
                        ? `${products.length} produits`
                        : `${filteredProducts.length} résultat${filteredProducts.length > 1 ? "s" : ""} sur ${products.length}`}
                </span>
                {searchTerm && (
                    <span className="font-medium text-foreground">
                        &ldquo;{searchTerm}&rdquo;
                    </span>
                )}
                <span className="hidden sm:inline text-[11px]">
                    Clic long → choisir quantité
                </span>
            </div>

            {/* Product Grid */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
                {isLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <ProductCardSkeleton key={i} />
                        ))}
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

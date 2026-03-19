"use client";

import { useRef, useEffect, useCallback } from "react";
import { Search, X, ScanBarcode } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ProductSearchProps {
    onSearch: (term: string) => void;
    searchRef?: React.RefObject<HTMLInputElement | null>;
    value: string;
    onChange: (value: string) => void;
}

export function ProductSearch({ onSearch, searchRef, value, onChange }: ProductSearchProps) {
    const internalRef = useRef<HTMLInputElement>(null);
    const ref = searchRef ?? internalRef;

    // Debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(value);
        }, 300);
        return () => clearTimeout(timer);
    }, [value, onSearch]);

    const handleClear = useCallback(() => {
        onChange("");
        ref.current?.focus();
    }, [onChange, ref]);

    return (
        <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
                ref={ref}
                id="pos-product-search"
                type="search"
                placeholder="Rechercher par nom ou code-barres… (touche /)"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="pl-9 pr-10 h-10 bg-background border-border focus-visible:ring-primary focus-visible:border-primary transition-colors"
                aria-label="Rechercher un produit"
                autoComplete="off"
            />
            {value && (
                <button
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    aria-label="Effacer la recherche"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}

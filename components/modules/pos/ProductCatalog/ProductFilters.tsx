"use client";

import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
    LayoutGrid,
    TrendingUp,
    AlertTriangle,
    Sparkles,
} from "lucide-react";

interface ProductFiltersProps {
    categories: string[];
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
    counts: {
        all: number;
        popular: number;
        low_stock: number;
        [key: string]: number;
    };
}

const quickFilters = [
    { key: "all", label: "Tous", icon: LayoutGrid },
    { key: "popular", label: "Populaires", icon: TrendingUp },
    { key: "low_stock", label: "Stock bas", icon: AlertTriangle },
];

export function ProductFilters({
    categories,
    selectedCategory,
    onSelectCategory,
    counts,
}: ProductFiltersProps) {
    return (
        <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex items-center gap-2 py-1 w-max">
                {/* Quick filters */}
                {quickFilters.map(({ key, label, icon: Icon }) => {
                    const count = counts[key] ?? 0;
                    const isActive = selectedCategory === key;
                    return (
                        <button
                            key={key}
                            onClick={() => onSelectCategory(key)}
                            aria-pressed={isActive}
                            className={cn(
                                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium",
                                "transition-all duration-150 cursor-pointer whitespace-nowrap",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                                    : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                            )}
                        >
                            <Icon className="h-3.5 w-3.5" />
                            {label}
                            <span
                                className={cn(
                                    "text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none",
                                    isActive
                                        ? "bg-primary-foreground/20 text-primary-foreground"
                                        : "bg-muted text-muted-foreground"
                                )}
                            >
                                {count}
                            </span>
                        </button>
                    );
                })}

                {/* Separator */}
                <div className="w-px h-5 bg-border mx-1 shrink-0" />

                {/* Category filters */}
                {categories.map((category) => {
                    const count = counts[category] ?? 0;
                    const isActive = selectedCategory === category;
                    return (
                        <button
                            key={category}
                            onClick={() => onSelectCategory(category)}
                            aria-pressed={isActive}
                            className={cn(
                                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium",
                                "transition-all duration-150 cursor-pointer whitespace-nowrap",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                                    : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                            )}
                        >
                            <Sparkles className="h-3.5 w-3.5" />
                            {category}
                            <span
                                className={cn(
                                    "text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none",
                                    isActive
                                        ? "bg-primary-foreground/20 text-primary-foreground"
                                        : "bg-muted text-muted-foreground"
                                )}
                            >
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>
            <ScrollBar orientation="horizontal" className="invisible h-1.5" />
        </ScrollArea>
    );
}

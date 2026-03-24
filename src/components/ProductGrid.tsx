import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const ProductGrid = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const categories = [
    "All",
    ...Array.from(new Set(products.map((p: any) => p.category))),
  ];

  const filtered =
    activeCategory === "All"
      ? products
      : products.filter((p: any) => p.category === activeCategory);

  return (
    <section id="shop" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="mb-3 inline-block rounded-full bg-coffee/20 px-4 py-1.5 text-sm font-medium text-coffee-foreground">
            🛍️ Our Collection
          </span>
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Shop Handmade Goodies
          </h2>
          <p className="mx-auto max-w-lg text-muted-foreground">
            Every piece is lovingly handcrafted. Pick your fave or request a custom one!
          </p>
        </motion.div>

        {categories.length > 1 && (
          <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-secondary text-secondary-foreground hover:bg-primary/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="py-16 text-center">
            <span className="text-4xl">🐰</span>
            <p className="mt-2 text-muted-foreground">Loading goodies...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <span className="text-4xl">🌸</span>
            <p className="mt-2 text-muted-foreground">No products yet — check back soon!</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product: any) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                image={product.image_url}
                price={product.price}
                originalPrice={product.original_price}
                category={product.category}
                isNew={product.is_new}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;

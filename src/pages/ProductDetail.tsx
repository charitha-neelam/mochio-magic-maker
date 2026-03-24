import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Minus, Plus, ShoppingBag, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Set default color once loaded
  if (product && !selectedColor && product.colors?.length > 0) {
    setSelectedColor(product.colors[0]);
  }

  const handleAddToCart = () => {
    if (!product) return;
    if (product.colors?.length > 0 && !selectedColor) {
      toast({ title: "Please select a colour", variant: "destructive" });
      return;
    }
    addItem({
      productId: product.id,
      name: product.name,
      image: product.image_url,
      price: product.price,
      color: selectedColor || "Default",
      quantity,
    });
    toast({ title: "Added to cart! 🛒", description: `${quantity}x ${product.name}` });
    setQuantity(1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <span className="text-4xl">🐰</span>
          <p className="ml-3 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <span className="text-5xl">🌸</span>
          <p className="mt-3 font-display text-lg font-semibold text-foreground">Product not found</p>
          <Link to="/" className="mt-4 text-sm text-primary hover:underline">← Back to shop</Link>
        </div>
      </div>
    );
  }

  const hasDiscount = product.original_price && product.original_price > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to shop
        </Link>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="overflow-hidden rounded-2xl border border-border bg-card"
          >
            <img
              src={product.image_url}
              alt={product.name}
              className="aspect-square w-full object-cover"
            />
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-4"
          >
            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {product.category}
              </p>
              <h1 className="font-display text-3xl font-bold text-foreground">
                {product.name}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-display text-2xl font-bold text-warm-brown">
                ₹{product.price}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    ₹{product.original_price}
                  </span>
                  <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
                    -{discountPercent}%
                  </span>
                </>
              )}
            </div>

            {product.description && (
              <p className="text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            )}

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium text-foreground">
                  Colour: <span className="text-muted-foreground">{selectedColor}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color: string) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`rounded-full border-2 px-4 py-1.5 text-sm font-medium transition-all ${
                        selectedColor === color
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border bg-card text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {selectedColor === color && <Check className="mr-1 inline h-3 w-3" />}
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock */}
            {product.stock !== null && product.stock !== undefined && (
              <p className="text-xs text-muted-foreground">
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </p>
            )}

            {/* Quantity */}
            <div>
              <p className="mb-2 text-sm font-medium text-foreground">Quantity</p>
              <div className="inline-flex items-center gap-0 rounded-full border border-border bg-card">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-l-full text-muted-foreground transition-colors hover:bg-secondary"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="flex h-10 w-12 items-center justify-center font-display text-sm font-semibold text-foreground">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-r-full text-muted-foreground transition-colors hover:bg-secondary"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="mt-2 gap-2 rounded-full text-base"
              size="lg"
            >
              <ShoppingBag className="h-5 w-5" />
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;

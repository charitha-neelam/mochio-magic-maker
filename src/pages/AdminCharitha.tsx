import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Pencil, ArrowLeft } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const CATEGORIES = ["Phone Charms", "Bracelets", "Custom Polaroids", "Crochet"];

interface Product {
  id: string;
  name: string;
  description: string | null;
  image_url: string;
  price: number;
  original_price: number | null;
  category: string;
  is_new: boolean;
  created_at: string;
}

const AdminCharitha = () => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [isNew, setIsNew] = useState(false);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const resetForm = () => {
    setName("");
    setDescription("");
    setImageUrl("");
    setPrice("");
    setOriginalPrice("");
    setCategory(CATEGORIES[0]);
    setIsNew(false);
    setEditingId(null);
  };

  const fillForm = (p: Product) => {
    setEditingId(p.id);
    setName(p.name);
    setDescription(p.description || "");
    setImageUrl(p.image_url);
    setPrice(String(p.price));
    setOriginalPrice(p.original_price ? String(p.original_price) : "");
    setCategory(p.category);
    setIsNew(p.is_new);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: name.trim(),
        description: description.trim() || null,
        image_url: imageUrl.trim(),
        price: Number(price),
        original_price: originalPrice ? Number(originalPrice) : null,
        category,
        is_new: isNew,
      };

      if (editingId) {
        const { error } = await supabase
          .from("products")
          .update(payload)
          .eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({
        title: editingId ? "Product updated! ✏️" : "Product created! 🎉",
        description: `${name} has been ${editingId ? "updated" : "added"} to the store.`,
      });
      resetForm();
    },
    onError: (err: Error) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Product deleted 🗑️" });
    },
    onError: (err: Error) => {
      toast({
        title: "Error deleting",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !imageUrl.trim() || !price) {
      toast({
        title: "Missing fields",
        description: "Name, image URL, and price are required.",
        variant: "destructive",
      });
      return;
    }
    saveMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8 flex items-center gap-3">
          <Link
            to="/"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              🐰 Mochio Admin
            </h1>
            <p className="text-sm text-muted-foreground">
              Add, edit, or remove products from your store
            </p>
          </div>
        </div>

        {/* Product Form */}
        <form
          onSubmit={handleSubmit}
          className="mb-10 rounded-2xl border border-border bg-card p-6 shadow-sm"
        >
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
            {editingId ? "✏️ Edit Product" : "➕ Add New Product"}
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Blossom Phone Charm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="price">Price (₹) *</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="249"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="originalPrice">
                Original Price (₹){" "}
                <span className="text-muted-foreground">(for discount)</span>
              </Label>
              <Input
                id="originalPrice"
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="349"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="imageUrl">Image URL *</Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/product.jpg"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A lovely handmade piece..."
                rows={3}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isNew"
                checked={isNew}
                onChange={(e) => setIsNew(e.target.checked)}
                className="h-4 w-4 rounded border-input"
              />
              <Label htmlFor="isNew" className="cursor-pointer">
                Mark as New ✨
              </Label>
            </div>
          </div>

          {imageUrl && (
            <div className="mt-4">
              <p className="mb-1 text-xs text-muted-foreground">Preview:</p>
              <img
                src={imageUrl}
                alt="Preview"
                className="h-32 w-32 rounded-lg border border-border object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <Button
              type="submit"
              disabled={saveMutation.isPending}
              className="gap-2 rounded-full"
            >
              <Plus className="h-4 w-4" />
              {editingId ? "Update Product" : "Add Product"}
            </Button>
            {editingId && (
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                className="rounded-full"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>

        {/* Product List */}
        <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
          📦 All Products ({products.length})
        </h2>

        {isLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <span className="mb-2 block text-4xl">🐰</span>
            <p className="font-display font-semibold text-foreground">
              No products yet!
            </p>
            <p className="text-sm text-muted-foreground">
              Add your first product using the form above.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-3 shadow-sm"
              >
                <img
                  src={p.image_url}
                  alt={p.name}
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-display text-sm font-semibold text-foreground">
                      {p.name}
                    </p>
                    {p.is_new && (
                      <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium text-accent-foreground">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{p.category}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-warm-brown">
                      ₹{p.price}
                    </span>
                    {p.original_price && (
                      <span className="text-xs text-muted-foreground line-through">
                        ₹{p.original_price}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => fillForm(p)}
                    className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete "${p.name}"?`)) {
                        deleteMutation.mutate(p.id);
                      }
                    }}
                    className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCharitha;

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Pencil, ArrowLeft, X, GripVertical, Upload, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const CATEGORIES = ["Phone Charms", "Bracelets", "Neckpieces", "Crochet", "Customized Polaroids", "Accessories"];

interface Product {
  id: string;
  name: string;
  description: string | null;
  image_url: string;
  images: string[] | null;
  price: number;
  original_price: number | null;
  category: string;
  is_new: boolean;
  colors: string[] | null;
  stock: number | null;
  color_stock: Record<string, number> | null;
  display_order: number | null;
  created_at: string;
}

const SortableRow = ({ p, onEdit, onDelete }: { p: Product; onEdit: (p: Product) => void; onDelete: (p: Product) => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: p.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
      <button {...attributes} {...listeners} className="cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing">
        <GripVertical className="h-5 w-5" />
      </button>
      <img src={p.image_url} alt={p.name} className="h-16 w-16 rounded-lg object-cover" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-display text-sm font-semibold text-foreground truncate">{p.name}</p>
          {p.is_new && <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium text-accent-foreground">New</span>}
          {p.images && p.images.length > 0 && (
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">+{p.images.length} imgs</span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{p.category}</p>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-warm-brown">₹{p.price}</span>
          {p.original_price && <span className="text-xs text-muted-foreground line-through">₹{p.original_price}</span>}
        </div>
      </div>
      <div className="flex gap-1.5">
        <button onClick={() => onEdit(p)} className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
          <Pencil className="h-4 w-4" />
        </button>
        <button onClick={() => onDelete(p)} className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const AdminCharitha = () => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [extraImages, setExtraImages] = useState<string[]>([]);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingExtra, setUploadingExtra] = useState(false);
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [isNew, setIsNew] = useState(false);
  const [colors, setColors] = useState<string[]>([]);
  const [colorInput, setColorInput] = useState("");
  const [colorStock, setColorStock] = useState<Record<string, string>>({});

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const [ordered, setOrdered] = useState<Product[]>([]);
  useEffect(() => { setOrdered(products); }, [products]);

  const resetForm = () => {
    setName(""); setDescription(""); setImageUrl(""); setExtraImages([]);
    setPrice(""); setOriginalPrice(""); setCategory(CATEGORIES[0]);
    setIsNew(false); setColors([]); setColorInput(""); setColorStock({}); setEditingId(null);
  };

  const fillForm = (p: Product) => {
    setEditingId(p.id);
    setName(p.name);
    setDescription(p.description || "");
    setImageUrl(p.image_url);
    setExtraImages(p.images || []);
    setPrice(String(p.price));
    setOriginalPrice(p.original_price ? String(p.original_price) : "");
    setCategory(p.category);
    setIsNew(p.is_new);
    setColors(p.colors || []);
    const cs: Record<string, string> = {};
    (p.colors || []).forEach((c) => {
      const v = p.color_stock?.[c];
      cs[c] = v !== undefined && v !== null ? String(v) : "";
    });
    setColorStock(cs);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addColor = () => {
    const c = colorInput.trim();
    if (c && !colors.includes(c)) {
      setColors([...colors, c]);
      setColorStock((prev) => ({ ...prev, [c]: prev[c] ?? "" }));
    }
    setColorInput("");
  };
  const removeColor = (c: string) => {
    setColors(colors.filter((x) => x !== c));
    setColorStock((prev) => {
      const next = { ...prev };
      delete next[c];
      return next;
    });
  };

  const removeExtraImage = (url: string) => setExtraImages(extraImages.filter((x) => x !== url));

  const uploadFile = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });
    if (error) throw error;
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleMainUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingMain(true);
    try {
      const url = await uploadFile(file);
      setImageUrl(url);
      toast({ title: "Main image uploaded! 📸" });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploadingMain(false);
      e.target.value = "";
    }
  };

  const handleExtraUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploadingExtra(true);
    try {
      const urls = await Promise.all(files.map((f) => uploadFile(f)));
      setExtraImages((prev) => [...prev, ...urls.filter((u) => !prev.includes(u))]);
      toast({ title: `Uploaded ${urls.length} image${urls.length > 1 ? "s" : ""}! 🖼️` });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploadingExtra(false);
      e.target.value = "";
    }
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const cs: Record<string, number> = {};
      let totalStock = 0;
      colors.forEach((c) => {
        const n = Number(colorStock[c] ?? 0);
        cs[c] = isNaN(n) ? 0 : n;
        totalStock += cs[c];
      });
      const payload = {
        name: name.trim(),
        description: description.trim() || null,
        image_url: imageUrl.trim(),
        images: extraImages.length > 0 ? extraImages : null,
        price: Number(price),
        original_price: originalPrice ? Number(originalPrice) : null,
        category,
        is_new: isNew,
        colors: colors.length > 0 ? colors : null,
        color_stock: colors.length > 0 ? cs : {},
        stock: colors.length > 0 ? totalStock : null,
      };
      if (editingId) {
        const { error } = await supabase.from("products").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const nextOrder = (products[products.length - 1]?.display_order ?? products.length) + 1;
        const { error } = await supabase.from("products").insert({ ...payload, display_order: nextOrder });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: editingId ? "Product updated! ✏️" : "Product created! 🎉" });
      resetForm();
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
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
    onError: (err: Error) => toast({ title: "Error deleting", description: err.message, variant: "destructive" }),
  });

  const reorderMutation = useMutation({
    mutationFn: async (items: Product[]) => {
      // Update display_order for each product
      await Promise.all(
        items.map((p, idx) =>
          supabase.from("products").update({ display_order: idx + 1 }).eq("id", p.id)
        )
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Order saved! ✨" });
    },
    onError: (err: Error) => toast({ title: "Error reordering", description: err.message, variant: "destructive" }),
  });

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = ordered.findIndex((p) => p.id === active.id);
    const newIndex = ordered.findIndex((p) => p.id === over.id);
    const next = arrayMove(ordered, oldIndex, newIndex);
    setOrdered(next);
    reorderMutation.mutate(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !imageUrl.trim() || !price) {
      toast({ title: "Missing fields", description: "Name, image URL, and price are required.", variant: "destructive" });
      return;
    }
    saveMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8 flex items-center gap-3">
          <Link to="/" className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">🐰 Mochio Admin</h1>
            <p className="text-sm text-muted-foreground">Drag products to reorder by priority 🎯</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mb-10 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
            {editingId ? "✏️ Edit Product" : "➕ Add New Product"}
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Product Name *</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Blossom Neckpiece" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="category">Category</Label>
              <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="price">Price (₹) *</Label>
              <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="249" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="originalPrice">Original Price (₹)</Label>
              <Input id="originalPrice" type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} placeholder="349" />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label>Colours</Label>
              <div className="flex gap-2">
                <Input value={colorInput} onChange={(e) => setColorInput(e.target.value)} placeholder="e.g. Pink" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addColor(); } }} />
                <Button type="button" variant="outline" size="sm" onClick={addColor} className="shrink-0"><Plus className="h-4 w-4" /></Button>
              </div>
              {colors.length > 0 && (
                <div className="mt-2 space-y-2">
                  <p className="text-xs text-muted-foreground">Set stock (pcs) per colour:</p>
                  {colors.map((c) => (
                    <div key={c} className="flex items-center gap-2 rounded-lg border border-border bg-secondary/30 px-3 py-2">
                      <span className="flex-1 text-sm font-medium text-foreground">{c}</span>
                      <Input
                        type="number"
                        min="0"
                        value={colorStock[c] ?? ""}
                        onChange={(e) => setColorStock((prev) => ({ ...prev, [c]: e.target.value }))}
                        placeholder="0"
                        className="h-8 w-24"
                      />
                      <span className="text-xs text-muted-foreground">pcs</span>
                      <button type="button" onClick={() => removeColor(c)} className="text-muted-foreground hover:text-destructive">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="mainImageFile">Main Image *</Label>
              <div className="flex items-center gap-2">
                <label htmlFor="mainImageFile" className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-secondary">
                  {uploadingMain ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {uploadingMain ? "Uploading..." : imageUrl ? "Replace image" : "Upload image"}
                </label>
                <input id="mainImageFile" type="file" accept="image/*" className="hidden" onChange={handleMainUpload} disabled={uploadingMain} />
                {imageUrl && <span className="truncate text-xs text-muted-foreground">Uploaded ✓</span>}
              </div>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label>Additional Images <span className="text-muted-foreground text-xs">(shown in gallery)</span></Label>
              <div className="flex items-center gap-2">
                <label htmlFor="extraImagesFile" className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-secondary">
                  {uploadingExtra ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {uploadingExtra ? "Uploading..." : "Upload more images"}
                </label>
                <input id="extraImagesFile" type="file" accept="image/*" multiple className="hidden" onChange={handleExtraUpload} disabled={uploadingExtra} />
              </div>
              {extraImages.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {extraImages.map((url) => (
                    <div key={url} className="relative">
                      <img src={url} alt="extra" className="h-16 w-16 rounded-lg border border-border object-cover" />
                      <button type="button" onClick={() => removeExtraImage(url)} className="absolute -right-1.5 -top-1.5 rounded-full bg-destructive p-0.5 text-destructive-foreground"><X className="h-3 w-3" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A lovely handmade piece..." rows={3} />
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="isNew" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} className="h-4 w-4 rounded border-input" />
              <Label htmlFor="isNew" className="cursor-pointer">Mark as New ✨</Label>
            </div>
          </div>

          {imageUrl && (
            <div className="mt-4">
              <p className="mb-1 text-xs text-muted-foreground">Preview:</p>
              <img src={imageUrl} alt="Preview" className="h-32 w-32 rounded-lg border border-border object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <Button type="submit" disabled={saveMutation.isPending} className="gap-2 rounded-full">
              <Plus className="h-4 w-4" />
              {editingId ? "Update Product" : "Add Product"}
            </Button>
            {editingId && <Button type="button" variant="outline" onClick={resetForm} className="rounded-full">Cancel</Button>}
          </div>
        </form>

        <h2 className="mb-2 font-display text-lg font-semibold text-foreground">📦 All Products ({ordered.length})</h2>
        <p className="mb-4 text-xs text-muted-foreground">Drag the ⋮⋮ handle to reorder — top = highest priority on the storefront.</p>

        {isLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : ordered.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <span className="mb-2 block text-4xl">🐰</span>
            <p className="font-display font-semibold text-foreground">No products yet!</p>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={ordered.map((p) => p.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {ordered.map((p) => (
                  <SortableRow
                    key={p.id}
                    p={p}
                    onEdit={fillForm}
                    onDelete={(p) => { if (confirm(`Delete "${p.name}"?`)) deleteMutation.mutate(p.id); }}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
};

export default AdminCharitha;

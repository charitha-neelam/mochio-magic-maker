import { useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import productPhoneCharm from "@/assets/product-phone-charm.jpg";
import productBracelet from "@/assets/product-bracelet.jpg";
import productPolaroid from "@/assets/product-polaroid.jpg";
import productCrochet from "@/assets/product-crochet.jpg";

// Placeholder products — replace with real data when backend is connected
const products = [
  {
    id: 1,
    name: "Blossom Phone Charm",
    image: productPhoneCharm,
    price: 249,
    originalPrice: 349,
    category: "Phone Charms",
    isNew: true,
  },
  {
    id: 2,
    name: "Dreamy Polaroid Set",
    image: productPolaroid,
    price: 199,
    category: "Custom Polaroids",
    isNew: true,
  },
  {
    id: 3,
    name: "Mochi Bunny Crochet",
    image: productCrochet,
    price: 399,
    originalPrice: 499,
    category: "Crochet",
    isNew: false,
  },
  {
    id: 4,
    name: "Dreamy Bracelet Set",
    image: productBracelet,
    price: 179,
    originalPrice: 249,
    category: "Bracelets",
    isNew: false,
  },
  {
    id: 5,
    name: "Sakura Phone Charm",
    image: productPhoneCharm,
    price: 199,
    originalPrice: 299,
    category: "Phone Charms",
    isNew: false,
  },
  {
    id: 5,
    name: "Starlight Polaroid",
    image: productPolaroid,
    price: 149,
    category: "Custom Polaroids",
    isNew: false,
  },
  {
    id: 6,
    name: "Baby Bunny Keychain",
    image: productCrochet,
    price: 349,
    originalPrice: 449,
    category: "Crochet",
    isNew: true,
  },
];

const categories = ["All", "Phone Charms", "Bracelets", "Custom Polaroids", "Crochet"];

const ProductGrid = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

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

        {/* Category filters */}
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

        {/* Products */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;

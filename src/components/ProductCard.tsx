import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  category: string;
  isNew?: boolean;
}

const ProductCard = ({
  name,
  image,
  price,
  originalPrice,
  category,
  isNew,
}: ProductCardProps) => {
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <motion.div
      className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-xl"
      whileHover={{ y: -6 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {isNew && (
            <Badge className="bg-accent text-accent-foreground border-0 font-display text-xs">
              ✨ New
            </Badge>
          )}
          {hasDiscount && (
            <Badge className="bg-primary text-primary-foreground border-0 font-display text-xs">
              -{discountPercent}%
            </Badge>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {category}
        </p>
        <h3 className="mb-2 font-display text-base font-semibold text-card-foreground">
          {name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="font-display text-lg font-bold text-warm-brown">
            ₹{price}
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              ₹{originalPrice}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;

import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Cart = () => {
  const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCart();

  const handleProceedToOrder = () => {
    const orderLines = items.map(
      (i) =>
        `• ${i.name}\n  Colour: ${i.color}\n  Qty: ${i.quantity}\n  Subtotal: ₹${i.price * i.quantity}`
    );
    const message = `Hi Mochio! 🐰 I'd like to place an order:\n\n${orderLines.join("\n\n")}\n\n🛒 Total: ₹${totalPrice}\n\nPlease confirm availability and let me know the next steps! 🙏`;
    const encoded = encodeURIComponent(message);
    window.open(`https://ig.me/m/mochio_store?text=${encoded}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Continue shopping
        </Link>

        <h1 className="mb-6 font-display text-2xl font-bold text-foreground">
          🛒 Your Cart
        </h1>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center">
            <ShoppingBag className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
            <p className="font-display text-lg font-semibold text-foreground">Cart is empty</p>
            <p className="mt-1 text-sm text-muted-foreground">Browse our collection and add some goodies!</p>
            <Link to="/">
              <Button className="mt-4 rounded-full">Shop Now</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={`${item.productId}-${item.color}`}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="flex items-center gap-4 rounded-xl border border-border bg-card p-3 shadow-sm"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-sm font-semibold text-foreground truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">Colour: {item.color}</p>
                      <p className="mt-1 font-display text-sm font-bold text-warm-brown">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>

                    {/* Quantity control */}
                    <div className="flex items-center gap-0 rounded-full border border-border">
                      <button
                        onClick={() => updateQuantity(item.productId, item.color, item.quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-l-full text-muted-foreground hover:bg-secondary"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="flex h-8 w-8 items-center justify-center text-xs font-semibold text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.color, item.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-r-full text-muted-foreground hover:bg-secondary"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.productId, item.color)}
                      className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <div className="mt-6 rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-medium text-muted-foreground">Total</span>
                <span className="font-display text-xl font-bold text-warm-brown">₹{totalPrice}</span>
              </div>
              <Button
                onClick={handleProceedToOrder}
                className="mt-4 w-full gap-2 rounded-full text-base"
                size="lg"
              >
                📩 Proceed to Order via Instagram
              </Button>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                You'll be redirected to DM @mochio_store with your order details
              </p>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;

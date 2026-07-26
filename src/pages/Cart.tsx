import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag, Camera, Copy, Instagram } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const Cart = () => {
  const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCart();
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderMessage, setOrderMessage] = useState("");

  const copyToClipboard = async (text: string): Promise<boolean> => {
    // Detect restricted embedding (e.g. Lovable preview iframe) where the
    // Clipboard API is blocked by Permissions Policy. In that case skip it
    // entirely to avoid the console violation and go straight to the fallback.
    let inRestrictedFrame = false;
    try {
      inRestrictedFrame = window.self !== window.top;
    } catch {
      inRestrictedFrame = true;
    }

    // Modern async API — works on desktop and most modern mobile browsers over HTTPS
    if (!inRestrictedFrame && navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        // fall through to legacy path
      }
    }
    // Legacy fallback for iOS Safari, in-app browsers, and non-HTTPS contexts
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "0";
    textarea.style.opacity = "0";
    textarea.style.pointerEvents = "none";
    document.body.appendChild(textarea);
    // iOS needs the element to be contentEditable + non-readonly briefly to allow selection
    const range = document.createRange();
    range.selectNodeContents(textarea);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    textarea.setSelectionRange(0, text.length);
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    selection?.removeAllRanges();
    document.body.removeChild(textarea);
    return ok;
  };

  const buildMessage = () => {
    const orderLines = items.map(
      (i) =>
        `• ${i.name}\n  Colour: ${i.color}\n  Qty: ${i.quantity}\n  Subtotal: ₹${i.price * i.quantity}`
    );
    return `Hi Mochio! 🐰 I'd like to place an order:\n\n${orderLines.join("\n\n")}\n\n🛒 Total: ₹${totalPrice}\n\nPlease confirm availability and let me know the next steps! 🙏`;
  };

  const handleProceedToOrder = () => {
    setOrderMessage(buildMessage());
    setShowOrderModal(true);
  };

  const handleCopy = async () => {
    const ok = await copyToClipboard(orderMessage);
    if (ok) toast.success("Order details copied! 📋");
    else toast.error("Couldn't copy — please select and copy manually");
  };

  const handleOpenInstagram = () => {
    window.open(`https://ig.me/m/mochio_store`, "_blank");
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
                We'll show you how to send your order to @mochio_store
              </p>
            </div>
          </>
        )}
      </div>
      <Footer />

      <Dialog open={showOrderModal} onOpenChange={setShowOrderModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              📩 Almost there! Send your order
            </DialogTitle>
            <DialogDescription>
              Follow these 3 quick steps to place your order with Mochio 🐰
            </DialogDescription>
          </DialogHeader>

          <ol className="space-y-3 text-sm">
            <li className="flex gap-3 rounded-lg bg-secondary/50 p-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">1</span>
              <div>
                <p className="font-semibold text-foreground flex items-center gap-1.5">
                  <Camera className="h-4 w-4" /> Take a screenshot
                </p>
                <p className="text-xs text-muted-foreground">Screenshot the order summary below so Mochio can see what you want.</p>
              </div>
            </li>
            <li className="flex gap-3 rounded-lg bg-secondary/50 p-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">2</span>
              <div>
                <p className="font-semibold text-foreground flex items-center gap-1.5">
                  <Copy className="h-4 w-4" /> Copy your order details
                </p>
                <p className="text-xs text-muted-foreground">Tap copy below, then paste it in the DM along with your screenshot.</p>
              </div>
            </li>
            <li className="flex gap-3 rounded-lg bg-secondary/50 p-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">3</span>
              <div>
                <p className="font-semibold text-foreground flex items-center gap-1.5">
                  <Instagram className="h-4 w-4" /> Open Instagram & send
                </p>
                <p className="text-xs text-muted-foreground">Send the screenshot + pasted message to @mochio_store. Done! 💌</p>
              </div>
            </li>
          </ol>

          <div className="rounded-lg border border-border bg-muted/40 p-3">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Your order summary</p>
            <pre className="max-h-40 overflow-auto whitespace-pre-wrap font-sans text-xs text-foreground">{orderMessage}</pre>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={handleCopy} className="flex-1 gap-2 rounded-full">
              <Copy className="h-4 w-4" /> Copy details
            </Button>
            <Button onClick={handleOpenInstagram} className="flex-1 gap-2 rounded-full">
              <Instagram className="h-4 w-4" /> Open Instagram
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cart;

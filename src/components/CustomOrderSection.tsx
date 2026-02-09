import { motion } from "framer-motion";
import { Palette, MessageCircle, Heart, Sparkles } from "lucide-react";
import customOrderBg from "@/assets/custom-order-bg.jpg";

const categories = [
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "Custom Phone Charms",
    description: "Choose your colors, charms & style — we'll craft it just for you!",
  },
  {
    icon: <Heart className="h-6 w-6" />,
    title: "Custom Bracelets",
    description: "Name bracelets, matching sets, or any design you dream of!",
  },
  {
    icon: <Palette className="h-6 w-6" />,
    title: "Custom Polaroids",
    description: "Send us your photos & we'll make them into cute keepsakes!",
  },
  {
    icon: <MessageCircle className="h-6 w-6" />,
    title: "Something Unique?",
    description: "Got a wild idea? DM us and let's make it happen together!",
  },
];

const CustomOrderSection = () => {
  return (
    <section id="custom" className="relative overflow-hidden py-20">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={customOrderBg}
          alt="Craft supplies"
          className="h-full w-full object-cover opacity-15"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      </div>

      <div className="container relative mx-auto px-4">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="mb-3 inline-block rounded-full bg-mauve/30 px-4 py-1.5 text-sm font-medium text-mauve-foreground">
            🎨 Make It Yours
          </span>
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Create Your Own Custom Piece
          </h2>
          <p className="mx-auto max-w-lg text-muted-foreground">
            Can't find exactly what you want? No worries — tell us your idea and
            we'll handcraft something special, just for you! 💌
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              className="group rounded-2xl border border-border bg-card/80 p-6 text-center backdrop-blur-sm transition-all hover:border-primary hover:shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                {cat.icon}
              </div>
              <h3 className="mb-2 font-display text-base font-semibold text-card-foreground">
                {cat.title}
              </h3>
              <p className="text-sm text-muted-foreground">{cat.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <motion.a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-warm-brown px-8 py-3 font-display font-semibold text-background shadow-lg transition-transform"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <MessageCircle className="h-5 w-5" />
            DM Us on Instagram 💌
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default CustomOrderSection;

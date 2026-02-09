import { motion } from "framer-motion";
import { Heart, Package, Star } from "lucide-react";

const features = [
  {
    icon: <Heart className="h-6 w-6" />,
    title: "Made With Love",
    desc: "Every single piece is handcrafted with care in our little studio.",
  },
  {
    icon: <Package className="h-6 w-6" />,
    title: "Cute Packaging",
    desc: "Your order arrives beautifully wrapped — perfect for gifting!",
  },
  {
    icon: <Star className="h-6 w-6" />,
    title: "100% Unique",
    desc: "No mass production here. Each piece is one-of-a-kind!",
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="bg-secondary/50 py-20">
      <div className="container mx-auto px-4">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="mb-3 inline-block rounded-full bg-sage/40 px-4 py-1.5 text-sm font-medium text-sage-foreground">
            🍀 About Us
          </span>
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Hi, We're Mochio! 🐰
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            We're a small handmade business that believes cute things make life better.
            From phone charms to custom bracelets, every piece is crafted with love,
            patience, and a sprinkle of magic. ✨
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-3">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              className="rounded-2xl border border-border bg-card p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
                {feat.icon}
              </div>
              <h3 className="mb-2 font-display font-semibold text-card-foreground">
                {feat.title}
              </h3>
              <p className="text-sm text-muted-foreground">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

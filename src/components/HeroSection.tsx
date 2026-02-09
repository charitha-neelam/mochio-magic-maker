import { motion } from "framer-motion";
import heroBanner from "@/assets/hero-banner.jpg";

const floatingEmojis = ["🐰", "🍀", "💕", "✨", "🎀", "🌸"];

const HeroSection = () => {
  return (
    <section id="home" className="relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroBanner}
          alt="Handmade crafts by Mochio Store"
          className="h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      {/* Floating decorations */}
      {floatingEmojis.map((emoji, i) => (
        <motion.span
          key={i}
          className="absolute text-2xl md:text-3xl select-none pointer-events-none"
          style={{
            left: `${10 + i * 15}%`,
            top: `${15 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -15, 0],
            rotate: [0, i % 2 === 0 ? 10 : -10, 0],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {emoji}
        </motion.span>
      ))}

      {/* Content */}
      <div className="container relative mx-auto px-4 py-20 md:py-32">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="mb-4 inline-block rounded-full bg-primary/20 px-4 py-1.5 text-sm font-medium text-warm-brown"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            🍀 Handmade with love 💕
          </motion.div>

          <h1 className="mb-6 text-4xl font-bold leading-tight text-foreground md:text-6xl">
            Welcome to{" "}
            <span className="text-gradient">Mochio Store</span>
          </h1>

          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            Cute handmade phone charms, custom bracelets, personalized Polaroids
            & more — each piece crafted with a little extra love! 🐰
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <motion.a
              href="#shop"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 font-display font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              Shop Now ✨
            </motion.a>
            <motion.a
              href="#custom"
              className="inline-flex items-center gap-2 rounded-full border-2 border-primary bg-background px-8 py-3 font-display font-semibold text-warm-brown transition-transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              Custom Orders 🎨
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

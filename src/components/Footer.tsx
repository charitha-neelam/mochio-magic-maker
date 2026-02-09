import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contact" className="border-t border-border bg-card py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="text-2xl">🐰</span>
              <span className="font-display text-lg font-bold text-warm-brown">
                Mochio Store
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Cute handmade goodies, crafted with love from our little studio to
              your hands. 🍀💕
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-3 font-display font-semibold text-foreground">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#shop" className="transition-colors hover:text-primary">Shop All</a></li>
              <li><a href="#custom" className="transition-colors hover:text-primary">Custom Orders</a></li>
              <li><a href="#about" className="transition-colors hover:text-primary">About Us</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="mb-3 font-display font-semibold text-foreground">
              Say Hi! 💌
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-primary">
                  Instagram
                </a>
              </li>
              <li>
                <a href="mailto:hello@mochiostore.com" className="transition-colors hover:text-primary">
                  hello@mochiostore.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-1 border-t border-border pt-6 text-sm text-muted-foreground">
          Made with <Heart className="h-3.5 w-3.5 text-primary" /> by Mochio Store © 2025
        </div>
      </div>
    </footer>
  );
};

export default Footer;

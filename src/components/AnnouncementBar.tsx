import { Heart, Sparkles, Star } from "lucide-react";

const announcements = [
  "✨ New Phone Charms Just Dropped! ✨",
  "🐰 Custom Bracelets — Made With Love 💕",
  "📸 Personalized Polaroids Now Available!",
  "🎀 Free Shipping on Orders Over ₹499!",
  "🌸 Handmade With Love by Mochio Store 🌸",
];

const AnnouncementBar = () => {
  const repeatedAnnouncements = [...announcements, ...announcements];

  return (
    <div className="bg-primary overflow-hidden py-2">
      <div className="animate-marquee flex whitespace-nowrap">
        {repeatedAnnouncements.map((text, index) => (
          <span
            key={index}
            className="mx-8 inline-flex items-center gap-2 text-sm font-medium text-primary-foreground"
          >
            <Sparkles className="h-3 w-3" />
            {text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementBar;
